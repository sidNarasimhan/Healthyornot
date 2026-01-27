import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiting (use Redis in production)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 10; // requests per window
const WINDOW_MS = 60 * 1000; // 1 minute

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'anonymous';
  return `${ip}:${request.nextUrl.pathname}`;
}

export function middleware(request: NextRequest) {
  // Only rate limit API routes (not the B2B API which has its own limits)
  if (request.nextUrl.pathname === '/api/analyze') {
    const key = getRateLimitKey(request);
    const now = Date.now();

    const rateLimitInfo = rateLimit.get(key);

    if (!rateLimitInfo || now > rateLimitInfo.resetTime) {
      rateLimit.set(key, { count: 1, resetTime: now + WINDOW_MS });
    } else if (rateLimitInfo.count >= RATE_LIMIT) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    } else {
      rateLimitInfo.count++;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
