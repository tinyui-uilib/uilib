import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { fn } from '@storybook/test';
import { Tabs } from './Tabs';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';

const meta: Meta = {
  title:      'Components/Tabs',
  tags:       ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const LineVariant: Story = {
  name: 'Line variant (default)',
  render: () => (
    <Tabs.Root defaultValue="overview">
      <Tabs.List>
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
        <Tabs.Trigger value="billing" disabled>Billing</Tabs.Trigger>
      </Tabs.List>
      <div style={{ paddingTop: '24px' }}>
        <Tabs.Content value="overview">
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Overview content</p>
        </Tabs.Content>
        <Tabs.Content value="analytics">
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Analytics content</p>
        </Tabs.Content>
        <Tabs.Content value="settings">
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Settings content</p>
        </Tabs.Content>
      </div>
    </Tabs.Root>
  ),
};

export const PillVariant: Story = {
  name: 'Pill variant',
  render: () => (
    <Tabs.Root defaultValue="month" variant="pill">
      <Tabs.List>
        <Tabs.Trigger value="day">Day</Tabs.Trigger>
        <Tabs.Trigger value="week">Week</Tabs.Trigger>
        <Tabs.Trigger value="month">Month</Tabs.Trigger>
        <Tabs.Trigger value="year">Year</Tabs.Trigger>
      </Tabs.List>
      <div style={{ paddingTop: '24px' }}>
        <Tabs.Content value="day"><p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Daily view</p></Tabs.Content>
        <Tabs.Content value="week"><p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Weekly view</p></Tabs.Content>
        <Tabs.Content value="month"><p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Monthly view</p></Tabs.Content>
        <Tabs.Content value="year"><p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Yearly view</p></Tabs.Content>
      </div>
    </Tabs.Root>
  ),
};

export const WithFormContent: Story = {
  name: 'With form content',
  render: () => (
    <div style={{ maxWidth: '480px' }}>
      <Tabs.Root defaultValue="profile">
        <Tabs.List>
          <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
          <Tabs.Trigger value="security">Security</Tabs.Trigger>
          <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
        </Tabs.List>
        <div style={{ paddingTop: '24px' }}>
          <Tabs.Content value="profile">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input.Root>
                <Input.Label>Display name</Input.Label>
                <Input.Field defaultValue="Pradhumn Sharma" />
              </Input.Root>
              <Input.Root>
                <Input.Label>Email</Input.Label>
                <Input.Field type="email" defaultValue="pradhumn@example.com" />
              </Input.Root>
              <Button style={{ alignSelf: 'flex-start' }}>Save changes</Button>
            </div>
          </Tabs.Content>
          <Tabs.Content value="security">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input.Root>
                <Input.Label>Current password</Input.Label>
                <Input.Field type="password" />
              </Input.Root>
              <Input.Root>
                <Input.Label>New password</Input.Label>
                <Input.Field type="password" />
              </Input.Root>
              <Button style={{ alignSelf: 'flex-start' }}>Update password</Button>
            </div>
          </Tabs.Content>
          <Tabs.Content value="notifications">
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
              Notification preferences coming soon.
            </p>
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  ),
};