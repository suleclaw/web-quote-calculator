import { promises as fs } from 'fs';
import path from 'path';

// KV client type
interface KVClient {
  get: (key: string) => Promise<Record<string, Coupon> | null>;
  set: (key: string, value: Record<string, Coupon>) => Promise<void>;
}

// Check KV availability at runtime (not build time)
function isKVConfigured(): boolean {
  return !!(process.env.KV_REST_API_TOKEN && process.env.KV_URL);
}

let kv: KVClient | null = null;
try {
  if (isKVConfigured()) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const vercelKv = require('@vercel/kv') as { kv: KVClient };
    kv = vercelKv.kv;
    console.log('[coupons] Vercel KV configured — using Redis storage');
  } else {
    console.log('[coupons] KV not configured — using JSON file storage');
  }
} catch (error) {
  console.error('[coupons] Failed to initialize KV client:', error);
  kv = null;
}

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
  // Try KV first if configured
  if (isKVConfigured() && kv) {
    try {
      const data = await kv.get('coupons');
      if (data) {
        console.log('[coupons] Read', Object.keys(data).length, 'coupons from KV');
        return data;
      }
    } catch (error) {
      console.error('[coupons] KV read failed, falling back to JSON file:', error);
    }
  }

  // Fallback to JSON file for local dev
  try {
    const data = await fs.readFile(COUPONS_FILE, 'utf-8');
    console.log('[coupons] Read coupons from JSON file');
    return JSON.parse(data);
  } catch {
    console.log('[coupons] No JSON file found, starting empty');
    return {};
  }
}

async function writeCoupons(coupons: Record<string, Coupon>): Promise<void> {
  // Try KV first if configured
  if (isKVConfigured() && kv) {
    try {
      await kv.set('coupons', coupons);
      console.log('[coupons] Wrote', Object.keys(coupons).length, 'coupons to KV');
      return;
    } catch (error) {
      console.error('[coupons] KV write failed, falling back to JSON file:', error);
    }
  }

  // Fallback to JSON file for local dev
  await fs.writeFile(COUPONS_FILE, JSON.stringify(coupons, null, 2));
  console.log('[coupons] Wrote coupons to JSON file');
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
