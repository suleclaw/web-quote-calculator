import { NextRequest, NextResponse } from 'next/server';
import { applyCoupon } from '@/lib/coupons';

// Rate limiting
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimits.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  // Rate limit: 20 requests per minute per IP
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  if (!rateLimit(`apply-coupon:${ip}`, 20, 60000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { code, email } = body;

    // Always return generic response to prevent email enumeration
    if (!code || !email) {
      return NextResponse.json({ valid: false, reason: 'invalid' }, { status: 400 });
    }

    // Validate email format before processing
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ valid: false, reason: 'invalid' }, { status: 400 });
    }

    const result = await applyCoupon(code, email);

    // Always return generic invalid message if not valid
    if (!result.valid) {
      return NextResponse.json({ valid: false, reason: 'invalid' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Coupon apply error:', error);
    // Always return generic response - don't leak internal errors
    return NextResponse.json({ valid: false, reason: 'invalid' }, { status: 400 });
  }
}
