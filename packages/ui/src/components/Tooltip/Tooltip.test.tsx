import { describe, it, expect } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip, TooltipProvider } from './Tooltip';
import { Button } from '../Button/Button';

function renderTooltip(content = 'Tooltip text', delayDuration = 0) {
  return render(
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip content={content} delayDuration={delayDuration}>
        <Button>Hover me</Button>
      </Tooltip>
    </TooltipProvider>,
  );
}

describe('Tooltip', () => {
  it('does not render tooltip content initially', () => {
    renderTooltip();
    expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
  });

  it('shows tooltip on hover', async () => {
    const user = userEvent.setup();
    renderTooltip('Hello tooltip', 0);

    await user.hover(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Hello tooltip')).toBeInTheDocument();
    });
  });

  it('hides tooltip on mouse leave', async () => {
    const user = userEvent.setup();
    renderTooltip('Bye tooltip', 0);

    await user.hover(screen.getByRole('button'));
    await waitFor(() => screen.getByText('Bye tooltip'));

    await user.unhover(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.queryByText('Bye tooltip')).not.toBeInTheDocument();
    });
  });

  it('shows tooltip on focus', async () => {
    renderTooltip('Focus tooltip', 0);
    act(() => screen.getByRole('button').focus());

    await waitFor(() => {
      expect(screen.getByText('Focus tooltip')).toBeInTheDocument();
    });
  });

  it('renders tooltip content in a portal', async () => {
    const user = userEvent.setup();
    renderTooltip('Portal tooltip', 0);

    await user.hover(screen.getByRole('button'));

    await waitFor(() => {
      expect(
        document.body.querySelector('[role="tooltip"]'),
      ).toBeInTheDocument();
    });
  });
});