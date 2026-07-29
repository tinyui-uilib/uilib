import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from './Switch';

describe('Switch', () => {
  it('renders a switch role', () => {
    render(<Switch />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('is unchecked by default', () => {
    render(<Switch />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  it('renders label when provided', () => {
    render(<Switch label="Dark mode" />);
    expect(screen.getByText('Dark mode')).toBeInTheDocument();
  });

  it('label is associated with switch via htmlFor', () => {
    render(<Switch label="Dark mode" />);
    const label  = screen.getByText('Dark mode');
    const sw     = screen.getByRole('switch');
    expect(label.getAttribute('for')).toBe(sw.getAttribute('id'));
  });

  it('renders description', () => {
    render(<Switch label="Notifications" description="Receive email updates" />);
    expect(screen.getByText('Receive email updates')).toBeInTheDocument();
  });

  it('toggles on click', async () => {
    const user            = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByRole('switch'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('does not fire when disabled', async () => {
    const user            = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch disabled onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByRole('switch'));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('reflects controlled checked state', () => {
    render(<Switch checked={true} onCheckedChange={vi.fn()} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Switch ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('has correct displayName', () => {
    expect(Switch.displayName).toBe('Switch');
  });
});