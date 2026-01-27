import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60000,
  maxRetries: 2,
});

// B2B API endpoint with API key authentication
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid API key' },
        { status: 401 }
      );
    }

    const apiKey = authHeader.substring(7);

    // Validate API key
    const keyRecord = await prisma.apiKey.findUnique({
      where: { key: apiKey },
    });

    if (!keyRecord || !keyRecord.isActive) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Check rate limit
    if (keyRecord.usageCount >= keyRecord.rateLimit) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', limit: keyRecord.rateLimit },
        { status: 429 }
      );
    }

    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided. Send base64 image in request body.' },
        { status: 400 }
      );
    }

    // Validate base64 image format
    if (!image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid image format. Must be base64 encoded with data URI.' },
        { status: 400 }
      );
    }

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 2048,
      temperature: 0,
      seed: 42,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: image, detail: 'high' },
            },
            {
              type: 'text',
              text: `You are a nutrition expert. Analyze this food label image and provide a health assessment.

Return JSON:
{
  "healthScore": <0-100>,
  "ingredients": [<key ingredients>],
  "analysis": "<2-3 sentence assessment>",
  "pros": [<positive aspects>],
  "cons": [<negative aspects>],
  "recommendation": "<consumption advice>",
  "nutritionFacts": {
    "calories": <number or null>,
    "sugar": "<value or null>",
    "sodium": "<value or null>",
    "protein": "<value or null>",
    "fiber": "<value or null>",
    "fat": "<value or null>"
  },
  "additives": [<detected additives/preservatives>],
  "allergens": [<detected allergens>]
}

IMPORTANT: Return ONLY valid JSON.`,
            },
          ],
        },
      ],
    });

    const messageContent = response.choices[0]?.message?.content;
    if (!messageContent) {
      throw new Error('No response from AI');
    }

    let jsonText = messageContent.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    const result = JSON.parse(jsonText);
    result.healthScore = Math.max(0, Math.min(100, Math.round(result.healthScore)));

    // Update usage count
    await prisma.apiKey.update({
      where: { id: keyRecord.id },
      data: {
        usageCount: { increment: 1 },
        lastUsed: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: result,
      usage: {
        used: keyRecord.usageCount + 1,
        limit: keyRecord.rateLimit,
        remaining: keyRecord.rateLimit - keyRecord.usageCount - 1,
      },
    });
  } catch (error) {
    console.error('API analysis error:', error);

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `AI service error: ${error.message}` },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 }
    );
  }
}
