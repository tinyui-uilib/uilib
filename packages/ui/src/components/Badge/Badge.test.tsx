import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders as a span', () => {
    const { container } = render(<Badge>New</Badge>);
    expect(container.firstChild?.nodeName).toBe('SPAN');
  });

  it('renders leftIcon', () => {
    render(<Badge leftIcon={<span data-testid="icon" />}>Label</Badge>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders rightIcon', () => {
    render(<Badge rightIcon={<span data-testid="icon" />}>Label</Badge>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    const { container } = render(<Badge className="custom">Label</Badge>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('passes through HTML attributes', () => {
    render(<Badge data-testid="badge">Label</Badge>);
    expect(screen.getByTestId('badge')).toBeInTheDocument();
  });

  it('has correct displayName', () => {
    expect(Badge.displayName).toBe('Badge');
  });
});