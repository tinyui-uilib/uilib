import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion } from './Accordion';

function renderAccordion(type: 'single' | 'multiple' = 'single') {
  return render(
    <Accordion.Root type={type} collapsible>
      <Accordion.Item value="a">
        <Accordion.Trigger>Section A</Accordion.Trigger>
        <Accordion.Content>Content A</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="b">
        <Accordion.Trigger>Section B</Accordion.Trigger>
        <Accordion.Content>Content B</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>,
  );
}

describe('Accordion', () => {
  it('renders all triggers', () => {
    renderAccordion();
    expect(screen.getByText('Section A')).toBeInTheDocument();
    expect(screen.getByText('Section B')).toBeInTheDocument();
  });

  it('content is hidden by default', () => {
    renderAccordion();
    expect(screen.queryByText('Content A')).not.toBeInTheDocument();
  });

  it('opens content on trigger click', async () => {
    const user = userEvent.setup();
    renderAccordion();

    await user.click(screen.getByText('Section A'));
    expect(screen.getByText('Content A')).toBeInTheDocument();
  });

  it('closes open item on second click when collapsible', async () => {
    const user = userEvent.setup();
    renderAccordion();

    await user.click(screen.getByText('Section A'));
    expect(screen.getByText('Content A')).toBeInTheDocument();

    await user.click(screen.getByText('Section A'));
    expect(screen.queryByText('Content A')).not.toBeInTheDocument();
  });

  it('single type closes first when second is opened', async () => {
    const user = userEvent.setup();
    renderAccordion('single');

    await user.click(screen.getByText('Section A'));
    expect(screen.getByText('Content A')).toBeInTheDocument();

    await user.click(screen.getByText('Section B'));
    expect(screen.queryByText('Content A')).not.toBeInTheDocument();
    expect(screen.getByText('Content B')).toBeInTheDocument();
  });

  it('multiple type keeps both open', async () => {
    const user = userEvent.setup();
    renderAccordion('multiple');

    await user.click(screen.getByText('Section A'));
    await user.click(screen.getByText('Section B'));

    expect(screen.getByText('Content A')).toBeInTheDocument();
    expect(screen.getByText('Content B')).toBeInTheDocument();
  });

  it('triggers have correct aria-expanded', async () => {
    const user = userEvent.setup();
    renderAccordion();

    const triggerA = screen.getByRole('button', { name: /Section A/ });
    expect(triggerA).toHaveAttribute('aria-expanded', 'false');

    await user.click(triggerA);
    expect(triggerA).toHaveAttribute('aria-expanded', 'true');
  });
});