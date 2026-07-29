import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { expect, userEvent, within, waitFor } from '@storybook/test';
import { Dialog } from './Dialog';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Select } from '../Select/Select';

const meta: Meta = {
  title:      'Components/Dialog',
  tags:       ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Accessible dialog built on Radix UI Dialog.',
          'Radix handles: focus trap, scroll lock, portal rendering,',
          '`aria-modal`, and focus restoration on close.',
          'Use `Dialog.Simple` for quick confirmation dialogs.',
          'Use `Dialog.Root` + parts for full control.',
        ].join(' '),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Simple — confirmation ────────────────────────────────────────────────────

export const Confirmation: Story = {
  name: 'Simple — confirmation',
  parameters: {
    docs: {
      description: {
        story:
          '`Dialog.Simple` covers the most common pattern: ' +
          'a trigger, title, description, and footer actions. ' +
          'Cancel closes the dialog via `Dialog.Close`.',
      },
    },
  },
  render: function ConfirmationStory() {
    const [confirmed, setConfirmed] = useState(false);
    const [open, setOpen]           = useState(false);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <Dialog.Simple
          open={open}
          onOpenChange={setOpen}
          trigger={<Button intent="destructive">Delete account</Button>}
          title="Delete account"
          description="This action cannot be undone. All your data will be permanently removed."
          size="sm"
          actions={
            <>
              <Dialog.Close>
                <Button intent="secondary">Cancel</Button>
              </Dialog.Close>
              <Button
                intent="destructive"
                onClick={() => {
                  setConfirmed(true);
                  setOpen(false);
                }}
              >
                Delete account
              </Button>
            </>
          }
        />
        {confirmed && (
          <p style={{ fontSize: '14px', color: 'var(--color-destructive-default)' }}>
            Account deleted.
          </p>
        )}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
        canvas.getByRole('button', { name: 'Delete account' }),
    );

    // Wait for dialog to appear
    await waitFor(() => {
        expect(within(document.body).getByRole('dialog')).toBeInTheDocument();
    });

    // Scope to the dialog — avoids matching the trigger button text
    const dialog = within(document.body).getByRole('dialog');

    await waitFor(() => {
        expect(within(dialog).getByRole('heading', { name: 'Delete account' })).toBeInTheDocument();
    });

    // Close with Escape
    await userEvent.keyboard('{Escape}');

    await waitFor(() => {
        expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument();
    });
    },
};

// ─── All sizes ────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  name: 'All sizes',
  render: function SizesStory() {
    return (
      <div style={{ display: 'flex', gap: '12px' }}>
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <Dialog.Root key={size} size={size}>
            <Dialog.Trigger>
              <Button intent="secondary" size="sm">{size}</Button>
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Size: {size}</Dialog.Title>
                <Dialog.Description>
                  This dialog uses size="{size}" — max-width{' '}
                  {size === 'sm' ? '400px' : size === 'md' ? '560px' : '720px'}.
                </Dialog.Description>
              </Dialog.Header>
              <Dialog.Body>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                  Dialog body content goes here. This area scrolls when content
                  overflows the dialog height.
                </p>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.Close>
                  <Button intent="secondary">Close</Button>
                </Dialog.Close>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Root>
        ))}
      </div>
    );
  },
};

// ─── Form dialog ──────────────────────────────────────────────────────────────

export const FormDialog: Story = {
  name: 'Form dialog',
  parameters: {
    docs: {
      description: {
        story:
          'Dialog composing Input and Select from the same library. ' +
          'Proves the full token system works inside a portal — ' +
          'theme class is inherited from the document root.',
      },
    },
  },
  render: function FormDialogStory() {
    const [open, setOpen] = useState(false);
    const [saved, setSaved] = useState(false);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <Dialog.Root open={open} onOpenChange={setOpen} size="md">
          <Dialog.Trigger>
            <Button>Edit profile</Button>
          </Dialog.Trigger>

          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Edit profile</Dialog.Title>
              <Dialog.Description>
                Update your personal information.
              </Dialog.Description>
            </Dialog.Header>

            <Dialog.Body>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Input.Root>
                  <Input.Label>Full name</Input.Label>
                  <Input.Field placeholder="Pradhumn Sharma" defaultValue="Pradhumn Sharma" />
                </Input.Root>

                <Input.Root>
                  <Input.Label>Email</Input.Label>
                  <Input.Field
                    type="email"
                    placeholder="pradhumn@example.com"
                    defaultValue="pradhumn@example.com"
                  />
                </Input.Root>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{
                    fontSize:   'var(--typography-font-size-sm)',
                    fontWeight: 'var(--typography-font-weight-medium)',
                    color:      'var(--color-text-primary)',
                  }}>
                    Role
                  </label>
                  <Select.Root defaultValue="engineer">
                    <Select.Trigger placeholder="Select a role..." />
                    <Select.Content>
                      <Select.Item value="engineer">Engineer</Select.Item>
                      <Select.Item value="designer">Designer</Select.Item>
                      <Select.Item value="manager">Manager</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </div>
              </div>
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.Close>
                <Button intent="secondary">Cancel</Button>
              </Dialog.Close>
              <Button
                onClick={() => {
                  setSaved(true);
                  setOpen(false);
                }}
              >
                Save changes
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>

        {saved && (
          <p style={{ fontSize: '14px', color: 'var(--color-success-default)' }}>
            Profile saved.
          </p>
        )}
      </div>
    );
  },
};

// ─── Scrollable content ───────────────────────────────────────────────────────

export const ScrollableContent: Story = {
  name: 'Scrollable content',
  parameters: {
    docs: {
      description: {
        story:
          'When body content overflows, the body scrolls independently. ' +
          'Header and footer remain sticky — the title and actions are ' +
          'always visible regardless of scroll position.',
      },
    },
  },
  render: function ScrollableStory() {
    return (
      <Dialog.Root size="sm">
        <Dialog.Trigger>
          <Button>Open long dialog</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Terms of service</Dialog.Title>
            <Dialog.Description>
              Please read carefully before accepting.
            </Dialog.Description>
          </Dialog.Header>

          <Dialog.Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i}>
                  <p style={{
                    fontWeight: '600',
                    fontSize:   '14px',
                    marginBottom: '4px',
                    color: 'var(--color-text-primary)',
                  }}>
                    Section {i + 1}
                  </p>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco.
                  </p>
                </div>
              ))}
            </div>
          </Dialog.Body>

          <Dialog.Footer>
            <Dialog.Close>
              <Button intent="secondary">Decline</Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button>Accept</Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    );
  },
};

// ─── No close button ──────────────────────────────────────────────────────────

export const NoCloseButton: Story = {
  name: 'No header close button',
  parameters: {
    docs: {
      description: {
        story:
          'Use `showCloseButton={false}` for dialogs where ' +
          'an explicit action is required (no passive dismissal). ' +
          'Escape key still closes — Radix enforces this for accessibility.',
      },
    },
  },
  render: function NoCloseButtonStory() {
    return (
      <Dialog.Root size="sm">
        <Dialog.Trigger>
          <Button>Open required dialog</Button>
        </Dialog.Trigger>
        <Dialog.Content showCloseButton={false}>
          <Dialog.Header showCloseButton={false}>
            <Dialog.Title>Session expired</Dialog.Title>
            <Dialog.Description>
              Your session has expired. Please sign in again to continue.
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Footer>
            <Dialog.Close>
              <Button fullWidth>Sign in</Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    );
  },
};

// ─── Nested dialogs ───────────────────────────────────────────────────────────

export const NestedDialogs: Story = {
  name: 'Nested dialogs',
  parameters: {
    docs: {
      description: {
        story:
          'Radix supports nested dialogs — each has its own focus trap. ' +
          'Closing the inner dialog returns focus to the inner trigger, ' +
          'not the outer trigger.',
      },
    },
  },
  render: function NestedStory() {
    return (
      <Dialog.Root>
        <Dialog.Trigger>
          <Button>Open outer dialog</Button>
        </Dialog.Trigger>
        <Dialog.Content size="md">
          <Dialog.Header>
            <Dialog.Title>Outer dialog</Dialog.Title>
            <Dialog.Description>
              This dialog contains a trigger for a nested dialog.
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>
            <Dialog.Root>
              <Dialog.Trigger>
                <Button intent="secondary" size="sm">Open inner dialog</Button>
              </Dialog.Trigger>
              <Dialog.Content size="sm">
                <Dialog.Header>
                  <Dialog.Title>Inner dialog</Dialog.Title>
                  <Dialog.Description>
                    This is nested inside the outer dialog.
                  </Dialog.Description>
                </Dialog.Header>
                <Dialog.Footer>
                  <Dialog.Close>
                    <Button size="sm">Close inner</Button>
                  </Dialog.Close>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Root>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close>
              <Button intent="secondary">Close outer</Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    );
  },
};

// ─── Keyboard navigation ──────────────────────────────────────────────────────

export const KeyboardNavigation: Story = {
  name: 'Keyboard navigation',
  parameters: {
    docs: {
      description: {
        story: [
          '**Enter / Space** on trigger — opens dialog.',
          '**Tab** — cycles through focusable elements inside dialog.',
          '**Shift + Tab** — cycles backwards.',
          '**Escape** — closes and returns focus to trigger.',
          'Tab cannot reach elements behind the dialog.',
        ].join(' '),
      },
    },
  },
  render: function KeyboardStory() {
    return (
      <Dialog.Root size="sm">
        <Dialog.Trigger>
          <Button>Open with keyboard</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Keyboard test</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Input.Root>
                <Input.Label>First field</Input.Label>
                <Input.Field placeholder="Tab to this" />
              </Input.Root>
              <Input.Root>
                <Input.Label>Second field</Input.Label>
                <Input.Field placeholder="Then this" />
              </Input.Root>
            </div>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close>
              <Button intent="secondary">Cancel</Button>
            </Dialog.Close>
            <Button>Confirm</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open with Enter key
    canvas.getByRole('button', { name: 'Open with keyboard' }).focus();
    await userEvent.keyboard('{Enter}');

    await waitFor(() => {
      expect(within(document.body).getByRole('dialog')).toBeInTheDocument();
    });

    // Tab through elements — all should remain inside dialog
    await userEvent.keyboard('{Tab}');
    await userEvent.keyboard('{Tab}');
    await userEvent.keyboard('{Tab}');

    const dialog = within(document.body).getByRole('dialog');
    expect(dialog.contains(document.activeElement)).toBe(true);

    // Close with Escape
    await userEvent.keyboard('{Escape}');

    await waitFor(() => {
      expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Focus should return to trigger
    expect(
      canvas.getByRole('button', { name: 'Open with keyboard' }),
    ).toHaveFocus();
  },
};