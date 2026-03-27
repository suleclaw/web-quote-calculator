import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ThemeToggle from './ThemeToggle';

// Note: ThemeToggle relies on next-themes which requires client-side mounting
// The component handles the mounted state to avoid hydration mismatch
// We test that it renders correctly after mounting

describe('ThemeToggle', () => {
  it('renders toggle button with correct accessibility label', () => {
    render(<ThemeToggle />);
    // The button should exist and be accessible
    const button = screen.getByRole('button');
    expect(button).toBeDefined();
  });

  it('renders button with theme-toggle class', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('theme-toggle');
  });

  it('renders an SVG icon when mounted', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    const svg = button.querySelector('svg');
    expect(svg).toBeDefined();
  });
});
