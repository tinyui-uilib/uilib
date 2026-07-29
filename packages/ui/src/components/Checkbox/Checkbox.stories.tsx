import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { fn } from '@storybook/test';
import { Checkbox, CheckboxGroup } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title:      'Components/Checkbox',
  component:  Checkbox,
  tags:       ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size:     { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
  args: { onCheckedChange: fn() },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: { label: 'Accept terms and conditions', description: 'By checking this you agree to our ToS.' },
};

export const Indeterminate: Story = {
  args: { checked: 'indeterminate', label: 'Select all', onCheckedChange: fn() },
  parameters: {
    docs: {
      description: {
        story: '`checked="indeterminate"` — used when some but not all items in a group are selected. Radix sets `aria-checked="mixed"` automatically.',
      },
    },
  },
};

export const IndeterminateGroup: Story = {
  name: 'Indeterminate group (select all)',
  parameters: {
    docs: {
      description: {
        story: 'Header checkbox is `indeterminate` when some items are checked. Click it to check all; click again to uncheck all.',
      },
    },
  },
  render: function GroupStory() {
    const [items, setItems] = useState([
      { id: '1', label: 'React',      checked: true  },
      { id: '2', label: 'TypeScript', checked: false },
      { id: '3', label: 'Vanilla Extract', checked: true },
      { id: '4', label: 'Turborepo', checked: false  },
    ]);

    function onChange(id: string, checked: boolean) {
      setItems((prev) => prev.map((i) => i.id === id ? { ...i, checked } : i));
    }

    return (
      <CheckboxGroup label="Technologies" items={items} onChange={onChange} />
    );
  },
};

export const AllSizes: Story = {
  name: 'All sizes',
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Checkbox {...args} size="sm" label="Small" />
      <Checkbox {...args} size="md" label="Medium" />
      <Checkbox {...args} size="lg" label="Large" />
    </div>
  ),
};