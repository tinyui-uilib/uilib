import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

// Helper — renders a standard input with all parts
function renderInput(overrides?: {
  invalid?:  boolean;
  disabled?: boolean;
  required?: boolean;
  errorMsg?: string;
  helperMsg?: string;
}) {
  const {
    invalid   = false,
    disabled  = false,
    required  = false,
    errorMsg  = 'This field is required',
    helperMsg = 'Enter your email address',
  } = overrides ?? {};

  return render(
    <Input.Root invalid={invalid} disabled={disabled} required={required}>
      <Input.Label>Email</Input.Label>
      <Input.Field type="email" placeholder="you@example.com" />
      <Input.Helper>{helperMsg}</Input.Helper>
      <Input.Error>{errorMsg}</Input.Error>
    </Input.Root>,
  );
}

describe('Input', () => {

  // ── Label association ───────────────────────────────────────────────────────

  describe('label association', () => {
    it('label is programmatically associated with the input', () => {
      renderInput();
      const input = screen.getByRole('textbox', { name: 'Email' });
      expect(input).toBeInTheDocument();
    });

    it('clicking the label focuses the input', async () => {
      const user = userEvent.setup();
      renderInput();
      await user.click(screen.getByText('Email'));
      expect(screen.getByRole('textbox')).toHaveFocus();
    });
  });

  // ── aria-describedby ────────────────────────────────────────────────────────

  describe('aria-describedby', () => {
    it('input has aria-describedby pointing to helper and error IDs', () => {
      renderInput();
      const input       = screen.getByRole('textbox');
      const describedBy = input.getAttribute('aria-describedby') ?? '';
      expect(describedBy.split(' ')).toHaveLength(2);
    });

    it('helper text is rendered when not invalid', () => {
      renderInput({ invalid: false });
      expect(
        screen.getByText('Enter your email address'),
      ).toBeInTheDocument();
    });

    it('helper text is hidden when invalid', () => {
      renderInput({ invalid: true });
      expect(
        screen.queryByText('Enter your email address'),
      ).not.toBeInTheDocument();
    });
  });

  // ── Invalid state ───────────────────────────────────────────────────────────

  describe('invalid state', () => {
    it('sets aria-invalid on the input when invalid', () => {
      renderInput({ invalid: true });
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-invalid',
        'true',
      );
    });

    it('does not set aria-invalid when valid', () => {
      renderInput({ invalid: false });
      expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
    });

    it('renders error message when invalid', () => {
      renderInput({ invalid: true });
      expect(
        screen.getByRole('alert'),
      ).toHaveTextContent('This field is required');
    });

    it('does not render error message when valid', () => {
      renderInput({ invalid: false });
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  // ── Required state ──────────────────────────────────────────────────────────

  describe('required state', () => {
    it('sets aria-required on the input when required', () => {
      renderInput({ required: true });
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-required',
        'true',
      );
    });

    it('label has data-required attribute for CSS asterisk', () => {
      renderInput({ required: true });
      const label = screen.getByText('Email');
      expect(label).toHaveAttribute('data-required', 'true');
    });
  });

  // ── Disabled state ──────────────────────────────────────────────────────────

  describe('disabled state', () => {
    it('disables the input', () => {
      renderInput({ disabled: true });
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('does not fire onChange when disabled', async () => {
      const user     = userEvent.setup();
      const onChange = vi.fn();

      render(
        <Input.Root disabled>
          <Input.Label>Email</Input.Label>
          <Input.Field type="email" onChange={onChange} />
        </Input.Root>,
      );

      await user.type(screen.getByRole('textbox'), 'hello');
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  // ── User interaction ────────────────────────────────────────────────────────

  describe('user interaction', () => {
    it('fires onChange when typing', async () => {
      const user     = userEvent.setup();
      const onChange = vi.fn();

      render(
        <Input.Root>
          <Input.Label>Name</Input.Label>
          <Input.Field onChange={onChange} />
        </Input.Root>,
      );

      await user.type(screen.getByRole('textbox'), 'Pradhumn');
      expect(onChange).toHaveBeenCalled();
    });

    it('renders the typed value', async () => {
      const user = userEvent.setup();

      render(
        <Input.Root>
          <Input.Label>Name</Input.Label>
          <Input.Field />
        </Input.Root>,
      );

      await user.type(screen.getByRole('textbox'), 'Pradhumn');
      expect(screen.getByRole('textbox')).toHaveValue('Pradhumn');
    });
  });

  // ── Ref forwarding ──────────────────────────────────────────────────────────

  describe('ref forwarding', () => {
    it('forwards ref to the underlying input element', () => {
      const ref = { current: null as HTMLInputElement | null };

      render(
        <Input.Root>
          <Input.Label>Name</Input.Label>
          <Input.Field ref={ref} />
        </Input.Root>,
      );

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  // ── Context guard ───────────────────────────────────────────────────────────

  describe('context guard', () => {
    it('throws when Field is used outside Root', () => {
      // Suppress React's error boundary console output in test
      const spy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

      expect(() =>
        render(<Input.Field />),
      ).toThrow('<Input.Field> must be rendered inside <Input.Root>');

      spy.mockRestore();
    });
  });

});