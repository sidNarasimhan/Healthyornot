'use client';

import { useState, useRef } from 'react';

interface AnalysisResult {
  healthScore: number;
  ingredients: string[];
  analysis: string;
  pros: string[];
  cons: string[];
  recommendation: string;
}

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const processImage = async (file: File) => {
    setError(null);
    setResult(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Image = e.target?.result as string;
      setImage(base64Image);
      await analyzeImage(base64Image);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (base64Image: string) => {
    setAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze image');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze image');
      console.error('Analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const resetScan = () => {
    setImage(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    if (score >= 30) return 'Poor';
    return 'Unhealthy';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🥗</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
              HealthyOrNot
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        {!image && (
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Scan Any Food Label
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Upload or capture a photo of any nutrition label. Our AI will analyze ingredients,
              decode the jargon, and tell you exactly how healthy it is.
            </p>
          </div>
        )}

        {/* Upload Section */}
        {!image && (
          <div className="max-w-2xl mx-auto animate-slide-up">
            <div className="bg-white rounded-3xl shadow-xl border-2 border-dashed border-gray-300 p-8 md:p-12 hover:border-emerald-400 transition-colors">
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    Get Started
                  </h3>
                  <p className="text-gray-600">
                    Choose how you'd like to scan your food label
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="camera-input"
                  />
                  <label
                    htmlFor="camera-input"
                    className="flex-1 sm:flex-none px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700 cursor-pointer transition-all transform hover:scale-105"
                  >
                    📸 Take Photo
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-input"
                  />
                  <label
                    htmlFor="file-input"
                    className="flex-1 sm:flex-none px-8 py-4 bg-white border-2 border-emerald-500 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 cursor-pointer transition-all transform hover:scale-105"
                  >
                    🖼️ Upload Image
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <span>💡</span> Tips for Best Results
              </h4>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Ensure good lighting and focus on the nutrition label</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Include the ingredients list for detailed analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Hold your device steady to avoid blurry images</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Loading State */}
        {analyzing && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <div className="w-20 h-20 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-6"></div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Analyzing Your Food Label...
              </h3>
              <p className="text-gray-600">
                Our AI is reading ingredients, checking nutritional values, and preparing your health report
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 animate-fade-in">
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h4 className="font-semibold text-red-900 mb-1">Analysis Failed</h4>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {result && image && !analyzing && (
          <div className="animate-fade-in space-y-6">
            {/* Image Preview */}
            <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
              <img
                src={image}
                alt="Scanned food label"
                className="w-full h-auto max-h-96 object-contain"
              />
            </div>

            {/* Health Score Card */}
            <div className="max-w-2xl mx-auto bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-8 border border-gray-200">
              <div className="text-center mb-8">
                <h3 className="text-gray-600 text-lg mb-4">Health Score</h3>
                <div className={`text-7xl font-bold ${getScoreColor(result.healthScore)} mb-2`}>
                  {result.healthScore}
                  <span className="text-4xl">/100</span>
                </div>
                <div className={`text-2xl font-semibold ${getScoreColor(result.healthScore)}`}>
                  {getScoreLabel(result.healthScore)}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-8 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    result.healthScore >= 70
                      ? 'bg-gradient-to-r from-green-500 to-green-600'
                      : result.healthScore >= 40
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                      : 'bg-gradient-to-r from-red-500 to-red-600'
                  }`}
                  style={{ width: `${result.healthScore}%` }}
                ></div>
              </div>

              {/* Analysis */}
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Analysis</h4>
                <p className="text-gray-700 leading-relaxed">{result.analysis}</p>
              </div>

              {/* Pros and Cons */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {result.pros.length > 0 && (
                  <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                      <span className="text-xl">✓</span> Pros
                    </h4>
                    <ul className="space-y-2">
                      {result.pros.map((pro, index) => (
                        <li key={index} className="text-green-800 text-sm flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.cons.length > 0 && (
                  <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                    <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                      <span className="text-xl">✗</span> Cons
                    </h4>
                    <ul className="space-y-2">
                      {result.cons.map((con, index) => (
                        <li key={index} className="text-red-800 text-sm flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Ingredients */}
              {result.ingredients.length > 0 && (
                <div className="mb-6 bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Ingredients Detected</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.ingredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-700"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendation */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <span>💡</span> Recommendation
                </h4>
                <p className="text-blue-800">{result.recommendation}</p>
              </div>
            </div>

            {/* Scan Another Button */}
            <div className="max-w-2xl mx-auto text-center">
              <button
                onClick={resetScan}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:scale-105"
              >
                Scan Another Product
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200 bg-white/50">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
          <p className="text-sm">
            Powered by Claude AI • Making healthy choices easier
          </p>
        </div>
      </footer>
    </div>
  );
}
