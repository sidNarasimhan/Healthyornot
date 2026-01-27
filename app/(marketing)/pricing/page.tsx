'use client';

import { useSession, signIn } from 'next-auth/react';
import { useState } from 'react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out',
    features: [
      '5 scans per month',
      'Basic health scoring',
      'Ingredient detection',
      'Pros & cons breakdown',
    ],
    cta: 'Get Started',
    plan: 'free',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$4.99',
    period: '/month',
    description: 'For health enthusiasts',
    features: [
      'Unlimited scans',
      'Scan history & trends',
      'Detailed ingredient analysis',
      'Personalized recommendations',
      'Export PDF reports',
      'Priority support',
    ],
    cta: 'Start Pro Trial',
    plan: 'pro',
    popular: true,
  },
  {
    name: 'Business',
    price: '$29.99',
    period: '/month',
    description: 'For teams & developers',
    features: [
      'Everything in Pro',
      'API access (1,000 calls/mo)',
      'Team accounts (5 users)',
      'Custom integrations',
      'Webhook notifications',
      'Dedicated support',
    ],
    cta: 'Contact Sales',
    plan: 'business',
    popular: false,
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: string) => {
    if (!session) {
      signIn();
      return;
    }

    if (plan === 'free') {
      window.location.href = '/scan';
      return;
    }

    if (plan === 'business') {
      window.location.href = 'mailto:sales@healthyornot.app?subject=Business Plan Inquiry';
      return;
    }

    setLoading(plan);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-3xl shadow-xl p-8 ${
                plan.popular ? 'ring-2 ring-emerald-500 scale-105' : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h2>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-sm">
                      ✓
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.plan)}
                disabled={loading === plan.plan}
                className={`w-full py-4 rounded-xl font-semibold transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${loading === plan.plan ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading === plan.plan ? 'Loading...' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can cancel your subscription at any time. You'll continue to have access
                until the end of your billing period.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                What happens when I hit my scan limit?
              </h3>
              <p className="text-gray-600">
                On the free plan, you'll be prompted to upgrade when you reach 5 scans. Your scan
                count resets at the beginning of each month.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                How does the API work?
              </h3>
              <p className="text-gray-600">
                Business plan includes API access with your own API key. Send POST requests with
                food label images and receive JSON health analysis in response.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Is my data secure?
              </h3>
              <p className="text-gray-600">
                Absolutely. We don't store your images after analysis. Your scan history is
                encrypted and never shared with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
