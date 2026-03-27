import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PageSelector from './PageSelector';

describe('PageSelector', () => {
  const mockOnChange = vi.fn();
  const mockOnSiteTypeChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnSiteTypeChange.mockClear();
  });

  it('renders all page options', () => {
    render(<PageSelector selected={[]} onChange={mockOnChange} siteType="multi-page" onSiteTypeChange={mockOnSiteTypeChange} />);
    expect(screen.getByText('Home')).toBeDefined();
    expect(screen.getByText('About')).toBeDefined();
    expect(screen.getByText('Services')).toBeDefined();
  });

  it('shows selected count in multi-page mode', () => {
    render(<PageSelector selected={['home', 'about']} onChange={mockOnChange} siteType="multi-page" onSiteTypeChange={mockOnSiteTypeChange} />);
    expect(screen.getByText('2 selected')).toBeDefined();
  });

  it('shows "1 page" in one-page mode', () => {
    render(<PageSelector selected={['home']} onChange={mockOnChange} siteType="one-page" onSiteTypeChange={mockOnSiteTypeChange} />);
    expect(screen.getByText('1 page')).toBeDefined();
  });

  it('calls onChange when a page is selected', () => {
    render(<PageSelector selected={[]} onChange={mockOnChange} siteType="multi-page" onSiteTypeChange={mockOnSiteTypeChange} />);
    const homeButton = screen.getByText('Home').closest('button');
    fireEvent.click(homeButton!);
    expect(mockOnChange).toHaveBeenCalledWith(['home']);
  });

  it('calls onChange when a page is deselected', () => {
    render(<PageSelector selected={['home']} onChange={mockOnChange} siteType="multi-page" onSiteTypeChange={mockOnSiteTypeChange} />);
    const homeButton = screen.getByText('Home').closest('button');
    fireEvent.click(homeButton!);
    expect(mockOnChange).toHaveBeenCalledWith([]);
  });

  it('toggles pages correctly', () => {
    render(<PageSelector selected={['home']} onChange={mockOnChange} siteType="multi-page" onSiteTypeChange={mockOnSiteTypeChange} />);
    const aboutButton = screen.getByText('About').closest('button');
    fireEvent.click(aboutButton!);
    expect(mockOnChange).toHaveBeenCalledWith(['home', 'about']);
  });

  it('calls onSiteTypeChange when site type is toggled', () => {
    render(<PageSelector selected={[]} onChange={mockOnChange} siteType="multi-page" onSiteTypeChange={mockOnSiteTypeChange} />);
    const onePageButton = screen.getByText('One page');
    fireEvent.click(onePageButton);
    expect(mockOnSiteTypeChange).toHaveBeenCalledWith('one-page');
  });

  it('in one-page mode, selecting home deselects other pages', () => {
    render(<PageSelector selected={['home', 'about']} onChange={mockOnChange} siteType="one-page" onSiteTypeChange={mockOnSiteTypeChange} />);
    const homeButton = screen.getByText('Home').closest('button');
    fireEvent.click(homeButton!);
    // In one-page mode, clicking home (already selected) deselects it
    expect(mockOnChange).toHaveBeenCalledWith(['about']);
  });
});
