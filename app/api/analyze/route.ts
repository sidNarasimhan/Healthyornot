import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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

    // Validate base64 image format
    if (!image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid image format' },
        { status: 400 }
      );
    }

    // Call OpenAI API with vision
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: image,
                detail: 'high'
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
    const messageContent = response.choices[0]?.message?.content;
    if (!messageContent) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    let result: AnalysisResult;
    try {
      // Clean up the response - remove markdown code blocks if present
      let jsonText = messageContent.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json\n/, '').replace(/\n```$/, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```\n/, '').replace(/\n```$/, '');
      }

      result = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', messageContent);
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

    // Check if it's an OpenAI API error
    if (error instanceof OpenAI.APIError) {
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
