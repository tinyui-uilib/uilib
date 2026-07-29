import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Text, Heading } from './Text';

// ─── Text ─────────────────────────────────────────────────────────────────────

describe('Text', () => {

  describe('element rendering', () => {
    it('renders as <p> by default', () => {
      const { container } = render(<Text>Hello</Text>);
      expect(container.firstChild?.nodeName).toBe('P');
    });

    it('renders as <span> when as="span"', () => {
      const { container } = render(<Text as="span">Hello</Text>);
      expect(container.firstChild?.nodeName).toBe('SPAN');
    });

    it('renders as <div> when as="div"', () => {
      const { container } = render(<Text as="div">Hello</Text>);
      expect(container.firstChild?.nodeName).toBe('DIV');
    });

    it('renders as <strong> when as="strong"', () => {
      const { container } = render(<Text as="strong">Hello</Text>);
      expect(container.firstChild?.nodeName).toBe('STRONG');
    });

    it('renders as <em> when as="em"', () => {
      const { container } = render(<Text as="em">Hello</Text>);
      expect(container.firstChild?.nodeName).toBe('EM');
    });

    it('renders children correctly', () => {
      render(<Text>Hello world</Text>);
      expect(screen.getByText('Hello world')).toBeInTheDocument();
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(Text.displayName).toBe('Text');
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to the underlying element', () => {
      const ref = { current: null as HTMLElement | null };
      render(<Text ref={ref}>Hello</Text>);
      expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
    });

    it('forwards ref to span when as="span"', () => {
      const ref = { current: null as HTMLElement | null };
      render(<Text as="span" ref={ref}>Hello</Text>);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });
  });

  describe('className passthrough', () => {
    it('merges custom className with recipe class', () => {
      const { container } = render(
        <Text className="custom-class">Hello</Text>,
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('HTML attribute passthrough', () => {
    it('passes through data attributes', () => {
      render(<Text data-testid="text-el">Hello</Text>);
      expect(screen.getByTestId('text-el')).toBeInTheDocument();
    });

    it('passes through id', () => {
      const { container } = render(<Text id="my-text">Hello</Text>);
      expect(container.firstChild).toHaveAttribute('id', 'my-text');
    });
  });

});

// ─── Heading ──────────────────────────────────────────────────────────────────

describe('Heading', () => {

  describe('element rendering by level', () => {
    it.each([1, 2, 3, 4, 5, 6] as const)(
      'renders as <h%i> for level=%i',
      (level) => {
        const { container } = render(
          <Heading level={level}>Title</Heading>,
        );
        expect(container.firstChild?.nodeName).toBe(`H${level}`);
      },
    );
  });

  describe('as prop overrides the element', () => {
    it('renders as h3 when level=1 and as="h3"', () => {
      const { container } = render(
        <Heading level={1} as="h3">Title</Heading>,
      );
      // Element is h3 but semantic level is still 1
      expect(container.firstChild?.nodeName).toBe('H3');
    });
  });

  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(Heading.displayName).toBe('Heading');
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to the heading element', () => {
      const ref = { current: null as HTMLHeadingElement | null };
      render(<Heading level={1} ref={ref}>Title</Heading>);
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
    });
  });

  describe('children', () => {
    it('renders children correctly', () => {
      render(<Heading level={2}>Section title</Heading>);
      expect(screen.getByText('Section title')).toBeInTheDocument();
    });
  });

  describe('HTML attributes', () => {
    it('passes through id', () => {
      const { container } = render(
        <Heading level={1} id="page-title">Title</Heading>,
      );
      expect(container.firstChild).toHaveAttribute('id', 'page-title');
    });

    it('passes through aria-label', () => {
      const { container } = render(
        <Heading level={1} aria-label="Page heading">Title</Heading>,
      );
      expect(container.firstChild).toHaveAttribute('aria-label', 'Page heading');
    });
  });

});