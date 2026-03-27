# Website Quote Calculator

A sleek, multi-step web app that helps users build custom website quotes in real-time. Built with Next.js and React, it features transparent pricing with no surprises.

## Features

- **4-Step Wizard** — Pages → Features → Review → Submit
- **Real-time Pricing** — Instant quote updates as selections change
- **Responsive Design** — Works beautifully on desktop and mobile
- **Inquiry Submission** — Collect client info via API

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** React hooks

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start building your quote.

## Project Structure

```
src/
├── app/
│   ├── page.tsx        # Main quote wizard
│   └── api/
│       └── inquiry/    # Inquiry submission endpoint
├── components/
│   ├── StepIndicator.tsx   # Progress tracker
│   ├── PageSelector.tsx     # Page selection (step 1)
│   ├── FeatureSelector.tsx # Feature add-ons (step 2)
│   ├── QuoteSummary.tsx    # Review & pricing (step 3)
│   └── InquiryForm.tsx     # Contact form (step 4)
```

## Deploy

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/suleclaw/web-quote-calculator)

## License

MIT
