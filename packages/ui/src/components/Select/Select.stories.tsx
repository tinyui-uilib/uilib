import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import { expect, fn, userEvent, within, waitFor } from '@storybook/test';
import { Select } from './Select';
import { Input } from '../Input/Input';

type RootProps = ComponentProps<typeof Select.Root>;

const meta: Meta<typeof Select.Root> = {
  title:     'Components/Select',
  component: Select.Root,
  tags:      ['autodocs'],

  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Accessible select built on Radix UI Select primitive.',
          'Handles keyboard navigation, screen reader announcements,',
          'portal rendering, and open/close animation automatically.',
          'Styled via Vanilla Extract — zero runtime CSS.',
        ].join(' '),
      },
    },
  },

  argTypes: {
    disabled: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'] satisfies RootProps['size'][],
      table: { defaultValue: { summary: 'md' } },
    },
    invalid: { control: 'boolean' },
  },

  args: {
    onValueChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <div style={{ width: '280px' }}>
      <Select.Root {...args}>
        <Select.Trigger placeholder="Select a fruit..." />
        <Select.Content>
          <Select.Item value="apple">Apple</Select.Item>
          <Select.Item value="banana">Banana</Select.Item>
          <Select.Item value="blueberry">Blueberry</Select.Item>
          <Select.Item value="mango">Mango</Select.Item>
          <Select.Item value="pineapple">Pineapple</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify trigger renders with correct a11y attributes
    const trigger = canvas.getByRole('combobox');

    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
    // Open the dropdown
    await userEvent.click(trigger);

    await waitFor(() => {
      expect(within(document.body).getByRole('listbox')).toBeInTheDocument();
    });

    // Close it again so the story renders cleanly after play()
    await userEvent.keyboard('{Escape}');

    await waitFor(() => {
      expect(within(document.body).queryByRole('listbox')).not.toBeInTheDocument();
    });
  },
};

// ─── With default value ───────────────────────────────────────────────────────

export const WithDefaultValue: Story = {
  name: 'Pre-selected value',
  render: (args) => (
    <div style={{ width: '280px' }}>
      <Select.Root {...args} defaultValue="banana">
        <Select.Trigger placeholder="Select a fruit..." />
        <Select.Content>
          <Select.Item value="apple">Apple</Select.Item>
          <Select.Item value="banana">Banana</Select.Item>
          <Select.Item value="blueberry">Blueberry</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Trigger should show the selected value, not the placeholder
    await expect(canvas.getByText('Banana')).toBeInTheDocument();
  },
};

// ─── All sizes ────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  name: 'All sizes',
  parameters: {
    docs: {
      description: {
        story:
          'Heights match Input exactly — 32px / 40px / 48px. ' +
          'Select and Input align when used together in a form row.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '280px' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Select.Root key={size} {...args} size={size}>
          <Select.Trigger placeholder={`size="${size}"`} />
          <Select.Content>
            <Select.Item value="apple">Apple</Select.Item>
            <Select.Item value="banana">Banana</Select.Item>
            <Select.Item value="cherry">Cherry</Select.Item>
          </Select.Content>
        </Select.Root>
      ))}
    </div>
  ),
};

// ─── Disabled ─────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: (args) => (
    <div style={{ width: '280px' }}>
      <Select.Root {...args} disabled>
        <Select.Trigger placeholder="Not available" />
        <Select.Content>
          <Select.Item value="apple">Apple</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas  = within(canvasElement);
    const trigger = canvas.getByRole('combobox');

    await expect(trigger).toBeDisabled();

    // Clicking a disabled trigger should not open the dropdown
    await userEvent.click(trigger);
    await expect(
      within(document.body).queryByRole('listbox'),
    ).not.toBeInTheDocument();
  },
};

// ─── Invalid ──────────────────────────────────────────────────────────────────

export const Invalid: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Invalid state changes the trigger border and focus ring ' +
          'to the destructive token. Use alongside a visible error message.',
      },
    },
  },
  render: (args) => (
    <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <Select.Root {...args} invalid>
        <Select.Trigger placeholder="Select a country..." />
        <Select.Content>
          <Select.Item value="in">India</Select.Item>
          <Select.Item value="us">United States</Select.Item>
          <Select.Item value="uk">United Kingdom</Select.Item>
        </Select.Content>
      </Select.Root>
      <p style={{
        fontSize:  '12px',
        color:     'var(--color-destructive-default)',
        margin:    0,
      }}>
        Please select a country.
      </p>
    </div>
  ),
};

// ─── Disabled items ───────────────────────────────────────────────────────────

export const DisabledItems: Story = {
  name: 'Disabled items',
  parameters: {
    docs: {
      description: {
        story:
          'Individual items can be disabled. Radix adds `aria-disabled` ' +
          'and prevents selection — keyboard navigation skips them.',
      },
    },
  },
  render: (args) => (
    <div style={{ width: '280px' }}>
      <Select.Root {...args}>
        <Select.Trigger placeholder="Choose a plan..." />
        <Select.Content>
          <Select.Item value="free">Free</Select.Item>
          <Select.Item value="pro">Pro</Select.Item>
          <Select.Item value="enterprise" disabled>
            Enterprise (contact sales)
          </Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  ),
};

// ─── Grouped ──────────────────────────────────────────────────────────────────

export const Grouped: Story = {
  name: 'Grouped with labels',
  parameters: {
    docs: {
      description: {
        story: [
          '`Select.Group` adds `role="group"` and wires `aria-labelledby`',
          'to the `Select.Label` automatically.',
          'Screen readers announce the group name when entering it.',
          '`Select.Separator` is purely visual — `role="separator"` is added by Radix.',
        ].join(' '),
      },
    },
  },
  render: (args) => (
    <div style={{ width: '280px' }}>
      <Select.Root {...args}>
        <Select.Trigger placeholder="Choose an item..." />
        <Select.Content>
          <Select.Group>
            <Select.Label>Fruits</Select.Label>
            <Select.Item value="apple">Apple</Select.Item>
            <Select.Item value="banana">Banana</Select.Item>
            <Select.Item value="mango">Mango</Select.Item>
          </Select.Group>

          <Select.Separator />

          <Select.Group>
            <Select.Label>Vegetables</Select.Label>
            <Select.Item value="carrot">Carrot</Select.Item>
            <Select.Item value="potato">Potato</Select.Item>
            <Select.Item value="spinach">Spinach</Select.Item>
          </Select.Group>

          <Select.Separator />

          <Select.Group>
            <Select.Label>Grains</Select.Label>
            <Select.Item value="rice">Rice</Select.Item>
            <Select.Item value="wheat">Wheat</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('combobox'));

    await waitFor(() => {
      const body = within(document.body);
      expect(body.getByText('Fruits')).toBeInTheDocument();
      expect(body.getByText('Vegetables')).toBeInTheDocument();
      expect(body.getByText('Grains')).toBeInTheDocument();
    });

    await userEvent.keyboard('{Escape}');
  },
};

// ─── Controlled ───────────────────────────────────────────────────────────────

export const Controlled: Story = {
  name: 'Controlled with external state',
  parameters: {
    docs: {
      description: {
        story:
          'Controlled mode — value and onValueChange are managed externally. ' +
          'The displayed value always reflects the passed `value` prop.',
      },
    },
  },
  render: function ControlledExample(args) {
    const [value, setValue] = React.useState('');

    return (
      <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Select.Root
          {...args}
          value={value}
          onValueChange={(v) => {
            setValue(v);
            args.onValueChange?.(v);
          }}
        >
          <Select.Trigger placeholder="Select a role..." />
          <Select.Content>
            <Select.Item value="admin">Admin</Select.Item>
            <Select.Item value="editor">Editor</Select.Item>
            <Select.Item value="viewer">Viewer</Select.Item>
          </Select.Content>
        </Select.Root>

        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>
          Selected value: <strong>{value || '(none)'}</strong>
        </p>

        <button
          onClick={() => setValue('')}
          style={{
            fontSize:     '12px',
            padding:      '4px 8px',
            cursor:       'pointer',
            borderRadius: '4px',
            border:       '1px solid var(--color-border-default)',
            background:   'transparent',
            color:        'var(--color-text-secondary)',
          }}
        >
          Reset
        </button>
      </div>
    );
  },
};

// ─── Form integration ─────────────────────────────────────────────────────────

export const FormIntegration: Story = {
  name: 'Form integration with Input',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Select and Input at the same size align vertically. ' +
          'Heights are token-driven — both components use the same ' +
          'size scale so forms look consistent without manual adjustment.',
      },
    },
  },
  render: (args) => (
    <div style={{ width: '360px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Input.Root>
        <Input.Label>Full name</Input.Label>
        <Input.Field placeholder="Jane Smith" />
      </Input.Root>

      <Input.Root>
        <Input.Label>Email</Input.Label>
        <Input.Field type="email" placeholder="jane@example.com" />
      </Input.Root>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label
          style={{
            fontSize:   'var(--typography-font-size-sm)',
            fontWeight: 'var(--typography-font-weight-medium)',
            color:      'var(--color-text-primary)',
          }}
        >
          Country
        </label>
        <Select.Root {...args}>
          <Select.Trigger placeholder="Select a country..." />
          <Select.Content>
            <Select.Item value="in">India</Select.Item>
            <Select.Item value="us">United States</Select.Item>
            <Select.Item value="uk">United Kingdom</Select.Item>
            <Select.Item value="au">Australia</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label
          style={{
            fontSize:   'var(--typography-font-size-sm)',
            fontWeight: 'var(--typography-font-weight-medium)',
            color:      'var(--color-text-primary)',
          }}
        >
          Role
        </label>
        <Select.Root {...args}>
          <Select.Trigger placeholder="Select a role..." />
          <Select.Content>
            <Select.Item value="admin">Admin</Select.Item>
            <Select.Item value="editor">Editor</Select.Item>
            <Select.Item value="viewer">Viewer</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>
    </div>
  ),
};

// ─── Keyboard navigation ──────────────────────────────────────────────────────

export const KeyboardNavigation: Story = {
  name: 'Keyboard navigation',
  parameters: {
    docs: {
      description: {
        story: [
          'Radix handles all keyboard interactions natively:',
          '**Space / Enter** — opens the dropdown.',
          '**Arrow keys** — navigate items.',
          '**Home / End** — jump to first / last item.',
          '**Escape** — closes without selecting.',
          '**Tab** — closes and moves focus to next element.',
          'Type any letter to jump to the first item starting with that letter.',
        ].join(' '),
      },
    },
  },
  render: (args) => (
    <div style={{ width: '280px' }}>
      <Select.Root {...args}>
        <Select.Trigger placeholder="Use keyboard to navigate..." />
        <Select.Content>
          <Select.Item value="angular">Angular</Select.Item>
          <Select.Item value="next">Next.js</Select.Item>
          <Select.Item value="react">React</Select.Item>
          <Select.Item value="remix">Remix</Select.Item>
          <Select.Item value="svelte">Svelte</Select.Item>
          <Select.Item value="vue">Vue</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas  = within(canvasElement);
    const trigger = canvas.getByRole('combobox');

    // Open with Enter
    trigger.focus();
    await userEvent.keyboard('{Enter}');

    await waitFor(() => {
      expect(within(document.body).getByRole('listbox')).toBeInTheDocument();
    });

    // Navigate down and select
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Enter}');

    await waitFor(() => {
      expect(args.onValueChange).toHaveBeenCalled();
    });
  },
};