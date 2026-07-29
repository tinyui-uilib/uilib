import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import { Text, Heading } from './Text';

type TextProps    = ComponentProps<typeof Text>;
type HeadingProps = ComponentProps<typeof Heading>;

// ─── Text meta ────────────────────────────────────────────────────────────────

const meta: Meta<typeof Text> = {
  title:     'Components/Text',
  component: Text,
  tags:      ['autodocs'],

  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Typography primitive for body text.',
          'Renders as any semantic inline or block element via `as` prop.',
          'All visual properties come from design tokens —',
          'no raw values, no hardcoded colors.',
        ].join(' '),
      },
    },
  },

  argTypes: {
    as: {
      control: 'select',
      options: ['p', 'span', 'div', 'strong', 'em'] satisfies TextProps['as'][],
      description: 'HTML element to render',
      table: { defaultValue: { summary: 'p' } },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] satisfies TextProps['size'][],
      table: { defaultValue: { summary: 'md' } },
    },
    weight: {
      control: 'select',
      options: ['regular', 'medium', 'semibold', 'bold'] satisfies TextProps['weight'][],
      table: { defaultValue: { summary: 'regular' } },
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'disabled', 'onAccent'] satisfies TextProps['color'][],
      table: { defaultValue: { summary: 'primary' } },
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right'] satisfies TextProps['align'][],
      table: { defaultValue: { summary: 'left' } },
    },
    truncate: { control: 'boolean' },
    italic:   { control: 'boolean' },
    mono:     { control: 'boolean' },
  },

  args: {
    children: 'The quick brown fox jumps over the lazy dog.',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {};

// ─── All sizes ────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  name: 'All sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const).map((size) => (
        <Text key={size} size={size}>
          {size} — The quick brown fox jumps over the lazy dog.
        </Text>
      ))}
    </div>
  ),
};

// ─── All weights ──────────────────────────────────────────────────────────────

export const Weights: Story = {
  name: 'All weights',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {(['regular', 'medium', 'semibold', 'bold'] as const).map((weight) => (
        <Text key={weight} weight={weight}>
          {weight} — The quick brown fox jumps over the lazy dog.
        </Text>
      ))}
    </div>
  ),
};

// ─── All colors ───────────────────────────────────────────────────────────────

export const Colors: Story = {
  name: 'All colors',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Text color="primary">primary — Main body text</Text>
      <Text color="secondary">secondary — Captions, meta, labels</Text>
      <Text color="disabled">disabled — Placeholder, inactive</Text>
      <div style={{ background: 'var(--color-accent-default)', padding: '8px', borderRadius: '6px' }}>
        <Text color="onAccent">onAccent — Text on colored backgrounds</Text>
      </div>
    </div>
  ),
};

// ─── Truncation ───────────────────────────────────────────────────────────────

export const Truncate: Story = {
  name: 'Truncation',
  parameters: {
    docs: {
      description: {
        story:
          'Overflow is clipped with an ellipsis. ' +
          'The parent must have a constrained width — ' +
          'truncation has no effect on an unconstrained element.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '320px' }}>
      <Text truncate>
        This is a very long piece of text that will be truncated with an ellipsis when it overflows its container.
      </Text>
      <Text color="secondary" size="sm">
        ↑ Truncated at 320px. The full string is still in the DOM.
      </Text>
    </div>
  ),
};

// ─── Semantic elements ────────────────────────────────────────────────────────

export const SemanticElements: Story = {
  name: 'Semantic elements via as',
  parameters: {
    docs: {
      description: {
        story:
          'The `as` prop controls HTML semantics independently of visual style. ' +
          'All four render identically — the difference is what screen readers announce.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Text as="p">      as="p"      — paragraph (default)</Text>
      <Text as="span">   as="span"   — inline</Text>
      <Text as="strong"> as="strong" — strong importance</Text>
      <Text as="em">     as="em"     — stress emphasis</Text>
    </div>
  ),
};

// ─── Heading stories ──────────────────────────────────────────────────────────

export const AllHeadingLevels: Story = {
  name: 'Heading — all levels',
  parameters: {
    docs: {
      description: {
        story:
          '`level` drives the HTML element and default size/weight. ' +
          '`size` can override the visual without changing the semantic level.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {([1, 2, 3, 4, 5, 6] as const).map((level) => (
        <Heading key={level} level={level}>
          h{level} — Section heading level {level}
        </Heading>
      ))}
    </div>
  ),
};

export const HeadingVsVisual: Story = {
  name: 'Heading — semantic vs visual',
  parameters: {
    docs: {
      description: {
        story:
          'Both are `h2` semantically. The right one has `size="sm"`. ' +
          'Document outline is identical — visual hierarchy differs. ' +
          'This is the correct pattern for compact sidebars or cards.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}>
      <div>
        <Text size="xs" color="secondary" style={{ marginBottom: '8px' }}>Default size</Text>
        <Heading level={2}>Section title</Heading>
      </div>
      <div>
        <Text size="xs" color="secondary" style={{ marginBottom: '8px' }}>size="sm" override</Text>
        <Heading level={2} size="sm">Section title</Heading>
      </div>
    </div>
  ),
};

export const ProseExample: Story = {
  name: 'Prose composition',
  parameters: {
    docs: {
      description: {
        story: 'Real-world composition of Text and Heading together.',
      },
    },
  },
  render: () => (
    <div style={{ maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Heading level={1}>Getting started</Heading>
      <Text color="secondary">
        Install the package and wrap your app with the theme provider.
      </Text>
      <Heading level={2}>Installation</Heading>
      <Text>
        Add <Text as="strong">@uilib/ui</Text> to your project dependencies.
        Make sure you have <Text as="em">React 18 or later</Text> installed.
      </Text>
      <Text mono size="sm" color="secondary">
        pnpm add @uilib/ui @uilib/tokens
      </Text>
    </div>
  ),
};