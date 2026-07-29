import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { expect, userEvent, within, waitFor } from '@storybook/test';
import { ToastProvider, useToast, type ToastVariant } from './Toast';
import { Button } from '../Button/Button';

// Every story must be wrapped in ToastProvider
const meta: Meta = {
  title:      'Components/Toast',
  tags:       ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Imperative toast notifications built on Radix UI Toast.',
          'Call `useToast().show()` from anywhere inside `<ToastProvider>`.',
          'Radix handles aria-live announcements, swipe-to-dismiss,',
          'and focus management automatically.',
        ].join(' '),
      },
    },
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: function DefaultStory() {
    const { show } = useToast();
    return (
      <Button
        onClick={() => show({ title: 'Changes saved successfully.' })}
      >
        Show toast
      </Button>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Show toast' }));
    await waitFor(() => {
      expect(within(document.body).getByText('Changes saved successfully.')).toBeInTheDocument();
    });
  },
};

// ─── With description ─────────────────────────────────────────────────────────

export const WithDescription: Story = {
  name: 'With description',
  render: function WithDescriptionStory() {
    const { show } = useToast();
    return (
      <Button
        onClick={() =>
          show({
            title:       'Profile updated',
            description: 'Your changes have been saved and will take effect immediately.',
          })
        }
      >
        Show toast
      </Button>
    );
  },
};

// ─── All variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  name: 'All variants',
  render: function AllVariantsStory() {
    const { show } = useToast();

    const variants: Array<{ variant: ToastVariant; title: string; description: string }> = [
      { variant: 'default', title: 'Default',         description: 'Neutral notification.'          },
      { variant: 'success', title: 'Success',         description: 'Operation completed.'           },
      { variant: 'error',   title: 'Error',           description: 'Something went wrong.'          },
      { variant: 'warning', title: 'Warning',         description: 'Proceed with caution.'          },
      { variant: 'info',    title: 'Info',            description: 'Here is some information.'      },
    ];

    return (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {variants.map(({ variant, title, description }) => (
          <Button
            key={variant}
            intent="secondary"
            size="sm"
            onClick={() => show({ title, description, variant })}
          >
            {variant}
          </Button>
        ))}
      </div>
    );
  },
};

// ─── With action ──────────────────────────────────────────────────────────────

export const WithAction: Story = {
  name: 'With action button',
  parameters: {
    docs: {
      description: {
        story:
          '`action` renders a button inside the toast. ' +
          'Radix adds `altText` as an accessible label for screen readers ' +
          'that cannot interact with toasts directly.',
      },
    },
  },
  render: function WithActionStory() {
    const { show }      = useToast();
    const [count, setCount] = React.useState(0);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <Button
          onClick={() =>
            show({
              title:       'Item deleted',
              description: 'The item was removed from your library.',
              variant:     'default',
              action: {
                label:   'Undo',
                onClick: () => setCount((c) => c + 1),
              },
            })
          }
        >
          Delete item
        </Button>
        {count > 0 && (
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
            Undo clicked {count} {count === 1 ? 'time' : 'times'}
          </p>
        )}
      </div>
    );
  },
};

// ─── Multiple toasts ──────────────────────────────────────────────────────────

export const Multiple: Story = {
  name: 'Multiple toasts (queue)',
  parameters: {
    docs: {
      description: {
        story:
          'Each call to `show()` adds to the queue. ' +
          'Toasts stack vertically — oldest at the bottom.',
      },
    },
  },
  render: function MultipleStory() {
    const { show }  = useToast();
    const [n, setN] = React.useState(0);

    return (
      <Button
        onClick={() => {
          setN((prev) => {
            const next = prev + 1;
            show({
              title:   `Notification #${next}`,
              variant: (['default', 'success', 'info', 'warning', 'error'] as const)[next % 5],
            });
            return next;
          });
        }}
      >
        Add toast
      </Button>
    );
  },
};

// ─── Long duration ────────────────────────────────────────────────────────────

export const Persistent: Story = {
  name: 'Persistent toast',
  parameters: {
    docs: {
      description: {
        story:
          'Set `duration: Infinity` for toasts that must be manually dismissed. ' +
          'Use for destructive actions where accidental dismissal would be harmful.',
      },
    },
  },
  render: function PersistentStory() {
    const { show } = useToast();
    return (
      <Button
        intent="destructive"
        onClick={() =>
          show({
            title:       'Permanent action',
            description: 'This cannot be undone. Dismiss when ready.',
            variant:     'error',
            duration:    Infinity,
          })
        }
      >
        Show persistent toast
      </Button>
    );
  },
};