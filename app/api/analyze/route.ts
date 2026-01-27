import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60000,
  maxRetries: 2,
});

interface AnalysisResult {
  healthScore: number;
  ingredients: string[];
  analysis: string;
  pros: string[];
  cons: string[];
  recommendation: string;
  isValidLabel?: boolean;
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

    // Call OpenAI API with vision - with nutrition label validation
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
              image_url: {
                url: image,
                detail: 'high'
              },
            },
            {
              type: 'text',
              text: `You are a nutrition expert and food scientist. First, determine if this image contains a food/nutrition label, nutrition facts panel, or ingredient list from a food product.

STEP 1 - VALIDATE IMAGE:
Check if the image contains ANY of the following:
- Nutrition Facts panel (US style)
- Nutrition Information table (UK/EU/India/other international styles)
- Ingredient list from food packaging
- Back label of a food/beverage product
- Any food product packaging showing nutritional data

If the image does NOT contain nutritional information or food label content (e.g., it's a selfie, landscape, random object, front of package without nutrition info, etc.), respond with EXACTLY this JSON:
{
  "isValidLabel": false,
  "error": "Please upload a picture of the nutrition label or back label of a food product. This image doesn't appear to contain nutritional information."
}

STEP 2 - IF VALID, ANALYZE:
If the image DOES contain a nutrition label or ingredient list, analyze it and respond with:
{
  "isValidLabel": true,
  "healthScore": <number 0-100>,
  "ingredients": [<array of key ingredients found, up to 10>],
  "analysis": "<2-3 sentence overall health assessment>",
  "pros": [<array of 2-4 positive aspects>],
  "cons": [<array of 2-4 negative aspects>],
  "recommendation": "<brief consumption recommendation>"
}

SCORING CRITERIA (apply consistently):
Start at 50 and adjust:

SUBTRACT points for:
- Added sugars: -2 per 5g (max -20)
- Sodium: -2 per 200mg (max -20)
- Saturated fat: -2 per 3g (max -15)
- Trans fat: -10 per 1g (max -20)
- Artificial sweeteners (aspartame, sucralose, acesulfame-k): -5 each (max -10)
- Artificial colors (E-numbers like E150, tartrazine): -3 each (max -10)
- High fructose corn syrup: -10
- Hydrogenated/partially hydrogenated oils: -10
- Preservatives (BHA, BHT, sodium benzoate, potassium sorbate): -3 each (max -10)

ADD points for:
- Whole food as first ingredient: +10
- Fiber: +2 per 3g (max +15)
- Protein: +2 per 5g (max +15)
- Vitamins/minerals (>10% DV): +2 each (max +10)
- No artificial ingredients: +5
- No added sugar or low sugar (<5g): +5
- Whole grains: +5

INTERNATIONAL LABEL SUPPORT:
- Recognize nutrition labels in ANY format (US, EU, UK, India, Australia, etc.)
- Handle both metric (g, mg, kJ) and imperial units
- Recognize "per serving" and "per 100g" formats
- Understand multi-language labels

Final score ranges:
- 80-100: Excellent - whole foods, minimal processing
- 60-79: Good - acceptable nutrition and processing
- 40-59: Fair - moderate concerns, consume occasionally
- 20-39: Poor - significant health concerns, limit intake
- 0-19: Avoid - highly processed, unhealthy

IMPORTANT: Return ONLY valid JSON, no markdown formatting or code blocks.`,
            },
          ],
        },
      ],
    });

    const messageContent = response.choices[0]?.message?.content;
    if (!messageContent) {
      throw new Error('No response from AI service');
    }

    // Parse the JSON response
    let result: AnalysisResult;
    try {
      let jsonText = messageContent.trim();
      // Remove markdown code blocks if present
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```\n?/, '').replace(/\n?```$/, '');
      }

      result = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', messageContent);
      throw new Error('Failed to parse AI response');
    }

    // Check if image was validated as a nutrition label
    if (result.isValidLabel === false) {
      return NextResponse.json(
        {
          error: result.error || 'Please upload a picture of the nutrition label or back label of a food product.',
          isValidLabel: false
        },
        { status: 400 }
      );
    }

    // Validate the response structure for valid labels
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

    // Remove the isValidLabel field from successful response
    const { isValidLabel, ...cleanResult } = result;

    return NextResponse.json(cleanResult);
  } catch (error) {
    console.error('Analysis error:', error);

    if (error instanceof OpenAI.APIError) {
      console.error('OpenAI API Error:', {
        status: error.status,
        message: error.message,
        type: error.type,
        code: error.code,
      });

      if (error.status === 401) {
        return NextResponse.json(
          { error: 'AI service configuration error. Please contact support.' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: `AI service error: ${error.message}` },
        { status: error.status || 500 }
      );
    }

    if (error instanceof Error && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: 'Network error connecting to AI service. Please check your internet connection and try again.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
