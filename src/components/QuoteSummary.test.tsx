import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import QuoteSummary from './QuoteSummary';

describe('QuoteSummary', () => {
  it('displays base price', () => {
    render(<QuoteSummary selectedPageIds={[]} selectedFeatureIds={[]} />);
    expect(screen.getAllByText((content) => content.includes('£100')).length).toBeGreaterThan(0);
  });

  it('displays selected pages', () => {
    render(<QuoteSummary selectedPageIds={['home', 'about']} selectedFeatureIds={[]} />);
    expect(screen.getByText('Home')).toBeDefined();
    expect(screen.getByText('About')).toBeDefined();
    expect(screen.getByText('Selected Pages (2)')).toBeDefined();
  });

  it('displays selected features with prices', () => {
    render(<QuoteSummary selectedPageIds={[]} selectedFeatureIds={['ai-chatbot']} />);
    // Check for AI Chatbot text in the breakdown
    expect(screen.getAllByText('AI Chatbot')[0]).toBeDefined();
    // Check for the price in the breakdown section
    const priceText = screen.getByText((content) => content.includes('£80'));
    expect(priceText).toBeDefined();
  });

  it('calculates extra pages correctly', () => {
    // 6 pages: 4 included + 2 extra (£20)
    render(<QuoteSummary selectedPageIds={['home', 'about', 'services', 'contact', 'gallery', 'testimonials']} selectedFeatureIds={[]} />);
    expect(screen.getByText('Extra pages (2 × £10)')).toBeDefined();
    expect(screen.getByText('£20')).toBeDefined(); // Extra pages cost
  });

  it('displays total estimate', () => {
    render(<QuoteSummary selectedPageIds={['home']} selectedFeatureIds={['ai-chatbot']} />);
    expect(screen.getByText('Total Estimate')).toBeDefined();
    expect(screen.getByText('£180')).toBeDefined(); // £100 base + £80 chatbot
  });

  it('shows trust signals', () => {
    render(<QuoteSummary selectedPageIds={[]} selectedFeatureIds={[]} />);
    expect(screen.getByText('No commitment')).toBeDefined();
    expect(screen.getByText('Estimate only')).toBeDefined();
    expect(screen.getByText('Response within 24h')).toBeDefined();
  });
});
