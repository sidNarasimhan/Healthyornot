import Link from 'next/link';

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🥗</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                API Documentation
              </h1>
            </Link>
            <Link href="/pricing" className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700">
              Get API Access
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">HealthyOrNot API</h1>
          <p className="text-xl text-gray-600 mb-8">
            Integrate AI-powered food label analysis into your application.
          </p>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication</h2>
            <p className="text-gray-700 mb-4">
              All API requests require authentication using a Bearer token. Include your API key in the Authorization header:
            </p>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-xl overflow-x-auto">
{`Authorization: Bearer your_api_key_here`}
            </pre>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Analyze Food Label</h2>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded font-mono text-sm font-bold">POST</span>
              <code className="text-gray-700">/api/v1/analyze</code>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Request Body</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-xl overflow-x-auto">
{`{
  "image": "data:image/jpeg;base64,/9j/4AAQ..."
}`}
            </pre>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Response</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-xl overflow-x-auto">
{`{
  "success": true,
  "data": {
    "healthScore": 65,
    "ingredients": ["Whole Wheat Flour", "Sugar", "Salt"],
    "analysis": "Moderate health score. Contains whole grains but also added sugars.",
    "pros": ["High fiber", "Whole grain source"],
    "cons": ["Contains added sugars", "Moderate sodium"],
    "recommendation": "Consume in moderation as part of a balanced diet.",
    "nutritionFacts": {
      "calories": 120,
      "sugar": "8g",
      "sodium": "180mg",
      "protein": "4g",
      "fiber": "3g",
      "fat": "2g"
    },
    "additives": ["Natural Flavors"],
    "allergens": ["Wheat"]
  },
  "usage": {
    "used": 45,
    "limit": 1000,
    "remaining": 955
  }
}`}
            </pre>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Rate Limits</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 text-gray-900">Plan</th>
                  <th className="text-left py-3 text-gray-900">Requests/Month</th>
                  <th className="text-left py-3 text-gray-900">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 text-gray-700">Business</td>
                  <td className="py-3 text-gray-700">1,000</td>
                  <td className="py-3 text-gray-700">$29.99/mo</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 text-gray-700">Enterprise</td>
                  <td className="py-3 text-gray-700">10,000+</td>
                  <td className="py-3 text-gray-700">Contact us</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Code Examples</h2>

            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-3">Python</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-xl overflow-x-auto text-sm">
{`import requests
import base64

# Read image and convert to base64
with open("food_label.jpg", "rb") as f:
    image_data = base64.b64encode(f.read()).decode()

response = requests.post(
    "https://healthyornot.app/api/v1/analyze",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={"image": f"data:image/jpeg;base64,{image_data}"}
)

result = response.json()
print(f"Health Score: {result['data']['healthScore']}")`}
            </pre>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">JavaScript/Node.js</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-xl overflow-x-auto text-sm">
{`const fs = require('fs');

const imageData = fs.readFileSync('food_label.jpg').toString('base64');

const response = await fetch('https://healthyornot.app/api/v1/analyze', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    image: \`data:image/jpeg;base64,\${imageData}\`
  }),
});

const result = await response.json();
console.log(\`Health Score: \${result.data.healthScore}\`);`}
            </pre>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">cURL</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-xl overflow-x-auto text-sm">
{`curl -X POST https://healthyornot.app/api/v1/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"image": "data:image/jpeg;base64,..."}'`}
            </pre>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-gray-700 mb-6">
              Get your API key and start integrating food label analysis into your app.
            </p>
            <Link
              href="/pricing"
              className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700"
            >
              Get API Access
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
