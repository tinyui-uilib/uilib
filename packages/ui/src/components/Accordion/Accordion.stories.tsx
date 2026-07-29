import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from './Accordion';

const meta: Meta = {
  title:      'Components/Accordion',
  tags:       ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const faqItems = [
  { value: 'q1', question: 'What is Vanilla Extract?', answer: 'Vanilla Extract is a zero-runtime CSS-in-TypeScript library. Styles are extracted to static CSS files at build time — no runtime style injection.' },
  { value: 'q2', question: 'Why use Radix UI primitives?', answer: 'Radix provides accessible headless components that handle focus management, keyboard navigation, and ARIA attributes correctly out of the box.' },
  { value: 'q3', question: 'What is a design token?', answer: 'A design token is a named value that represents a visual decision — like a color, spacing value, or font size. Tokens create a shared vocabulary between design and engineering.' },
  { value: 'q4', question: 'How does tree-shaking work?', answer: 'With preserveModules: true in Rollup, each source file becomes its own output file. Consumers only bundle the modules they import.' },
];

export const Single: Story = {
  name: 'Single (collapsible)',
  render: () => (
    <div style={{ maxWidth: '560px' }}>
      <Accordion.Root type="single" collapsible>
        {faqItems.map(({ value, question, answer }) => (
          <Accordion.Item key={value} value={value}>
            <Accordion.Trigger>{question}</Accordion.Trigger>
            <Accordion.Content>{answer}</Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  ),
};

export const Multiple: Story = {
  name: 'Multiple (all can be open)',
  parameters: {
    docs: {
      description: {
        story: 'type="multiple" allows any number of panels to be open simultaneously.',
      },
    },
  },
  render: () => (
    <div style={{ maxWidth: '560px' }}>
      <Accordion.Root type="multiple">
        {faqItems.map(({ value, question, answer }) => (
          <Accordion.Item key={value} value={value}>
            <Accordion.Trigger>{question}</Accordion.Trigger>
            <Accordion.Content>{answer}</Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  ),
};

export const DefaultOpen: Story = {
  name: 'Default open',
  render: () => (
    <div style={{ maxWidth: '560px' }}>
      <Accordion.Root type="single" defaultValue="q1" collapsible>
        {faqItems.map(({ value, question, answer }) => (
          <Accordion.Item key={value} value={value}>
            <Accordion.Trigger>{question}</Accordion.Trigger>
            <Accordion.Content>{answer}</Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  ),
};