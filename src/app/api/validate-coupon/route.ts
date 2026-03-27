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
    console.error('Coupon validation error:', error);
    return NextResponse.json(
      { valid: false, reason: 'not_found' },
      { status: 500 }
    );
  }
}
