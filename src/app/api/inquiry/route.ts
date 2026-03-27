import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { PAGES, FEATURES, calculateQuote } from '@/lib/pricing';

const config = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  user: 'suleclaw@gmail.com',
  pass: 'eovu odit excb tbqq',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, selectedPageIds, selectedFeatureIds, siteType } = body;

    if (!name || !email || !selectedPageIds || !selectedFeatureIds || !siteType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const quote = calculateQuote(selectedPageIds, selectedFeatureIds);

    const selectedPages = PAGES.filter((p) => selectedPageIds.includes(p.id));
    const selectedFeatures = FEATURES.filter((f) => selectedFeatureIds.includes(f.id));

    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });

    const pageList = selectedPages.map((p) => `  - ${p.label}`).join('\n') || '  - None';
    const featureList = selectedFeatures.map((f) => `  - ${f.label}: £${f.price}`).join('\n') || '  - None';

    const emailText = `
New Website Quote Inquiry

Client Details:
  Name: ${name}
  Email: ${email}

Website Type: ${siteType === 'one-page' ? 'One-Page Website' : 'Multi-Page Website'}

Selected Pages:
${pageList}

Extra Features:
${featureList}

Quote Breakdown:
  Base website: £${quote.basePrice}
  Extra pages (${quote.extraPages} × £50): £${quote.pagesCost}
  Features: £${quote.featuresCost}
  ---------------------------------
  Total: £${quote.total}

---
Sent from Web Quote Calculator
    `.trim();

    await transporter.sendMail({
      from: config.user,
      to: config.user,
      replyTo: email,
      subject: `New Inquiry from ${name} — £${quote.total} quote`,
      text: emailText,
    });

    return NextResponse.json({ success: true, total: quote.total });
  } catch (error) {
    console.error('Inquiry error:', error);
    return NextResponse.json({ error: 'Failed to send inquiry' }, { status: 500 });
  }
}
