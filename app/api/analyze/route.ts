import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface AnalysisResult {
  healthScore: number;
  ingredients: string[];
  analysis: string;
  pros: string[];
  cons: string[];
  recommendation: string;
}

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Extract base64 data and media type
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json(
        { error: 'Invalid image format' },
        { status: 400 }
      );
    }

    const mediaType = matches[1];
    const base64Data = matches[2];

    // Validate media type
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(mediaType)) {
      return NextResponse.json(
        { error: 'Unsupported image format. Please use JPEG, PNG, GIF, or WebP' },
        { status: 400 }
      );
    }

    // Call Claude API with vision
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                data: base64Data,
              },
            },
            {
              type: 'text',
              text: `You are a nutrition expert and food scientist. Analyze this food label image and provide a comprehensive health assessment.

Please extract and analyze:
1. All visible ingredients
2. Nutritional information (calories, sugar, sodium, fats, protein, etc.)
3. Additives, preservatives, and artificial ingredients
4. Any allergens or concerning chemicals

Based on your analysis, provide a response in the following JSON format:
{
  "healthScore": <number 0-100>,
  "ingredients": [<array of key ingredients found>],
  "analysis": "<2-3 sentence overall health assessment in simple terms>",
  "pros": [<array of positive aspects, health benefits>],
  "cons": [<array of negative aspects, health concerns>],
  "recommendation": "<brief recommendation on consumption - should they eat it, how often, etc.>"
}

Scoring guidelines:
- 80-100: Excellent - whole foods, minimal processing, great nutrition
- 60-79: Good - decent nutrition, some processing acceptable
- 40-59: Fair - moderate concerns, okay occasionally
- 20-39: Poor - significant concerns, limit consumption
- 0-19: Unhealthy - avoid or consume very rarely

Translate all scientific/chemical jargon into simple language people can understand. Be honest and direct about health impacts.

IMPORTANT: Respond ONLY with valid JSON, no additional text or markdown.`,
            },
          ],
        },
      ],
    });

    // Extract the text response
    const textContent = message.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    // Parse the JSON response
    let result: AnalysisResult;
    try {
      // Clean up the response - remove markdown code blocks if present
      let jsonText = textContent.text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json\n/, '').replace(/\n```$/, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```\n/, '').replace(/\n```$/, '');
      }

      result = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', textContent.text);
      throw new Error('Failed to parse AI response');
    }

    // Validate the response structure
    if (
      typeof result.healthScore !== 'number' ||
      !Array.isArray(result.ingredients) ||
      typeof result.analysis !== 'string' ||
      !Array.isArray(result.pros) ||
      !Array.isArray(result.cons) ||
      typeof result.recommendation !== 'string'
    ) {
      throw new Error('Invalid response structure from AI');
    }

    // Ensure health score is within range
    result.healthScore = Math.max(0, Math.min(100, Math.round(result.healthScore)));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Analysis error:', error);

    // Check if it's an Anthropic API error
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `AI service error: ${error.message}` },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
