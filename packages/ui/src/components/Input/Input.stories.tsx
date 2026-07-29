import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import { expect, fn, userEvent, within } from '@storybook/test';
import { Input } from './Input';

type RootProps = ComponentProps<typeof Input.Root>;

const meta: Meta<typeof Input.Root> = {
  title:     'Components/Input',
  component: Input.Root,
  tags:      ['autodocs'],

  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Compound input component with automatic ID wiring.',
          '`Input.Root` generates stable IDs via `React.useId()` and',
          'shares them via context. `Input.Field` receives correct',
          '`aria-describedby`, `aria-invalid`, and `aria-required`',
          'automatically — no manual ID management needed.',
        ].join(' '),
      },
    },
  },

  argTypes: {
    invalid:  { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'] satisfies RootProps['size'][],
      table: { defaultValue: { summary: 'md' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <div style={{ width: '320px' }}>
      <Input.Root {...args}>
        <Input.Label>Email address</Input.Label>
        <Input.Field type="email" placeholder="you@example.com" />
        <Input.Helper>We'll never share your email.</Input.Helper>
      </Input.Root>
    </div>
  ),
};

// ─── With error ───────────────────────────────────────────────────────────────

export const WithError: Story = {
  name: 'Invalid with error message',
  parameters: {
    docs: {
      description: {
        story:
          '`invalid` changes border + focus ring to destructive color, ' +
          'sets `aria-invalid` on the input, hides helper text, ' +
          'and renders the error with `role="alert"` so screen readers ' +
          'announce it immediately.',
      },
    },
  },
  render: (args) => (
    <div style={{ width: '320px' }}>
      <Input.Root {...args} invalid>
        <Input.Label>Email address</Input.Label>
        <Input.Field type="email" defaultValue="not-an-email" />
        <Input.Helper>We'll never share your email.</Input.Helper>
        <Input.Error>Please enter a valid email address.</Input.Error>
      </Input.Root>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input  = canvas.getByRole('textbox');

    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(canvas.getByRole('alert')).toBeInTheDocument();
    await expect(
      canvas.queryByText("We'll never share your email."),
    ).not.toBeInTheDocument();
  },
};

// ─── Required ─────────────────────────────────────────────────────────────────

export const Required: Story = {
  render: (args) => (
    <div style={{ width: '320px' }}>
      <Input.Root {...args} required>
        <Input.Label>Full name</Input.Label>
        <Input.Field placeholder="Jane Smith" />
        <Input.Helper>As it appears on your ID.</Input.Helper>
      </Input.Root>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox')).toHaveAttribute(
      'aria-required',
      'true',
    );
  },
};

// ─── Disabled ─────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: (args) => (
    <div style={{ width: '320px' }}>
      <Input.Root {...args} disabled>
        <Input.Label>Email address</Input.Label>
        <Input.Field type="email" defaultValue="locked@example.com" />
        <Input.Helper>This field cannot be edited.</Input.Helper>
      </Input.Root>
    </div>
  ),
};

// ─── All sizes ────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  name: 'All sizes',
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '320px' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Input.Root key={size} {...args} size={size}>
          <Input.Label>{size} input</Input.Label>
          <Input.Field placeholder={`size="${size}"`} />
        </Input.Root>
      ))}
    </div>
  ),
};

// ─── With icons ───────────────────────────────────────────────────────────────

export const WithIcons: Story = {
  name: 'With icon adornments',
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '320px' }}>
      <Input.Root {...args}>
        <Input.Label>Search</Input.Label>
        <Input.Field
          placeholder="Search..."
          leftIcon={<span style={{ fontSize: '14px' }}>🔍</span>}
        />
      </Input.Root>

      <Input.Root {...args}>
        <Input.Label>Password</Input.Label>
        <Input.Field
          type="password"
          placeholder="Enter password"
          rightIcon={<span style={{ fontSize: '14px' }}>👁</span>}
        />
      </Input.Root>

      <Input.Root {...args}>
        <Input.Label>Amount</Input.Label>
        <Input.Field
          placeholder="0.00"
          leftIcon={<span style={{ fontSize: '12px', fontWeight: 600 }}>₹</span>}
          rightIcon={<span style={{ fontSize: '11px' }}>INR</span>}
        />
      </Input.Root>
    </div>
  ),
};

// ─── Controlled ───────────────────────────────────────────────────────────────

export const Controlled: Story = {
  name: 'Controlled with validation',
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates controlled input with live validation. ' +
          'Error state and message are derived from component state — ' +
          'the Input parts respond automatically.',
      },
    },
  },
  render: function ControlledExample() {
    const [value,   setValue]   = React.useState('');
    const [touched, setTouched] = React.useState(false);

    const isInvalid = touched && value.length < 3;
    const error     = isInvalid ? 'Name must be at least 3 characters.' : undefined;

    return (
      <div style={{ width: '320px' }}>
        <Input.Root invalid={isInvalid} required>
          <Input.Label>Full name</Input.Label>
          <Input.Field
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="Jane Smith"
          />
          <Input.Helper>Minimum 3 characters.</Input.Helper>
          <Input.Error>{error}</Input.Error>
        </Input.Root>
        <p style={{ marginTop: '8px', fontSize: '12px', color: '#64748b' }}>
          Value: "{value}" · Invalid: {String(isInvalid)}
        </p>
      </div>
    );
  },
};