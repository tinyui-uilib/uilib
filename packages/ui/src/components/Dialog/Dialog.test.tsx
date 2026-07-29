import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog } from './Dialog';
import { Button } from '../Button/Button';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderDialog(overrides?: {
  size?:           'sm' | 'md' | 'lg';
  defaultOpen?:    boolean;
  onOpenChange?:   (open: boolean) => void;
  showCloseButton?: boolean;
}) {
  const {
    size            = 'md',
    defaultOpen     = false,
    onOpenChange,
    showCloseButton = true,
  } = overrides ?? {};

  return render(
    <Dialog.Root size={size} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <Dialog.Trigger>
        <Button>Open dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content showCloseButton={showCloseButton}>
        <Dialog.Header showCloseButton={showCloseButton}>
          <Dialog.Title>Dialog title</Dialog.Title>
          <Dialog.Description>Dialog description</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <p>Dialog body content</p>
          <input aria-label="Name" placeholder="Enter name" />
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close>
            <Button intent="secondary">Cancel</Button>
          </Dialog.Close>
          <Button>Confirm</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>,
  );
}

async function openDialog(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Open dialog' }));
  await waitFor(() => {
    expect(within(document.body).getByRole('dialog')).toBeInTheDocument();
  });
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Dialog', () => {

  // ── Rendering ───────────────────────────────────────────────────────────────

  describe('rendering', () => {
    it('renders trigger button', () => {
      renderDialog();
      expect(screen.getByRole('button', { name: 'Open dialog' })).toBeInTheDocument();
    });

    it('does not render dialog content when closed', () => {
      renderDialog();
      expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders dialog when defaultOpen is true', () => {
      renderDialog({ defaultOpen: true });
      expect(within(document.body).getByRole('dialog')).toBeInTheDocument();
    });
  });

  // ── Open / close ────────────────────────────────────────────────────────────

  describe('open and close', () => {
    it('opens on trigger click', async () => {
      const user = userEvent.setup();
      renderDialog();
      await openDialog(user);
      expect(within(document.body).getByRole('dialog')).toBeInTheDocument();
    });

    it('closes on Escape key', async () => {
      const user = userEvent.setup();
      renderDialog();
      await openDialog(user);

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('closes when close button is clicked', async () => {
      const user = userEvent.setup();
      renderDialog();
      await openDialog(user);

      await user.click(
        within(document.body).getByRole('button', { name: 'Close dialog' }),
      );

      await waitFor(() => {
        expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('closes when Cancel button is clicked', async () => {
      const user = userEvent.setup();
      renderDialog();
      await openDialog(user);

      await user.click(
        within(document.body).getByRole('button', { name: 'Cancel' }),
      );

      await waitFor(() => {
        expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('calls onOpenChange when dialog opens', async () => {
      const user         = userEvent.setup();
      const onOpenChange = vi.fn();
      renderDialog({ onOpenChange });

      await user.click(screen.getByRole('button', { name: 'Open dialog' }));

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it('calls onOpenChange when dialog closes', async () => {
      const user         = userEvent.setup();
      const onOpenChange = vi.fn();
      renderDialog({ onOpenChange });

      await openDialog(user);
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });

  // ── Accessibility ────────────────────────────────────────────────────────────

  describe('accessibility', () => {
    it('dialog has role="dialog"', async () => {
      const user = userEvent.setup();
      renderDialog();
      await openDialog(user);

      expect(within(document.body).getByRole('dialog')).toBeInTheDocument();
    });

    it('dialog has aria-modal="true"', async () => {
      const user = userEvent.setup();
      renderDialog();
      await openDialog(user);

      expect(within(document.body).getByRole('dialog')).toHaveAttribute(
        'aria-modal',
        'true',
      );
    });

    it('dialog is labelled by title', async () => {
      const user = userEvent.setup();
      renderDialog();
      await openDialog(user);

      const dialog = within(document.body).getByRole('dialog');
      const titleId = within(document.body)
        .getByText('Dialog title')
        .getAttribute('id');

      expect(dialog).toHaveAttribute('aria-labelledby', titleId);
    });

    it('dialog is described by description', async () => {
      const user = userEvent.setup();
      renderDialog();
      await openDialog(user);

      const dialog      = within(document.body).getByRole('dialog');
      const descId      = within(document.body)
        .getByText('Dialog description')
        .getAttribute('id');

      expect(dialog).toHaveAttribute('aria-describedby', descId);
    });

    it('renders title and description content', async () => {
      const user = userEvent.setup();
      renderDialog();
      await openDialog(user);

      const body = within(document.body);
      expect(body.getByText('Dialog title')).toBeInTheDocument();
      expect(body.getByText('Dialog description')).toBeInTheDocument();
    });
  });

  // ── Focus management ─────────────────────────────────────────────────────────

  describe('focus management', () => {
    it('focuses the first focusable element on open', async () => {
      const user = userEvent.setup();
      renderDialog();
      await openDialog(user);

      await waitFor(() => {
        // Radix focuses the first interactive element — the close button
        // or the first input depending on the dialog structure
        const dialog = within(document.body).getByRole('dialog');
        expect(dialog.contains(document.activeElement)).toBe(true);
      });
    });

    it('returns focus to trigger after close', async () => {
      const user    = userEvent.setup();
      const trigger = screen.getByRole('button', { name: 'Open dialog' });

      renderDialog();
      await openDialog(user);
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(trigger).toHaveFocus();
      });
    });
  });

  // ── Close button visibility ───────────────────────────────────────────────────

  describe('close button', () => {
    it('shows close button by default', async () => {
      const user = userEvent.setup();
      renderDialog();
      await openDialog(user);

      expect(
        within(document.body).getByRole('button', { name: 'Close dialog' }),
      ).toBeInTheDocument();
    });

    it('hides close button when showCloseButton=false', async () => {
      const user = userEvent.setup();
      renderDialog({ showCloseButton: false });
      await openDialog(user);

      expect(
        within(document.body).queryByRole('button', { name: 'Close dialog' }),
      ).not.toBeInTheDocument();
    });
  });

  // ── Simple variant ───────────────────────────────────────────────────────────

  describe('Dialog.Simple', () => {
    it('renders trigger, title and description', async () => {
      const user = userEvent.setup();

      render(
        <Dialog.Simple
          trigger={<Button>Open</Button>}
          title="Confirm action"
          description="Are you sure you want to proceed?"
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));

      await waitFor(() => {
        const body = within(document.body);
        expect(body.getByText('Confirm action')).toBeInTheDocument();
        expect(body.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
      });
    });

    it('renders children in the body', async () => {
      const user = userEvent.setup();

      render(
        <Dialog.Simple
          trigger={<Button>Open</Button>}
          title="Settings"
        >
          <p>Settings content here</p>
        </Dialog.Simple>,
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));

      await waitFor(() => {
        expect(
          within(document.body).getByText('Settings content here'),
        ).toBeInTheDocument();
      });
    });

    it('renders actions in the footer', async () => {
      const user    = userEvent.setup();
      const onClick = vi.fn();

      render(
        <Dialog.Simple
          trigger={<Button>Open</Button>}
          title="Delete item"
          actions={
            <Button intent="destructive" onClick={onClick}>
              Delete
            </Button>
          }
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));

      await waitFor(() => {
        within(document.body).getByRole('button', { name: 'Delete' });
      });

      await user.click(within(document.body).getByRole('button', { name: 'Delete' }));
      expect(onClick).toHaveBeenCalledOnce();
    });

    it('title is visually hidden when titleSrOnly=true', async () => {
      const user = userEvent.setup();

      render(
        <Dialog.Simple
          trigger={<Button>Open</Button>}
          title="Hidden title"
          titleSrOnly
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));

      await waitFor(() => {
        // Title still in DOM for AT — just visually hidden
        expect(
          within(document.body).getByText('Hidden title'),
        ).toBeInTheDocument();
      });
    });

    it('controlled open state works', async () => {
      const user         = userEvent.setup();
      const onOpenChange = vi.fn();

      const { rerender } = render(
        <Dialog.Simple
          trigger={<Button>Open</Button>}
          title="Controlled"
          open={false}
          onOpenChange={onOpenChange}
        />,
      );

      // Dialog should not be open
      expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument();

      rerender(
        <Dialog.Simple
          trigger={<Button>Open</Button>}
          title="Controlled"
          open={true}
          onOpenChange={onOpenChange}
        />,
      );

      await waitFor(() => {
        expect(within(document.body).getByRole('dialog')).toBeInTheDocument();
      });
    });
  });

  // ── displayName ──────────────────────────────────────────────────────────────

  describe('displayName', () => {
    it('Content has correct displayName', () => {
      expect(Dialog.Content.displayName).toBe('Dialog.Content');
    });
  });

});