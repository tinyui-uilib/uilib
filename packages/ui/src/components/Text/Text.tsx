import * as React from 'react';
import { typographyRecipe } from './Text.css';

// ─── Text ─────────────────────────────────────────────────────────────────────

// Finite union — not arbitrary React.ElementType.
// Every element here renders the same set of HTML attributes
// (HTMLAttributes<HTMLElement>) so a single interface works cleanly.
export type TextElement = 'p' | 'span' | 'div' | 'strong' | 'em';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * HTML element to render as. Defaults to 'p'.
   * Use 'span' for inline text, 'div' for block containers,
   * 'strong'/'em' for semantic emphasis.
   */
  as?:      TextElement;
  size?:    TextSize;
  weight?:  TextWeight;
  color?:   TextColor;
  align?:   TextAlign;
  /** Single-line overflow truncation. Parent must have constrained width. */
  truncate?: boolean;
  /** Italic style */
  italic?:   boolean;
  /** Switch to monospace font — for inline code in prose */
  mono?:     boolean;
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
  function Text(
    {
      as       = 'p',
      size,
      weight,
      color,
      align,
      truncate,
      italic,
      mono,
      className,
      children,
      ...props
    },
    ref,
  ) {
    // React.createElement is needed here because the element type
    // is dynamic. JSX <as> would be interpreted as a component name.
    // This is the correct pattern for dynamic HTML elements.
    return React.createElement(
      as,
      {
        ref,
        className: [
          typographyRecipe({ size, weight, color, align, truncate, italic, mono }),
          className,
        ]
          .filter(Boolean)
          .join(' '),
        ...props,
      },
      children,
    );
  },
);

Text.displayName = 'Text';

// ─── Heading ──────────────────────────────────────────────────────────────────

export type HeadingLevel   = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

/**
 * Maps semantic level to default visual size.
 * These can be overridden per-instance via the `size` prop.
 *
 * The separation is intentional:
 *   level → semantic role (what AT announces, document outline)
 *   size  → visual appearance (independent of semantic role)
 *
 * Example: an h1 that looks visually small is valid when it's the
 * only h1 on the page but lives in a compact sidebar widget.
 */
const LEVEL_TO_SIZE: Record<HeadingLevel, TextSize> = {
  1: '3xl',
  2: '2xl',
  3: 'xl',
  4: 'lg',
  5: 'md',
  6: 'sm',
} as const;

const LEVEL_TO_WEIGHT: Record<HeadingLevel, TextWeight> = {
  1: 'bold',
  2: 'bold',
  3: 'semibold',
  4: 'semibold',
  5: 'medium',
  6: 'medium',
} as const;

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * Semantic level — required. Drives the HTML element (h1-h6) and
   * sets the default size and weight. Cannot be omitted: a heading
   * without a level is an accessibility error.
   */
  level: HeadingLevel;
  /**
   * Override the rendered element. Use when visual and semantic
   * hierarchy diverge — e.g. an h2 that renders as h3 in a sidebar.
   * Use sparingly: mismatched levels confuse screen reader users.
   */
  as?:      HeadingElement;
  size?:    TextSize;
  weight?:  TextWeight;
  color?:   TextColor;
  align?:   TextAlign;
  truncate?: boolean;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  function Heading(
    {
      level,
      as,
      size,
      weight,
      color    = 'primary',
      align,
      truncate,
      className,
      children,
      ...props
    },
    ref,
  ) {
    // Default element matches the semantic level.
    // Consumer can override with `as` when visual and semantic must diverge.
    const element = as ?? (`h${level}` as HeadingElement);

    // Default size and weight come from the level map.
    // Consumer overrides take precedence.
    const resolvedSize   = size   ?? LEVEL_TO_SIZE[level];
    const resolvedWeight = weight ?? LEVEL_TO_WEIGHT[level];

    return React.createElement(
      element,
      {
        ref,
        className: [
          typographyRecipe({
            size:    resolvedSize,
            weight:  resolvedWeight,
            color,
            align,
            truncate,
          }),
          className,
        ]
          .filter(Boolean)
          .join(' '),
        ...props,
      },
      children,
    );
  },
);

Heading.displayName = 'Heading';

export type TextSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
export type TextWeight = "regular" | "medium" | "semibold" | "bold";
export type TextColor = "primary" | "secondary" | "disabled" | "onAccent";
export type TextAlign = "left" | "center" | "right";