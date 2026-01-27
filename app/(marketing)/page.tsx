import Link from 'next/link';

export default function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span>🎉</span> Over 10,000 labels analyzed
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Know What You Eat<br />
            <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
              In Seconds
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Scan any food label with AI. Get instant health scores, ingredient breakdowns,
            and personalized recommendations. Make healthier choices effortlessly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/scan"
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:scale-105 text-lg"
            >
              Try Free - No Sign Up
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-emerald-500 hover:text-emerald-600 transition-all text-lg"
            >
              View Pricing
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            5 free scans/month • No credit card required
          </p>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-4">See It In Action</h2>
                <p className="text-gray-300 mb-6">
                  Simply point your camera at any nutrition label. Our AI reads every ingredient,
                  analyzes nutritional values, and gives you an instant health verdict.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">✓</div>
                    <span>Health score 0-100</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">✓</div>
                    <span>Ingredient breakdown</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">✓</div>
                    <span>Additive detection</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">✓</div>
                    <span>Personalized recommendations</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-center mb-4">
                  <div className="text-6xl font-bold text-yellow-500">62</div>
                  <div className="text-lg font-semibold text-gray-600">Health Score</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '62%' }}></div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="font-semibold text-green-800">Pros</div>
                    <ul className="text-green-700 mt-1">
                      <li>• High protein</li>
                      <li>• Good fiber</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="font-semibold text-red-800">Cons</div>
                    <ul className="text-red-700 mt-1">
                      <li>• High sodium</li>
                      <li>• Added sugars</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose HealthyOrNot?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powered by advanced AI to give you accurate, instant analysis
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 text-2xl">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Analysis</h3>
              <p className="text-gray-600">
                Get comprehensive health reports in under 3 seconds. No waiting, no manual entry.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-2xl">
                🔬
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Science-Based Scoring</h3>
              <p className="text-gray-600">
                Our algorithm considers 20+ nutritional factors based on WHO and FDA guidelines.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6 text-2xl">
                🎯
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Personalized Advice</h3>
              <p className="text-gray-600">
                Get recommendations tailored to your dietary needs and health goals.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-6 text-2xl">
                🧪
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Additive Detection</h3>
              <p className="text-gray-600">
                Identifies harmful preservatives, artificial colors, and hidden ingredients.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6 text-2xl">
                ⚠️
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Allergen Alerts</h3>
              <p className="text-gray-600">
                Automatic detection of common allergens and dietary restrictions.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 text-2xl">
                📊
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Scan History</h3>
              <p className="text-gray-600">
                Track your food choices over time and see your health trends improve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 bg-emerald-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Health-Conscious People
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center gap-1 text-yellow-400 mb-4">
                {'★'.repeat(5)}
              </div>
              <p className="text-gray-700 mb-4">
                "Finally an app that tells me the truth about food labels. Found out my 'healthy'
                granola bars were loaded with sugar!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-200 rounded-full flex items-center justify-center">S</div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah M.</div>
                  <div className="text-sm text-gray-500">Fitness Enthusiast</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center gap-1 text-yellow-400 mb-4">
                {'★'.repeat(5)}
              </div>
              <p className="text-gray-700 mb-4">
                "As a diabetic, this app is a lifesaver. I can quickly check sugar content and
                make better decisions at the grocery store."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">M</div>
                <div>
                  <div className="font-semibold text-gray-900">Michael T.</div>
                  <div className="text-sm text-gray-500">Type 2 Diabetic</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center gap-1 text-yellow-400 mb-4">
                {'★'.repeat(5)}
              </div>
              <p className="text-gray-700 mb-4">
                "My kids love scanning food with me. It's become a fun way to teach them about
                nutrition and making healthy choices."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">J</div>
                <div>
                  <div className="font-semibold text-gray-900">Jennifer L.</div>
                  <div className="text-sm text-gray-500">Mom of 3</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Start Making Healthier Choices Today
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of people who use HealthyOrNot to decode food labels and eat better.
          </p>
          <Link
            href="/scan"
            className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:scale-105 text-lg"
          >
            Scan Your First Label Free
          </Link>
        </div>
      </section>
    </>
  );
}
