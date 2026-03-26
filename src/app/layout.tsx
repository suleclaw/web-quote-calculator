import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Website Quote Calculator',
  description: 'Get an instant estimate for your website project',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
