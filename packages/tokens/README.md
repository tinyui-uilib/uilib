# @tinyui-uilib/tokens

Type-safe design token system for `@tinyui-uilib/ui`. 77 tokens across 3 themes — zero runtime, compile-time enforced.

[![npm version](https://img.shields.io/npm/v/@tinyui-uilib/tokens)](https://www.npmjs.com/package/@tinyui-uilib/tokens)

**[GitHub →](https://github.com/tinyui-uilib/uilib)**

---

## What it does

Defines a **token contract** — the shape of all design decisions in the system. Every theme must satisfy the full contract at compile time. Missing a token is a TypeScript error, not a visual bug in production.

```
77 tokens  ·  3 themes  ·  5.8 kB published  ·  1.3 kB gzipped CSS
```

---

## Installation

```bash
npm install @tinyui-uilib/tokens
```

**Peer dependency:**

```bash
npm install @vanilla-extract/css
```

---

## Themes

Three themes ship out of the box:

| Theme | Description |
| --- | --- |
| `defaultTheme` | Neutral light palette |
| `darkTheme` | Dark mode — same contract, inverted colors |
| `brandTheme` | Warm stone palette with violet accent |

All three share an identical token contract. Components need zero changes to support all themes.

---

## Usage

### Apply a theme

```tsx
import { defaultTheme, darkTheme, brandTheme } from '@tinyui-uilib/tokens';

// On the root element — CSS custom properties apply immediately
<html className={defaultTheme}>

// Switch themes without JavaScript re-render
document.documentElement.className = darkTheme;
```

### Use tokens in your own styles

```ts
import { vars } from '@tinyui-uilib/tokens';
import { style } from '@vanilla-extract/css';

export const card = style({
  backgroundColor: vars.color.surface.raised,
  border:          `1px solid ${vars.color.border.default}`,
  borderRadius:    vars.radii.lg,
  padding:         vars.space['4'],
  boxShadow:       vars.shadow.md,
  color:           vars.color.text.primary,
});

export const heading = style({
  fontFamily:  vars.typography.fontFamily.sans,
  fontSize:    vars.typography.fontSize['2xl'],
  fontWeight:  vars.typography.fontWeight.bold,
  lineHeight:  vars.typography.lineHeight.tight,
  color:       vars.color.text.primary,
});
```

### SSR-safe theming in Next.js

```tsx
// app/layout.tsx — Server Component
// Theme class applied before first paint — zero flash of unstyled content
import { cookies } from 'next/headers';
import { defaultTheme, darkTheme, brandTheme } from '@tinyui-uilib/tokens';

const themeMap = { default: defaultTheme, dark: darkTheme, brand: brandTheme };

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const saved = cookieStore.get('theme')?.value ?? 'default';
  const themeClass = themeMap[saved] ?? defaultTheme;

  return (
    <html lang="en" className={themeClass}>
      <body>{children}</body>
    </html>
  );
}
```

---

## Token reference

### Colors

```ts
vars.color.surface.default    // page background
vars.color.surface.raised     // cards, panels
vars.color.surface.overlay    // hover fills
vars.color.surface.sunken     // inputs, recessed

vars.color.text.primary       // body copy, headings
vars.color.text.secondary     // captions, meta
vars.color.text.disabled      // placeholder, inactive
vars.color.text.inverse       // text on dark backgrounds
vars.color.text.onAccent      // text on colored buttons

vars.color.border.default     // dividers, input borders
vars.color.border.strong      // emphasis borders
vars.color.border.focus       // keyboard focus ring

vars.color.accent.default     // primary interactive color
vars.color.accent.hover       // hover state
vars.color.accent.active      // pressed state
vars.color.accent.subtle      // light tint background

vars.color.destructive.default
vars.color.destructive.hover
vars.color.destructive.subtle

vars.color.success.default
vars.color.success.subtle

vars.color.warning.default
vars.color.warning.subtle
```

### Space

```ts
vars.space['1']   // 0.25rem  (4px)
vars.space['2']   // 0.5rem   (8px)
vars.space['3']   // 0.75rem  (12px)
vars.space['4']   // 1rem     (16px)
vars.space['5']   // 1.25rem  (20px)
vars.space['6']   // 1.5rem   (24px)
vars.space['8']   // 2rem     (32px)
vars.space['10']  // 2.5rem   (40px)
vars.space['12']  // 3rem     (48px)
vars.space['16']  // 4rem     (64px)
```

### Typography

```ts
vars.typography.fontFamily.sans
vars.typography.fontFamily.mono

vars.typography.fontSize.xs    // 0.75rem
vars.typography.fontSize.sm    // 0.875rem
vars.typography.fontSize.md    // 1rem
vars.typography.fontSize.lg    // 1.125rem
vars.typography.fontSize.xl    // 1.25rem
vars.typography.fontSize['2xl'] // 1.5rem
vars.typography.fontSize['3xl'] // 1.875rem

vars.typography.fontWeight.regular   // 400
vars.typography.fontWeight.medium    // 500
vars.typography.fontWeight.semibold  // 600
vars.typography.fontWeight.bold      // 700

vars.typography.lineHeight.none     // 1
vars.typography.lineHeight.tight    // 1.25
vars.typography.lineHeight.normal   // 1.5
vars.typography.lineHeight.relaxed  // 1.625
```

### Border radius

```ts
vars.radii.none  // 0px
vars.radii.sm    // 0.25rem
vars.radii.md    // 0.375rem
vars.radii.lg    // 0.5rem
vars.radii.xl    // 0.75rem
vars.radii.full  // 9999px
```

### Shadow

```ts
vars.shadow.none
vars.shadow.sm
vars.shadow.md
vars.shadow.lg
```

### Motion

```ts
vars.duration.instant  // 50ms
vars.duration.fast     // 100ms
vars.duration.normal   // 200ms
vars.duration.slow     // 300ms

vars.easing.standard   // cubic-bezier(0.4, 0, 0.2, 1)
vars.easing.decelerate // cubic-bezier(0, 0, 0.2, 1)
vars.easing.accelerate // cubic-bezier(0.4, 0, 1, 1)
vars.easing.spring     // cubic-bezier(0.34, 1.56, 0.64, 1)
```

### Z-index

```ts
vars.zIndex.dropdown  // 1000
vars.zIndex.sticky    // 1100
vars.zIndex.overlay   // 1200
vars.zIndex.modal     // 1300
vars.zIndex.popover   // 1400
vars.zIndex.tooltip   // 1500
vars.zIndex.toast     // 1600
```

---

## How it works

Vanilla Extract's `createThemeContract` defines the shape of all tokens as TypeScript nulls:

```ts
// contract.css.ts
export const vars = createThemeContract({
  color: {
    accent: {
      default: null,  // ← slot to be filled by each theme
      hover:   null,
    }
  }
});
```

Each theme fills every slot:

```ts
// themes/default.css.ts
export const defaultTheme = createTheme(vars, {
  color: {
    accent: {
      default: '#2563eb',
      hover:   '#1d4ed8',
    }
  }
});
```

If a theme is missing any token — TypeScript throws at build time. Not a visual bug discovered in production — a compile error.

At runtime, `createTheme` returns a CSS class name. Applying it to `<html>` sets the CSS custom properties. Every `vars.color.accent.default` in component styles resolves to `var(--token-name)` — a live CSS variable reference that responds to the active theme with zero JavaScript.

---

## Package stats

| | |
| --- | --- |
| Published size | 5.8 kB |
| Unpacked size | 20 kB |
| CSS output | 5.5 kB (1.3 kB gzipped) |
| Unique tokens | 77 |
| Themes | 3 (default, dark, brand) |
| Formats | ESM + CJS |

---

## License

MIT
