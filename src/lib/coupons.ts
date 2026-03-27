import { promises as fs } from 'fs';
import path from 'path';

export interface Coupon {
  code: string;
  clientEmail: string;
  discountPercent: number;
  createdAt: string;
  expiresAt: string;
  used: boolean;
  usedAt: string | null;
}

export type CouponValidationResult =
  | { valid: true; discountPercent: number }
  | { valid: false; reason: 'not_found' | 'email_mismatch' | 'expired' | 'already_used' };

const COUPONS_FILE = path.join(process.cwd(), 'data', 'coupons.json');

async function readCoupons(): Promise<Record<string, Coupon>> {
  try {
    const data = await fs.readFile(COUPONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function writeCoupons(coupons: Record<string, Coupon>): Promise<void> {
  await fs.writeFile(COUPONS_FILE, JSON.stringify(coupons, null, 2));
}

export async function validateCoupon(
  code: string,
  email: string
): Promise<CouponValidationResult> {
  const coupons = await readCoupons();
  const coupon = coupons[code];

  if (!coupon) {
    return { valid: false, reason: 'not_found' };
  }

  if (coupon.used) {
    return { valid: false, reason: 'already_used' };
  }

  if (Date.now() > new Date(coupon.expiresAt).getTime()) {
    return { valid: false, reason: 'expired' };
  }

  if (coupon.clientEmail.toLowerCase() !== email.toLowerCase()) {
    return { valid: false, reason: 'email_mismatch' };
  }

  return { valid: true, discountPercent: coupon.discountPercent };
}

export async function applyCoupon(code: string, email: string): Promise<CouponValidationResult & { finalTotal?: number }> {
  const validation = await validateCoupon(code, email);
  
  if (!validation.valid) {
    return validation;
  }

  const coupons = await readCoupons();
  const coupon = coupons[code];
  
  coupon.used = true;
  coupon.usedAt = new Date().toISOString();
  coupons[code] = coupon;
  
  await writeCoupons(coupons);

  return {
    valid: true,
    discountPercent: coupon.discountPercent,
  };
}

export async function getAllCoupons(): Promise<Coupon[]> {
  const coupons = await readCoupons();
  return Object.values(coupons);
}

export async function createCoupon(
  clientEmail: string,
  discountPercent: number
): Promise<Coupon> {
  const coupons = await readCoupons();
  
  // Generate 6-char alphanumeric code
  const code = generateCouponCode();
  
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 2 weeks

  const coupon: Coupon = {
    code,
    clientEmail,
    discountPercent,
    createdAt: now.toISOString().split('T')[0],
    expiresAt: expiresAt.toISOString(),
    used: false,
    usedAt: null,
  };

  coupons[code] = coupon;
  await writeCoupons(coupons);

  return coupon;
}

export async function deleteCoupon(code: string): Promise<boolean> {
  const coupons = await readCoupons();
  
  if (!coupons[code]) {
    return false;
  }

  delete coupons[code];
  await writeCoupons(coupons);
  return true;
}

function generateCouponCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
