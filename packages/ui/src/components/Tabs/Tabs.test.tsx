import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from './Tabs';

function renderTabs(defaultValue = 'tab1') {
  return render(
    <Tabs.Root defaultValue={defaultValue}>
      <Tabs.List>
        <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        <Tabs.Trigger value="tab3" disabled>Tab 3</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1"><p>Content 1</p></Tabs.Content>
      <Tabs.Content value="tab2"><p>Content 2</p></Tabs.Content>
      <Tabs.Content value="tab3"><p>Content 3</p></Tabs.Content>
    </Tabs.Root>,
  );
}

describe('Tabs', () => {
  it('renders all tab triggers', () => {
    renderTabs();
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab 3' })).toBeInTheDocument();
  });

  it('shows the default active tab content', () => {
    renderTabs('tab1');
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('active tab has aria-selected="true"', () => {
    renderTabs('tab1');
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true');
  });

  it('switches content on tab click', async () => {
    const user = userEvent.setup();
    renderTabs();

    await user.click(screen.getByRole('tab', { name: 'Tab 2' }));
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('disabled tab cannot be clicked', async () => {
    const user = userEvent.setup();
    renderTabs();

    await user.click(screen.getByRole('tab', { name: 'Tab 3' }));
    expect(screen.queryByText('Content 3')).not.toBeInTheDocument();
  });

  it('arrow keys navigate between tabs', async () => {
    const user = userEvent.setup();
    renderTabs('tab1');

    screen.getByRole('tab', { name: 'Tab 1' }).focus();
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveFocus();
  });

  it('tablist has correct role', () => {
    renderTabs();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('tabpanel has correct role', () => {
    renderTabs();
    expect(screen.getByRole('tabpanel')).toBeInTheDocument();
  });

  it('calls onValueChange when tab changes', async () => {
    const user          = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Tabs.Root defaultValue="tab1" onValueChange={onValueChange}>
        <Tabs.List>
          <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">Content 1</Tabs.Content>
        <Tabs.Content value="tab2">Content 2</Tabs.Content>
      </Tabs.Root>,
    );

    await user.click(screen.getByRole('tab', { name: 'Tab 2' }));
    expect(onValueChange).toHaveBeenCalledWith('tab2');
  });
});