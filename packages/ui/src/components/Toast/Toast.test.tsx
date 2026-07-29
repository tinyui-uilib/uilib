import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from './Toast';

// ─── Test helper ──────────────────────────────────────────────────────────────
// Component that exposes useToast so we can call it from tests

function ToastTrigger({
  onShow,
}: {
  onShow?: (show: ReturnType<typeof useToast>['show']) => void;
}) {
  const { show } = useToast();

  return (
    <button
      onClick={() =>
        onShow != null
          ? onShow(show)
          : show({ title: 'Test toast' })
      }
    >
      Show toast
    </button>
  );
}

function renderWithProvider(ui: React.ReactNode, duration = 100000) {
  return render(
    <ToastProvider duration={duration}>{ui}</ToastProvider>,
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Toast', () => {

  describe('ToastProvider', () => {
    it('renders children', () => {
      renderWithProvider(<p>Hello</p>);
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });

    it('throws when useToast is used outside provider', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      expect(() => render(<ToastTrigger />)).toThrow(
        'useToast must be used inside <ToastProvider>',
      );

      spy.mockRestore();
    });
  });

  describe('show()', () => {
    it('renders the toast with correct title', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <ToastTrigger
          onShow={(show) => show({ title: 'File saved' })}
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Show toast' }));

      await waitFor(() => {
        expect(screen.getByText('File saved')).toBeInTheDocument();
      });
    });

    it('renders description when provided', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <ToastTrigger
          onShow={(show) =>
            show({ title: 'Saved', description: 'Your changes were saved.' })
          }
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Show toast' }));

      await waitFor(() => {
        expect(screen.getByText('Your changes were saved.')).toBeInTheDocument();
      });
    });

    it('renders action button when provided', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <ToastTrigger
          onShow={(show) =>
            show({
              title:  'Message sent',
              action: { label: 'Undo', onClick: vi.fn() },
            })
          }
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Show toast' }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument();
      });
    });

    it('calls action.onClick when action button is clicked', async () => {
      const user     = userEvent.setup();
      const onAction = vi.fn();

      renderWithProvider(
        <ToastTrigger
          onShow={(show) =>
            show({
              title:  'Deleted',
              action: { label: 'Undo', onClick: onAction },
            })
          }
        />,
      );

      await user.click(screen.getByRole('button', { name: 'Show toast' }));

      await waitFor(() => {
        screen.getByRole('button', { name: 'Undo' });
      });

      await user.click(screen.getByRole('button', { name: 'Undo' }));
      expect(onAction).toHaveBeenCalledOnce();
    });
  });

  describe('dismiss', () => {
    it('dismiss button removes the toast', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <ToastTrigger onShow={(show) => show({ title: 'Dismissable' })} />,
      );

      await user.click(screen.getByRole('button', { name: 'Show toast' }));

      await waitFor(() => {
        screen.getByText('Dismissable');
      });

      await user.click(
        screen.getByRole('button', { name: 'Dismiss notification' }),
      );

      await waitFor(() => {
        expect(screen.queryByText('Dismissable')).not.toBeInTheDocument();
      });
    });
  });

  describe('multiple toasts', () => {
    it('renders multiple toasts', async () => {
      const user = userEvent.setup();

      renderWithProvider(
        <>
          <ToastTrigger onShow={(show) => show({ title: 'First toast' })} />
          <ToastTrigger onShow={(show) => show({ title: 'Second toast' })} />
        </>,
      );

      const buttons = screen.getAllByRole('button', { name: 'Show toast' });

      await user.click(buttons[0]!);
      await user.click(buttons[1]!);

      await waitFor(() => {
        expect(screen.getByText('First toast')).toBeInTheDocument();
        expect(screen.getByText('Second toast')).toBeInTheDocument();
      });
    });
  });

});