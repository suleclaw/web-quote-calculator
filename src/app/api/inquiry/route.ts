import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { PAGES, FEATURES, calculateQuote } from '@/lib/pricing';

const config = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  user: 'suleclaw@gmail.com',
  pass: 'qozy yyqk diyy ygfe',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, selectedPageIds, selectedFeatureIds, siteType, couponCode, couponDiscount } = body;

    if (!name || !email || !selectedPageIds || !selectedFeatureIds || !siteType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const quote = calculateQuote(selectedPageIds, selectedFeatureIds);

    const selectedPages = PAGES.filter((p) => selectedPageIds.includes(p.id));
    const selectedFeatures = FEATURES.filter((f) => selectedFeatureIds.includes(f.id));

    // Calculate discounted total if coupon applied
    const hasCoupon = couponCode && couponDiscount && couponDiscount > 0;
    const discountAmount = hasCoupon ? Math.round((quote.total * couponDiscount) / 100) : 0;
    const finalTotal = quote.total - discountAmount;

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

    let emailText = `
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
  Subtotal: £${quote.total}
`;

    if (hasCoupon) {
      emailText += `  Coupon (${couponCode}): -£${discountAmount} (${couponDiscount}% off)
  ---------------------------------
  Total: £${finalTotal}
`;
    } else {
      emailText += `  Total: £${quote.total}
`;
    }

    emailText += `
---
Sent from Web Quote Calculator
    `.trim();

    const subject = hasCoupon
      ? `New Inquiry from ${name} — £${finalTotal} quote (${couponDiscount}% off)`
      : `New Inquiry from ${name} — £${quote.total} quote`;

    await transporter.sendMail({
      from: config.user,
      to: config.user,
      replyTo: email,
      subject,
      text: emailText,
    });

    return NextResponse.json({ success: true, total: finalTotal, originalTotal: quote.total, discountAmount });
  } catch (error) {
    console.error('Inquiry error:', error);
    return NextResponse.json({ error: 'Failed to send inquiry' }, { status: 500 });
  }
}
