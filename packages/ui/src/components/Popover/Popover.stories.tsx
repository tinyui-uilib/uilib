import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Popover } from './Popover';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Switch } from '../Switch/Switch';

const meta: Meta = {
  title:      'Components/Popover',
  tags:       ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger>
        <Button>Open popover</Button>
      </Popover.Trigger>
      <Popover.Content style={{ width: '280px' }}>
        <Popover.Header title="Popover title" />
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-secondary)' }}>
          This is some popover content. It can contain any elements.
        </p>
      </Popover.Content>
    </Popover.Root>
  ),
};

export const AllSides: Story = {
  name: 'All sides',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', padding: '48px' }}>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Popover.Root key={side}>
          <Popover.Trigger>
            <Button intent="secondary" size="sm">{side}</Button>
          </Popover.Trigger>
          <Popover.Content side={side} style={{ width: '160px' }}>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              Opens on {side}
            </p>
          </Popover.Content>
        </Popover.Root>
      ))}
    </div>
  ),
};

export const WithForm: Story = {
  name: 'With form content',
  render: () => (
    <Popover.Root>
      <Popover.Trigger>
        <Button intent="secondary">Quick settings</Button>
      </Popover.Trigger>
      <Popover.Content style={{ width: '300px' }}>
        <Popover.Header title="Quick settings" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input.Root size="sm">
            <Input.Label>Display name</Input.Label>
            <Input.Field placeholder="Pradhumn" />
          </Input.Root>
          <Switch label="Dark mode" size="sm" />
          <Switch label="Compact view" size="sm" defaultChecked />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Popover.Close>
              <Button size="sm" intent="secondary">Cancel</Button>
            </Popover.Close>
            <Popover.Close>
              <Button size="sm">Save</Button>
            </Popover.Close>
          </div>
        </div>
      </Popover.Content>
    </Popover.Root>
  ),
};

export const Controlled: Story = {
  name: 'Controlled open state',
  render: function ControlledStory() {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger>
            <Button>{open ? 'Close popover' : 'Open popover'}</Button>
          </Popover.Trigger>
          <Popover.Content style={{ width: '220px' }}>
            <Popover.Header title="Controlled" showCloseButton={false} />
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              This popover is controlled externally.
            </p>
            <Button size="sm" fullWidth style={{ marginTop: '12px' }} onClick={() => setOpen(false)}>
              Close from inside
            </Button>
          </Popover.Content>
        </Popover.Root>
        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
          Open: <strong>{String(open)}</strong>
        </p>
      </div>
    );
  },
};