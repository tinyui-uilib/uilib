import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { fn } from '@storybook/test';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title:      'Components/Switch',
  component:  Switch,
  tags:       ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
  args: { onCheckedChange: fn() },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: { label: 'Dark mode', description: 'Switch between light and dark theme' },
};

export const AllSizes: Story = {
  name: 'All sizes',
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Switch {...args} size="sm" label="Small" />
      <Switch {...args} size="md" label="Medium" />
      <Switch {...args} size="lg" label="Large" />
    </div>
  ),
};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [checked, setChecked] = useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <Switch
          checked={checked}
          onCheckedChange={setChecked}
          label="Notifications"
          description="Receive email and push notifications"
        />
        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>
          Notifications: <strong>{checked ? 'on' : 'off'}</strong>
        </p>
      </div>
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true, label: 'Disabled switch' },
};

export const SettingsPanel: Story = {
  name: 'Settings panel composition',
  render: () => (
    <div style={{ width: '360px', display: 'flex', flexDirection: 'column', gap: '0' }}>
      {[
        { label: 'Email notifications',   description: 'Receive updates via email',         defaultChecked: true  },
        { label: 'Push notifications',    description: 'Receive push alerts on your device', defaultChecked: false },
        { label: 'Marketing emails',      description: 'Offers, tips, and product news',     defaultChecked: false },
        { label: 'Security alerts',       description: 'Login and account activity alerts',  defaultChecked: true  },
      ].map(({ label, description, defaultChecked }) => (
        <div
          key={label}
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            padding:        '12px 0',
            borderBottom:   '1px solid var(--color-border-default)',
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{label}</p>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)' }}>{description}</p>
          </div>
          <Switch defaultChecked={defaultChecked} />
        </div>
      ))}
    </div>
  ),
};