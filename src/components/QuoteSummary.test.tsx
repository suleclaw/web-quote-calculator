import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import QuoteSummary from './QuoteSummary';

describe('QuoteSummary', () => {
  it('displays base price for multi-page', () => {
    render(<QuoteSummary selectedPageIds={[]} selectedFeatureIds={[]} />);
    // Empty = multi-page base (£350)
    expect(screen.getAllByText((content) => content.includes('£350')).length).toBeGreaterThan(0);
  });

  it('displays selected pages', () => {
    render(<QuoteSummary selectedPageIds={['home', 'about']} selectedFeatureIds={[]} />);
    expect(screen.getByText('Home')).toBeDefined();
    expect(screen.getByText('About')).toBeDefined();
    expect(screen.getByText('Selected Pages (2)')).toBeDefined();
  });

  it('displays selected features with prices', () => {
    render(<QuoteSummary selectedPageIds={[]} selectedFeatureIds={['ai-chatbot']} />);
    expect(screen.getAllByText('AI Chatbot')[0]).toBeDefined();
    const priceText = screen.getByText((content) => content.includes('£100'));
    expect(priceText).toBeDefined();
  });

  it('calculates extra pages correctly', () => {
    // 6 pages: 4 included + 2 extra (£100)
    render(<QuoteSummary selectedPageIds={['home', 'about', 'services', 'contact', 'gallery', 'testimonials']} selectedFeatureIds={[]} />);
    expect(screen.getByText('Extra pages (2 × £50)')).toBeDefined();
    expect(screen.getByText('£100')).toBeDefined(); // Extra pages cost
  });

  it('displays total estimate', () => {
    render(<QuoteSummary selectedPageIds={['home']} selectedFeatureIds={['ai-chatbot']} />);
    expect(screen.getByText('Total Estimate')).toBeDefined();
    expect(screen.getByText('£310')).toBeDefined(); // £210 base + £100 chatbot
  });

  it('shows trust signals', () => {
    render(<QuoteSummary selectedPageIds={[]} selectedFeatureIds={[]} />);
    expect(screen.getByText('No commitment')).toBeDefined();
    expect(screen.getByText('Estimate only')).toBeDefined();
    expect(screen.getByText('Response within 24h')).toBeDefined();
  });
});
