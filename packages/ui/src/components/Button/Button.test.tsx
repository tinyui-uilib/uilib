import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {

  // ── Rendering ──────────────────────────────────────────────────────────────

  describe('rendering', () => {
    it('renders a button element by default', () => {
      render(<Button>Click</Button>);
      expect(screen.getByRole('button', { name: 'Click' })).toBeInTheDocument();
    });

    it('defaults to type="button" to prevent accidental form submission', () => {
      render(<Button>Click</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('has a displayName for React DevTools', () => {
      expect(Button.displayName).toBe('Button');
    });
  });

  // ── asChild ────────────────────────────────────────────────────────────────

  describe('asChild', () => {
    it('renders as the child element, not a button', () => {
      render(
        <Button asChild>
          <a href="/home">Go home</a>
        </Button>,
      );
      expect(screen.getByRole('link', { name: 'Go home' })).toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('does not set type on non-button elements', () => {
      render(
        <Button asChild>
          <a href="/home">Link</a>
        </Button>,
      );
      expect(screen.getByRole('link')).not.toHaveAttribute('type');
    });
  });

  // ── Loading state ──────────────────────────────────────────────────────────

  describe('loading', () => {
    it('sets aria-busy', () => {
      render(<Button loading>Save</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });

    it('disables the button', () => {
      render(<Button loading>Save</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('keeps the label in the DOM for screen readers', () => {
      render(<Button loading>Save</Button>);
      // Visually hidden but still accessible
      expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('does not fire onClick while loading', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Button loading onClick={handleClick}>Save</Button>);
      await user.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // ── Disabled state ─────────────────────────────────────────────────────────

  describe('disabled', () => {
    it('does not fire onClick when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Button disabled onClick={handleClick}>Click</Button>);
      await user.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // ── Keyboard ───────────────────────────────────────────────────────────────

  describe('keyboard interaction', () => {
    it('fires onClick on Enter', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Submit</Button>);
      screen.getByRole('button').focus();
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledOnce();
    });

    it('fires onClick on Space', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Submit</Button>);
      screen.getByRole('button').focus();
      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledOnce();
    });
  });

  // ── Ref forwarding ─────────────────────────────────────────────────────────

  describe('ref', () => {
    it('forwards ref to the button element', () => {
      const ref = { current: null as HTMLButtonElement | null };
      render(<Button ref={ref}>Click</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  // ── Icons ──────────────────────────────────────────────────────────────────

  describe('icons', () => {
    it('renders leftIcon before children', () => {
      render(
        <Button leftIcon={<span data-testid="icon-left" />}>Label</Button>,
      );
      expect(screen.getByTestId('icon-left')).toBeInTheDocument();
    });

    it('marks icon wrapper as aria-hidden', () => {
      render(
        <Button leftIcon={<span data-testid="icon-left" />}>Label</Button>,
      );
      const wrapper = screen.getByTestId('icon-left').parentElement;
      expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    });

    it('hides icons while loading', () => {
      render(
        <Button loading leftIcon={<span data-testid="icon-left" />}>
          Label
        </Button>,
      );
      expect(screen.queryByTestId('icon-left')).not.toBeInTheDocument();
    });
  });

});