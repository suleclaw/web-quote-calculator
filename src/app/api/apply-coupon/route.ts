import { NextRequest, NextResponse } from 'next/server';
import { applyCoupon } from '@/lib/coupons';

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

    const result = await applyCoupon(code, email);
    
    if (!result.valid) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Coupon apply error:', error);
    return NextResponse.json(
      { valid: false, reason: 'not_found' },
      { status: 500 }
    );
  }
}
