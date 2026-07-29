import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import { Badge } from './Badge';

type BadgeProps = ComponentProps<typeof Badge>;

const meta: Meta<typeof Badge> = {
  title:     'Components/Badge',
  component: Badge,
  tags:      ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'subtle', 'outline'] satisfies BadgeProps['variant'][],
    },
    intent: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'destructive'] satisfies BadgeProps['intent'][],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'] satisfies BadgeProps['size'][],
    },
  },
  args: { children: 'Badge' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllIntents: Story = {
  name: 'All intents',
  render: (args) => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {(['default', 'primary', 'success', 'warning', 'destructive'] as const).map((intent) => (
        <Badge key={intent} {...args} intent={intent}>{intent}</Badge>
      ))}
    </div>
  ),
};

export const AllVariants: Story = {
  name: 'All variants × intents',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {(['solid', 'subtle', 'outline'] as const).map((variant) => (
        <div key={variant} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', width: '56px' }}>{variant}</span>
          {(['default', 'primary', 'success', 'warning', 'destructive'] as const).map((intent) => (
            <Badge key={intent} variant={variant} intent={intent}>{intent}</Badge>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  name: 'All sizes',
  render: (args) => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Badge {...args} size="sm">Small</Badge>
      <Badge {...args} size="md">Medium</Badge>
      <Badge {...args} size="lg">Large</Badge>
    </div>
  ),
};

export const WithIcons: Story = {
  name: 'With icons',
  render: (args) => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Badge {...args} intent="success" leftIcon={<span>✓</span>}>Verified</Badge>
      <Badge {...args} intent="warning" leftIcon={<span>⚠</span>}>Pending</Badge>
      <Badge {...args} intent="destructive" rightIcon={<span>✕</span>}>Failed</Badge>
    </div>
  ),
};