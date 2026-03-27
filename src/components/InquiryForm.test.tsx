import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InquiryForm from './InquiryForm';

describe('InquiryForm', () => {
  const mockOnSubmit = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders form fields', () => {
    render(
      <InquiryForm
        name=""
        email=""
        onNameChange={vi.fn()}
        onEmailChange={vi.fn()}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        isSuccess={false}
        error={null}
      />
    );
    expect(screen.getByLabelText('Your Name')).toBeDefined();
    expect(screen.getByLabelText('Email Address')).toBeDefined();
  });

  it('validates name field', () => {
    render(
      <InquiryForm
        name=""
        email="test@example.com"
        onNameChange={vi.fn()}
        onEmailChange={vi.fn()}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        isSuccess={false}
        error={null}
      />
    );
    const submitButton = screen.getByRole('button', { name: /submit inquiry/i });
    expect(submitButton).toBeDisabled();
  });

  it('validates email field', () => {
    render(
      <InquiryForm
        name="Ada Lovelace"
        email=""
        onNameChange={vi.fn()}
        onEmailChange={vi.fn()}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        isSuccess={false}
        error={null}
      />
    );
    const submitButton = screen.getByRole('button', { name: /submit inquiry/i });
    expect(submitButton).toBeDisabled();
  });

  it('enables submit when both fields are filled', () => {
    render(
      <InquiryForm
        name="Ada Lovelace"
        email="ada@example.com"
        onNameChange={vi.fn()}
        onEmailChange={vi.fn()}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        isSuccess={false}
        error={null}
      />
    );
    const submitButton = screen.getByRole('button', { name: /submit inquiry/i });
    expect(submitButton).not.toBeDisabled();
  });

  it('calls onNameChange when name is typed', () => {
    const onNameChange = vi.fn();
    render(
      <InquiryForm
        name=""
        email=""
        onNameChange={onNameChange}
        onEmailChange={vi.fn()}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        isSuccess={false}
        error={null}
      />
    );
    const nameInput = screen.getByLabelText('Your Name');
    fireEvent.change(nameInput, { target: { value: 'Ada Lovelace' } });
    expect(onNameChange).toHaveBeenCalledWith('Ada Lovelace');
  });

  it('calls onEmailChange when email is typed', () => {
    const onEmailChange = vi.fn();
    render(
      <InquiryForm
        name=""
        email=""
        onNameChange={vi.fn()}
        onEmailChange={onEmailChange}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        isSuccess={false}
        error={null}
      />
    );
    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'ada@example.com' } });
    expect(onEmailChange).toHaveBeenCalledWith('ada@example.com');
  });

  it('displays error message', () => {
    render(
      <InquiryForm
        name="Ada Lovelace"
        email="ada@example.com"
        onNameChange={vi.fn()}
        onEmailChange={vi.fn()}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        isSuccess={false}
        error="Failed to send inquiry"
      />
    );
    expect(screen.getByText('Failed to send inquiry')).toBeDefined();
  });

  it('shows loading state', () => {
    render(
      <InquiryForm
        name="Ada Lovelace"
        email="ada@example.com"
        onNameChange={vi.fn()}
        onEmailChange={vi.fn()}
        onSubmit={mockOnSubmit}
        isSubmitting={true}
        isSuccess={false}
        error={null}
      />
    );
    expect(screen.getByText('Sending...')).toBeDefined();
  });
});
