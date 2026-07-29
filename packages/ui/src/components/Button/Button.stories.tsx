import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import { expect, fn, userEvent, within } from '@storybook/test';
import { Button } from './Button';

type ButtonArgs = ComponentProps<typeof Button>;

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],

  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Accessible button built on a native `<button>` element.',
          'Supports polymorphism via `asChild` (Radix Slot), 5 intents,',
          '5 sizes, loading state, and icon slots.',
          'Zero runtime styling via Vanilla Extract.',
        ].join(' '),
      },
    },
  },

  argTypes: {
    intent: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'destructive', 'link'] satisfies ButtonArgs['intent'][],
      description: 'Semantic role of the action',
      table: { defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'] satisfies ButtonArgs['size'][],
      table: { defaultValue: { summary: 'md' } },
    },
    loading:   { control: 'boolean' },
    disabled:  { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    asChild:   { table: { disable: true } },
    leftIcon:  { table: { disable: true } },
    rightIcon: { table: { disable: true } },
  },

  args: {
    onClick: fn(),
    children: 'Button',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Intents: Story = {
  name: 'All intents',
  render: (args: ButtonArgs) => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button {...args} intent="primary">Primary</Button>
      <Button {...args} intent="secondary">Secondary</Button>
      <Button {...args} intent="ghost">Ghost</Button>
      <Button {...args} intent="destructive">Destructive</Button>
      <Button {...args} intent="link">Link</Button>
    </div>
  ),
};

export const Sizes: Story = {
  name: 'All sizes',
  render: (args: ButtonArgs) => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button {...args} size="xs">XSmall</Button>
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
      <Button {...args} size="xl">XLarge</Button>
    </div>
  ),
};

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Saving changes',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await expect(button).toBeDisabled();
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await expect(button).toBeDisabled();
    await userEvent.click(button, { pointerEventsCheck: 0 });
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const WithIcons: Story = {
  name: 'With icons',
  render: (args: ButtonArgs) => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button {...args} leftIcon={<span>←</span>}>Back</Button>
      <Button {...args} rightIcon={<span>→</span>}>Next</Button>
      <Button {...args} leftIcon={<span>↓</span>} rightIcon={<span>↗</span>}>Both</Button>
    </div>
  ),
};

export const AsLink: Story = {
  name: 'asChild — renders as <a>',
  render: (args: ButtonArgs) => (
    <Button {...args} asChild intent="secondary">
      <a href="https://github.com" target="_blank" rel="noopener noreferrer">
        View on GitHub ↗
      </a>
    </Button>
  ),
};

export const FullWidth: Story = {
  name: 'Full width',
  args: { fullWidth: true },
  decorators: [
    (Story) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    ),
  ],
};

export const KeyboardInteraction: Story = {
  name: 'Keyboard: Enter and Space',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);

    button.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledTimes(2);

    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(3);
  },
};

export const AllVariants: Story = {
  name: 'All variants grid',
  parameters: { layout: 'padded' },
  render: () => {
    const intents = ['primary', 'secondary', 'ghost', 'destructive'] as const;
    const sizes   = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {sizes.map((size) => (
          <div key={size} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {intents.map((intent) => (
              <Button key={intent} size={size} intent={intent}>
                {intent}
              </Button>
            ))}
          </div>
        ))}
      </div>
    );
  },
};