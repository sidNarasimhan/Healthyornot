/**
 * Test script for validating the HealthyOrNot API with various images
 *
 * Run with: npx ts-node scripts/test-images.ts
 * Or after starting dev server: npm run test:images
 */

import * as fs from 'fs';
import * as path from 'path';

const API_URL = process.env.API_URL || 'http://localhost:3000/api/analyze';

interface TestResult {
  image: string;
  success: boolean;
  healthScore?: number;
  ingredients?: string[];
  error?: string;
  responseTime: number;
}

async function imageToBase64(imagePath: string): Promise<string> {
  const absolutePath = path.resolve(imagePath);
  const imageBuffer = fs.readFileSync(absolutePath);
  const base64 = imageBuffer.toString('base64');
  const ext = path.extname(imagePath).toLowerCase();

  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
  };

  const mimeType = mimeTypes[ext] || 'image/jpeg';
  return `data:${mimeType};base64,${base64}`;
}

async function testImage(imagePath: string): Promise<TestResult> {
  const startTime = Date.now();
  const imageName = path.basename(imagePath);

  try {
    console.log(`\n📸 Testing: ${imageName}`);

    const base64Image = await imageToBase64(imagePath);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image }),
    });

    const data = await response.json();
    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      console.log(`   ❌ Error: ${data.error}`);
      return {
        image: imageName,
        success: false,
        error: data.error,
        responseTime,
      };
    }

    console.log(`   ✅ Health Score: ${data.healthScore}/100`);
    console.log(`   📝 Analysis: ${data.analysis}`);
    console.log(`   🧪 Ingredients: ${data.ingredients?.slice(0, 5).join(', ')}...`);
    console.log(`   ⏱️  Response time: ${responseTime}ms`);

    return {
      image: imageName,
      success: true,
      healthScore: data.healthScore,
      ingredients: data.ingredients,
      responseTime,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.log(`   ❌ Failed: ${errorMessage}`);

    return {
      image: imageName,
      success: false,
      error: errorMessage,
      responseTime,
    };
  }
}

async function main() {
  console.log('🥗 HealthyOrNot API Test Suite');
  console.log('================================\n');

  const testImagesDir = path.join(__dirname, '..', 'testimages');

  if (!fs.existsSync(testImagesDir)) {
    console.error('❌ Test images directory not found:', testImagesDir);
    process.exit(1);
  }

  const imageFiles = fs.readdirSync(testImagesDir)
    .filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
    .map(f => path.join(testImagesDir, f));

  console.log(`Found ${imageFiles.length} test images\n`);

  const results: TestResult[] = [];

  for (const imagePath of imageFiles) {
    const result = await testImage(imagePath);
    results.push(result);
  }

  // Summary
  console.log('\n\n📊 Test Summary');
  console.log('================');

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`✅ Passed: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}`);

  if (successful.length > 0) {
    const avgScore = successful.reduce((sum, r) => sum + (r.healthScore || 0), 0) / successful.length;
    const avgTime = successful.reduce((sum, r) => sum + r.responseTime, 0) / successful.length;
    console.log(`📈 Average Health Score: ${avgScore.toFixed(1)}`);
    console.log(`⏱️  Average Response Time: ${avgTime.toFixed(0)}ms`);
  }

  if (failed.length > 0) {
    console.log('\n❌ Failed Images:');
    failed.forEach(r => {
      console.log(`   - ${r.image}: ${r.error}`);
    });
  }

  // Detailed results table
  console.log('\n\n📋 Detailed Results');
  console.log('====================');
  console.log('Image                                          | Score | Time    | Status');
  console.log('-----------------------------------------------|-------|---------|--------');

  results.forEach(r => {
    const name = r.image.substring(0, 45).padEnd(45);
    const score = r.success ? String(r.healthScore).padStart(5) : '  N/A';
    const time = `${r.responseTime}ms`.padStart(7);
    const status = r.success ? '✅' : '❌';
    console.log(`${name} | ${score} | ${time} | ${status}`);
  });
}

main().catch(console.error);
