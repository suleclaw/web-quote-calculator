import crypto from 'crypto';

// In-memory session token store (token -> password hash + expiry)
const sessions = new Map<string, { passwordHash: string; expiresAt: number }>();

// Rate limiting for auth attempts
const authRateLimits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = authRateLimits.get(key);
  if (!entry || now > entry.resetAt) {
    authRateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

export function createSession(adminPassword: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  const passwordHash = crypto.createHash('sha256').update(adminPassword).digest('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  sessions.set(token, { passwordHash, expiresAt });
  return token;
}

export function validateSession(token: string, adminPassword: string): boolean {
  const session = sessions.get(token);
  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return false;
  }

  const passwordHash = crypto.createHash('sha256').update(adminPassword).digest('hex');
  if (session.passwordHash !== passwordHash) return false;

  return true;
}

export function deleteSession(token: string): void {
  sessions.delete(token);
}
