import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip, TooltipProvider } from './Tooltip';
import { Button } from '../Button/Button';
import { Badge } from '../Badge/Badge';

const meta: Meta = {
  title:      'Components/Tooltip',
  tags:       ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip content="This is a tooltip">
      <Button>Hover me</Button>
    </Tooltip>
  ),
};

export const AllSides: Story = {
  name: 'All sides',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', padding: '48px' }}>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side} content={`Tooltip on ${side}`} side={side}>
          <Button intent="secondary" size="sm">{side}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

export const OnVariousElements: Story = {
  name: 'On various elements',
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Tooltip content="Primary action">
        <Button>Button</Button>
      </Tooltip>
      <Tooltip content="A status badge">
        <Badge intent="success">Active</Badge>
      </Tooltip>
      <Tooltip content="Hover over text">
        <span style={{ textDecoration: 'underline dotted', cursor: 'help', fontSize: '14px' }}>
          What is this?
        </span>
      </Tooltip>
    </div>
  ),
};

export const NoArrow: Story = {
  name: 'Without arrow',
  render: () => (
    <Tooltip content="No arrow tooltip" showArrow={false}>
      <Button intent="secondary">Hover me</Button>
    </Tooltip>
  ),
};