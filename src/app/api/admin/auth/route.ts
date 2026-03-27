import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const providedPassword = request.headers.get('x-admin-password');

  if (!adminPassword) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  if (providedPassword === adminPassword) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
