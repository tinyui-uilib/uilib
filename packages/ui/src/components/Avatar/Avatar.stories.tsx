import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarParts, getInitials } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title:     'Components/Avatar',
  component: Avatar,
  tags:      ['autodocs'],

  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Avatar built on Radix UI Avatar primitive.',
          'Handles three states: image loaded, image failed (shows initials),',
          'and no src (shows initials immediately).',
          'Radix manages the image → fallback transition with a configurable delay.',
        ].join(' '),
      },
    },
  },

  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      table: { defaultValue: { summary: 'md' } },
    },
    shape: {
      control: 'select',
      options: ['circle', 'square'],
      table: { defaultValue: { summary: 'circle' } },
    },
    status: {
      control: 'select',
      options: [undefined, 'online', 'offline', 'away', 'busy'],
    },
  },

  args: {
    name: 'Pradhumn Sharma',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {};

// ─── With image ───────────────────────────────────────────────────────────────

export const WithImage: Story = {
  name: 'With image',
  args: {
    src:  'https://i.pravatar.cc/150?img=3',
    alt:  'Pradhumn Sharma',
    name: 'Pradhumn Sharma',
  },
};

// ─── Image fallback ───────────────────────────────────────────────────────────

export const ImageFallback: Story = {
  name: 'Image fallback (broken src)',
  parameters: {
    docs: {
      description: {
        story:
          'Radix detects the image load failure and shows the fallback ' +
          'automatically. No onError handler needed in component code.',
      },
    },
  },
  args: {
    src:  'https://broken-url.example.com/avatar.jpg',
    name: 'Pradhumn Sharma',
  },
};

// ─── All sizes ────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  name: 'All sizes',
  render: (args) => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
        <Avatar key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

// ─── All shapes ───────────────────────────────────────────────────────────────

export const Shapes: Story = {
  name: 'Circle vs square',
  render: (args) => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Avatar {...args} shape="circle" />
      <Avatar {...args} shape="square" />
    </div>
  ),
};

// ─── Status indicators ────────────────────────────────────────────────────────

export const StatusIndicators: Story = {
  name: 'Status indicators',
  render: (args) => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      {(['online', 'offline', 'away', 'busy'] as const).map((status) => (
        <div
          key={status}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
        >
          <Avatar {...args} status={status} size="lg" />
          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            {status}
          </span>
        </div>
      ))}
    </div>
  ),
};

// ─── Avatar group ─────────────────────────────────────────────────────────────

export const AvatarGroup: Story = {
  name: 'Avatar group (stacked)',
  parameters: {
    docs: {
      description: {
        story:
          'Stacking achieved via negative margin. ' +
          'The border comes from the ring pattern using box-shadow — ' +
          'no extra wrapper element needed.',
      },
    },
  },
  render: () => {
    const users = [
      { name: 'Pradhumn Sharma',  src: 'https://i.pravatar.cc/150?img=1' },
      { name: 'Anika Gupta',      src: 'https://i.pravatar.cc/150?img=2' },
      { name: 'Rohan Mehta',      src: 'https://i.pravatar.cc/150?img=3' },
      { name: 'Sneha Patel',      src: undefined                          },
      { name: 'Vikram Singh',     src: undefined                          },
    ];

    return (
      <div style={{ display: 'flex' }}>
        {users.map((user, i) => (
          <div
            key={user.name}
            style={{
              marginLeft:  i === 0 ? 0 : '-10px',
              boxShadow:   `0 0 0 2px var(--color-surface-default)`,
              borderRadius: '9999px',
            }}
          >
            <Avatar
              name={user.name}
              src={user.src}
              size="md"
            />
          </div>
        ))}
      </div>
    );
  },
};

// ─── Compound usage ───────────────────────────────────────────────────────────

export const CompoundParts: Story = {
  name: 'AvatarParts compound',
  parameters: {
    docs: {
      description: {
        story:
          'Use `AvatarParts.*` for full control over fallback content. ' +
          'Useful when you need an icon instead of initials.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <AvatarParts.Root size="lg">
        <AvatarParts.Image
          src="https://i.pravatar.cc/150?img=5"
          alt="User"
        />
        <AvatarParts.Fallback delayMs={300}>
          JD
        </AvatarParts.Fallback>
      </AvatarParts.Root>

      <AvatarParts.Root size="lg">
        <AvatarParts.Fallback delayMs={0}>
          {/* Custom SVG icon as fallback */}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
        </AvatarParts.Fallback>
      </AvatarParts.Root>
    </div>
  ),
};