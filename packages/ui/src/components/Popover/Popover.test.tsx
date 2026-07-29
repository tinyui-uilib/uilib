import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover } from './Popover';
import { Button } from '../Button/Button';

function renderPopover(onOpenChange?: (o: boolean) => void) {
  return render(
    <Popover.Root onOpenChange={onOpenChange}>
      <Popover.Trigger>
        <Button>Open popover</Button>
      </Popover.Trigger>
      <Popover.Content style={{ width: '240px' }}>
        <Popover.Header title="Popover title" />
        <p style={{ margin: 0, fontSize: '14px' }}>Popover body content</p>
      </Popover.Content>
    </Popover.Root>,
  );
}

describe('Popover', () => {
  it('trigger renders', () => {
    renderPopover();
    expect(screen.getByRole('button', { name: 'Open popover' })).toBeInTheDocument();
  });

  it('content is not visible initially', () => {
    renderPopover();
    expect(screen.queryByText('Popover title')).not.toBeInTheDocument();
  });

  it('opens on trigger click', async () => {
    const user = userEvent.setup();
    renderPopover();

    await user.click(screen.getByRole('button', { name: 'Open popover' }));

    await waitFor(() => {
      expect(within(document.body).getByText('Popover title')).toBeInTheDocument();
    });
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    renderPopover();

    await user.click(screen.getByRole('button', { name: 'Open popover' }));
    await waitFor(() => within(document.body).getByText('Popover title'));

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(within(document.body).queryByText('Popover title')).not.toBeInTheDocument();
    });
  });

  it('closes when close button is clicked', async () => {
    const user = userEvent.setup();
    renderPopover();

    await user.click(screen.getByRole('button', { name: 'Open popover' }));
    await waitFor(() => within(document.body).getByText('Popover title'));

    await user.click(within(document.body).getByRole('button', { name: 'Close' }));

    await waitFor(() => {
      expect(within(document.body).queryByText('Popover title')).not.toBeInTheDocument();
    });
  });

  it('closes on outside click', async () => {
    const user = userEvent.setup();
    renderPopover();

    await user.click(screen.getByRole('button', { name: 'Open popover' }));
    await waitFor(() => within(document.body).getByText('Popover title'));

    await user.click(document.body);

    await waitFor(() => {
      expect(within(document.body).queryByText('Popover title')).not.toBeInTheDocument();
    });
  });

  it('calls onOpenChange', async () => {
    const user         = userEvent.setup();
    const onOpenChange = vi.fn();
    renderPopover(onOpenChange);

    await user.click(screen.getByRole('button', { name: 'Open popover' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});