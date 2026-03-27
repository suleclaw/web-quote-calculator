import { NextRequest, NextResponse } from 'next/server';
import { validateCoupon } from '@/lib/coupons';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, email } = body;

    if (!code || !email) {
      return NextResponse.json(
        { valid: false, reason: 'not_found' },
        { status: 400 }
      );
    }

    const result = await validateCoupon(code, email);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Coupon validation error:', message);
    return NextResponse.json(
      { valid: false, reason: 'not_found', error: message },
      { status: 500 }
    );
  }
}
