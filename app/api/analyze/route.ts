import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

// Configure API route for larger payloads and longer execution
export const maxDuration = 60; // Maximum execution time in seconds
export const dynamic = 'force-dynamic'; // Force dynamic rendering

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60000, // 60 second timeout
  maxRetries: 2,
});

interface AnalysisResult {
  healthScore: number;
  ingredients: string[];
  analysis: string;
  pros: string[];
  cons: string[];
  recommendation: string;
  healthRisks: Array<{
    ingredient: string;
    why: string;
    risks: string[];
    longTermEffects: string;
  }>;
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
      max_tokens: 3500, // Increased for detailed health risks analysis
      temperature: 0, // Deterministic responses for consistency
      seed: 42, // Fixed seed for reproducible results
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
              text: `You are a nutrition expert and food scientist. Analyze this food label image and provide a comprehensive, CONSISTENT health assessment based on objective nutritional criteria.

Extract and analyze:
1. All visible ingredients (list first 5-10 key ones)
2. Nutritional information (calories, sugar, sodium, saturated fat, protein, fiber, vitamins)
3. Additives, preservatives, and artificial ingredients
4. Allergens and concerning chemicals

Provide a response in this EXACT JSON format:
{
  "healthScore": <number 0-100>,
  "ingredients": [<array of key ingredients found>],
  "analysis": "<2-3 sentence overall health assessment>",
  "pros": [<array of 2-4 positive aspects>],
  "cons": [<array of 2-4 negative aspects>],
  "recommendation": "<brief consumption recommendation>",
  "healthRisks": [
    {
      "ingredient": "<harmful ingredient name>",
      "why": "<why this ingredient is concerning in simple terms>",
      "risks": ["<specific illness/condition 1>", "<specific illness/condition 2>"],
      "longTermEffects": "<long-term health effects from regular consumption>"
    }
  ]
}

SCORING CRITERIA (apply consistently):
Calculate score by starting at 50 and adjusting:

SUBTRACT points for:
- Added sugars: -2 per 5g (max -20)
- Sodium: -2 per 200mg (max -20)
- Saturated fat: -2 per 3g (max -15)
- Trans fat: -10 per 1g (max -20)
- Artificial sweeteners/colors: -5 each (max -10)
- High fructose corn syrup: -10
- Hydrogenated oils: -10
- Preservatives (BHA, BHT, sodium benzoate): -5 each (max -10)

ADD points for:
- Whole food ingredients (first 3): +5 each (max +15)
- Fiber: +2 per 3g (max +15)
- Protein: +2 per 5g (max +15)
- Vitamins/minerals (>10% DV): +2 each (max +10)
- Organic certification: +5
- No artificial ingredients: +5
- Low/no added sugar: +5

Final ranges:
- 80-100: Whole foods, minimal processing, excellent nutrition
- 60-79: Good nutrition, acceptable processing
- 40-59: Moderate concerns, consume occasionally
- 20-39: Significant health concerns, limit intake
- 0-19: Highly processed, avoid regularly

HEALTH RISKS ANALYSIS:
For each concerning ingredient (limit to 3-5 most harmful ones), provide:
- ingredient: The specific ingredient name
- why: Explain in 1-2 sentences why it's concerning (mechanism of harm)
- risks: List 2-4 specific health conditions or illnesses linked to this ingredient
- longTermEffects: Describe cumulative effects from regular/chronic consumption

Focus on ingredients like:
- High fructose corn syrup (insulin resistance, obesity, fatty liver)
- Trans fats/hydrogenated oils (heart disease, inflammation)
- Artificial sweeteners (gut microbiome disruption, metabolic issues)
- Sodium benzoate (hyperactivity, allergic reactions)
- Artificial colors (behavioral issues in children, allergic reactions)
- MSG (headaches, allergic reactions in sensitive individuals)
- Excessive sodium (hypertension, kidney disease, stroke)
- Excessive sugar (diabetes, obesity, tooth decay, inflammation)

Only include ingredients that are actually present in the product and pose genuine health concerns.

BE CONSISTENT: Same label = same score. Base decisions on measurable nutritional data, not subjective interpretation.

IMPORTANT: Return ONLY valid JSON, no markdown formatting.`,
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
      typeof result.recommendation !== 'string' ||
      !Array.isArray(result.healthRisks)
    ) {
      throw new Error('Invalid response structure from AI');
    }

    // Ensure health score is within range
    result.healthScore = Math.max(0, Math.min(100, Math.round(result.healthScore)));

    // Ensure healthRisks has default empty array if not provided
    if (!result.healthRisks) {
      result.healthRisks = [];
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Analysis error:', error);

    // Check if it's an OpenAI API error
    if (error instanceof OpenAI.APIError) {
      console.error('OpenAI API Error:', {
        status: error.status,
        message: error.message,
        type: error.type,
        code: error.code,
      });
      return NextResponse.json(
        { error: `AI service error: ${error.message}` },
        { status: error.status || 500 }
      );
    }

    // Handle connection errors specifically
    if (error instanceof Error && error.message.includes('fetch')) {
      console.error('Network/Connection error:', error.message);
      return NextResponse.json(
        { error: 'Network error connecting to AI service. Please check your internet connection and try again.' },
        { status: 503 }
      );
    }

    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
