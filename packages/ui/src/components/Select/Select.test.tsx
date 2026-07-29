import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

// ─── Test helpers ─────────────────────────────────────────────────────────────

// Standard select rendered for most tests
function renderSelect(overrides?: {
  disabled?:      boolean;
  invalid?:       boolean;
  defaultValue?:  string;
  onValueChange?: (value: string) => void;
}) {
  const {
    disabled      = false,
    invalid       = false,
    defaultValue,
    onValueChange,
  } = overrides ?? {};

  return render(
    <Select.Root
      disabled={disabled}
      invalid={invalid}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
    >
      <Select.Trigger placeholder="Pick a fruit" />
      <Select.Content>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
        <Select.Item value="cherry" disabled>Cherry (disabled)</Select.Item>
      </Select.Content>
    </Select.Root>,
  );
}

// Grouped select for group-specific tests
function renderGroupedSelect(onValueChange?: (v: string) => void) {
  return render(
    <Select.Root onValueChange={onValueChange}>
      <Select.Trigger placeholder="Pick an item" />
      <Select.Content>
        <Select.Group>
          <Select.Label>Fruits</Select.Label>
          <Select.Item value="apple">Apple</Select.Item>
          <Select.Item value="banana">Banana</Select.Item>
        </Select.Group>
        <Select.Separator />
        <Select.Group>
          <Select.Label>Vegetables</Select.Label>
          <Select.Item value="carrot">Carrot</Select.Item>
          <Select.Item value="potato">Potato</Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>,
  );
}

// ─── Rendering ────────────────────────────────────────────────────────────────

describe('Select', () => {
  describe('rendering', () => {
    it('renders the trigger button', () => {
      renderSelect();
      expect(
        screen.getByRole('combobox'),
      ).toBeInTheDocument();
    });

    it('shows placeholder when no value is selected', () => {
      renderSelect();
      expect(
        screen.getByText('Pick a fruit'),
      ).toBeInTheDocument();
    });

    it('shows the selected value when defaultValue is set', () => {
      renderSelect({ defaultValue: 'apple' });
      expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    it('trigger has correct aria attributes when closed', () => {
      renderSelect();
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    });
  });

  // ─── Open / close ─────────────────────────────────────────────────────────

  describe('open and close', () => {
    it('opens the dropdown on trigger click', async () => {
      const user = userEvent.setup();
      renderSelect();

      await user.click(screen.getByRole('combobox'));

      // Content is in a portal — query from document.body
      await waitFor(() => {
        expect(
          within(document.body).getByRole('listbox'),
        ).toBeInTheDocument();
      });
    });

    it('trigger has aria-expanded="true" when open', async () => {
      const user = userEvent.setup();
      renderSelect();

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(
          screen.getByRole('combobox'),
        ).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('closes on Escape key', async () => {
      const user = userEvent.setup();
      renderSelect();

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(
          within(document.body).getByRole('listbox'),
        ).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(
          within(document.body).queryByRole('listbox'),
        ).not.toBeInTheDocument();
      });
    });

    it('does not open when disabled', async () => {
      const user = userEvent.setup();
      renderSelect({ disabled: true });

      await user.click(screen.getByRole('combobox'));

      expect(
        within(document.body).queryByRole('listbox'),
      ).not.toBeInTheDocument();
    });
  });

  // ─── Item selection ───────────────────────────────────────────────────────

  describe('item selection', () => {
    it('calls onValueChange with the selected value', async () => {
      const user          = userEvent.setup();
      const onValueChange = vi.fn();

      renderSelect({ onValueChange });

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(
          within(document.body).getByRole('listbox'),
        ).toBeInTheDocument();
      });

      await user.click(within(document.body).getByText('Apple'));

      expect(onValueChange).toHaveBeenCalledWith('apple');
    });

    it('displays the selected item in the trigger after selection', async () => {
      const user = userEvent.setup();
      renderSelect();

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        within(document.body).getByRole('listbox');
      });

      await user.click(within(document.body).getByText('Banana'));

      await waitFor(() => {
        expect(screen.getByText('Banana')).toBeInTheDocument();
      });
    });

    it('closes the dropdown after selection', async () => {
      const user = userEvent.setup();
      renderSelect();

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        within(document.body).getByRole('listbox');
      });

      await user.click(within(document.body).getByText('Apple'));

      await waitFor(() => {
        expect(
          within(document.body).queryByRole('listbox'),
        ).not.toBeInTheDocument();
      });
    });
  });

  // ─── Disabled items ───────────────────────────────────────────────────────

  describe('disabled items', () => {
    it('disabled items have aria-disabled', async () => {
      const user = userEvent.setup();
      renderSelect();

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        const item = within(document.body).getByText('Cherry (disabled)');
        expect(item.closest('[data-disabled]')).toBeInTheDocument();
      });
    });

    it('does not call onValueChange when disabled item is clicked', async () => {
      const user          = userEvent.setup();
      const onValueChange = vi.fn();

      renderSelect({ onValueChange });

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        within(document.body).getByRole('listbox');
      });

      await user.click(within(document.body).getByText('Cherry (disabled)'));

      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  // ─── Keyboard navigation ──────────────────────────────────────────────────

  describe('keyboard navigation', () => {
    it('opens with Space key', async () => {
      const user = userEvent.setup();
      renderSelect();

      screen.getByRole('combobox').focus();
      await user.keyboard(' ');

      await waitFor(() => {
        expect(
          within(document.body).getByRole('listbox'),
        ).toBeInTheDocument();
      });
    });

    it('opens with Enter key', async () => {
      const user = userEvent.setup();
      renderSelect();

      screen.getByRole('combobox').focus();
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(
          within(document.body).getByRole('listbox'),
        ).toBeInTheDocument();
      });
    });
  });

  // ─── Invalid state ────────────────────────────────────────────────────────

  describe('invalid state', () => {
    it('trigger has data-invalid attribute when invalid', () => {
      // The invalid class is applied via recipe — we check the
      // presence of the invalid variant on the trigger indirectly
      // through the root's data attribute
      const { container } = renderSelect({ invalid: true });
      expect(container.firstChild).toHaveAttribute('data-invalid', 'true');
    });
  });

  // ─── Grouped select ───────────────────────────────────────────────────────

  describe('groups and labels', () => {
    it('renders group labels in the dropdown', async () => {
      const user = userEvent.setup();
      renderGroupedSelect();

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(
          within(document.body).getByText('Fruits'),
        ).toBeInTheDocument();
        expect(
          within(document.body).getByText('Vegetables'),
        ).toBeInTheDocument();
      });
    });

    it('renders items from both groups', async () => {
      const user = userEvent.setup();
      renderGroupedSelect();

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        const body = within(document.body);
        expect(body.getByText('Apple')).toBeInTheDocument();
        expect(body.getByText('Carrot')).toBeInTheDocument();
      });
    });

    it('selects items from any group', async () => {
      const user          = userEvent.setup();
      const onValueChange = vi.fn();

      renderGroupedSelect(onValueChange);

      await user.click(screen.getByRole('combobox'));

      await waitFor(() => {
        within(document.body).getByRole('listbox');
      });

      await user.click(within(document.body).getByText('Carrot'));

      expect(onValueChange).toHaveBeenCalledWith('carrot');
    });
  });

  // ─── Controlled ───────────────────────────────────────────────────────────

  describe('controlled usage', () => {
    it('respects controlled value', () => {
      const onValueChange = vi.fn();

      render(
        <Select.Root value="banana" onValueChange={onValueChange}>
          <Select.Trigger placeholder="Pick" />
          <Select.Content>
            <Select.Item value="apple">Apple</Select.Item>
            <Select.Item value="banana">Banana</Select.Item>
          </Select.Content>
        </Select.Root>,
      );

      // Controlled value shows in trigger
      expect(screen.getByText('Banana')).toBeInTheDocument();
    });
  });

  // ─── displayName ─────────────────────────────────────────────────────────

  describe('displayName', () => {
    it('Trigger has correct displayName', () => {
      expect(Select.Trigger.displayName).toBe('Select.Trigger');
    });

    it('Content has correct displayName', () => {
      expect(Select.Content.displayName).toBe('Select.Content');
    });

    it('Item has correct displayName', () => {
      expect(Select.Item.displayName).toBe('Select.Item');
    });
  });
});