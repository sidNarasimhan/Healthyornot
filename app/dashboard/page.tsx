'use client';

import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Scan {
  id: string;
  healthScore: number;
  analysis: string;
  ingredients: string[];
  pros: string[];
  cons: string[];
  createdAt: string;
}

interface Usage {
  allowed: boolean;
  remaining: number;
  limit: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [scans, setScans] = useState<Scan[]>([]);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      Promise.all([
        fetch('/api/scans').then(r => r.json()),
        fetch('/api/usage').then(r => r.json()),
      ]).then(([scansData, usageData]) => {
        setScans(scansData.scans || []);
        setUsage(usageData);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [session]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign in to view your dashboard</h1>
          <button
            onClick={() => signIn()}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-500 bg-green-100';
    if (score >= 40) return 'text-yellow-500 bg-yellow-100';
    return 'text-red-500 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🥗</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/scan" className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700">
              New Scan
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Usage Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="text-sm text-gray-500 mb-1">Plan</div>
            <div className="text-2xl font-bold text-gray-900">
              {session.user.isPro ? 'Pro' : 'Free'}
            </div>
            {!session.user.isPro && (
              <Link href="/pricing" className="text-emerald-600 text-sm font-medium hover:underline">
                Upgrade to Pro
              </Link>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="text-sm text-gray-500 mb-1">Scans This Month</div>
            <div className="text-2xl font-bold text-gray-900">
              {usage?.limit === -1 ? 'Unlimited' : `${(usage?.limit || 5) - (usage?.remaining || 0)} / ${usage?.limit || 5}`}
            </div>
            {usage && usage.limit !== -1 && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{ width: `${((usage.limit - usage.remaining) / usage.limit) * 100}%` }}
                ></div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="text-sm text-gray-500 mb-1">Total Scans</div>
            <div className="text-2xl font-bold text-gray-900">{scans.length}</div>
          </div>
        </div>

        {/* Scan History */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Scan History</h2>

          {scans.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📸</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No scans yet</h3>
              <p className="text-gray-600 mb-4">Start scanning food labels to see your history here</p>
              <Link
                href="/scan"
                className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700"
              >
                Scan Your First Label
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {scans.map((scan) => (
                <div key={scan.id} className="border border-gray-200 rounded-xl p-4 hover:border-emerald-300 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`px-3 py-1 rounded-full font-bold ${getScoreColor(scan.healthScore)}`}>
                      {scan.healthScore}/100
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(scan.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">{scan.analysis}</p>
                  <div className="flex flex-wrap gap-1">
                    {scan.ingredients.slice(0, 5).map((ing, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                        {ing}
                      </span>
                    ))}
                    {scan.ingredients.length > 5 && (
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                        +{scan.ingredients.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
