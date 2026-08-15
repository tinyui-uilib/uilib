# @tinyui-uilib

A production-grade React component library built as a Turborepo monorepo. Zero runtime styling via Vanilla Extract, accessible headless primitives via Radix UI, and a type-safe design token system with 3-theme support.

[![CI](https://github.com/tinyui-uilib/uilib/actions/workflows/ci.yml/badge.svg)](https://github.com/tinyui-uilib/uilib/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@tinyui-uilib/ui)](https://www.npmjs.com/package/@tinyui-uilib/ui)
[![Storybook](https://img.shields.io/badge/storybook-live-ff4785)](https://main--your-chromatic-url.chromatic.com)

---

## Packages

| Package | Description | Version |
|---|---|---|
| [`@tinyui-uilib/ui`](./packages/ui) | React component library | [![npm](https://img.shields.io/npm/v/@tinyui-uilib/ui)](https://www.npmjs.com/package/@tinyui-uilib/ui) |
| [`@tinyui-uilib/tokens`](./packages/tokens) | Design token system | [![npm](https://img.shields.io/npm/v/@tinyui-uilib/tokens)](https://www.npmjs.com/package/@tinyui-uilib/tokens) |

---

## Features

- **Zero runtime styling** — Vanilla Extract extracts all CSS at build time. No style injection, no runtime cost.
- **Type-safe tokens** — `createThemeContract` enforces token completeness at compile time. Missing tokens are build errors.
- **3 themes** — Default, Dark, and Brand themes share an identical token contract. Components need zero changes to support all three.
- **SSR safe** — Cookie-based theme class on `<html>` before first paint. No flash of unstyled content.
- **Accessible** — Built on Radix UI primitives. Focus management, keyboard navigation, and ARIA attributes handled correctly.
- **Tree-shakable** — `preserveModules: true` in Rollup. Importing `Button` never loads `Input`.
- **Dual ESM/CJS** — Works in Vite, Next.js, Webpack, and any modern bundler.

---

## Components

| Component | Radix Primitive | Key Pattern |
|---|---|---|
| `Button` | `@radix-ui/react-slot` | `asChild`, `forwardRef`, `aria-busy` |
| `Input` | — | Compound components, `useId`, `aria-describedby` |
| `Text` | — | Polymorphic `as` prop |
| `Heading` | — | Semantic level vs visual size |
| `Select` | `@radix-ui/react-select` | Grouped options, portal |
| `Avatar` | `@radix-ui/react-avatar` | Image fallback, status indicator |
| `Toast` | `@radix-ui/react-toast` | Imperative `useToast()` API |
| `Dialog` | `@radix-ui/react-dialog` | Focus trap, `Simple` + compound |
| `Badge` | — | Pure VE recipe |
| `Switch` | `@radix-ui/react-switch` | Label wiring, `aria-checked` |
| `Checkbox` | `@radix-ui/react-checkbox` | Indeterminate state |
| `Tabs` | `@radix-ui/react-tabs` | Roving tabindex, line + pill variants |
| `Tooltip` | `@radix-ui/react-tooltip` | Hover delay, portal |
| `Accordion` | `@radix-ui/react-accordion` | CSS height animation |
| `Popover` | `@radix-ui/react-popover` | Interactive content |

---

## Installation

```bash
pnpm add @tinyui-uilib/ui @tinyui-uilib/tokens
```

Install required peer dependencies:

```bash
pnpm add @vanilla-extract/css @vanilla-extract/recipes react react-dom
```

Install Radix primitives for the components you use:

```bash
pnpm add @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-select
# ... add others as needed
```

---

## Setup

### Next.js

**`next.config.ts`:**

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@tinyui-uilib/ui', '@tinyui-uilib/tokens'],
};

export default nextConfig;
```

**`app/layout.tsx`:**

```tsx
import { defaultTheme } from '@tinyui-uilib/tokens';
import { ToastProvider } from '@tinyui-uilib/ui';
import { cookies } from 'next/headers';
import { getThemeClass, type Theme } from '@tinyui-uilib/ui';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const savedTheme = (cookieStore.get('tinyui-theme')?.value ?? 'default') as Theme;

  return (
    <html lang="en" className={getThemeClass(savedTheme)}>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
```

### Vite

**`vite.config.ts`:**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
});
```

**`main.tsx`:**

```tsx
import { defaultTheme } from '@tinyui-uilib/tokens';
import { ToastProvider } from '@tinyui-uilib/ui';

// Apply theme class to root element
document.documentElement.classList.add(defaultTheme);

function App() {
  return (
    <ToastProvider>
      <YourApp />
    </ToastProvider>
  );
}
```

---

## Usage

### Button

```tsx
import { Button } from '@tinyui-uilib/ui';

// Basic
<Button>Click me</Button>

// Intents
<Button intent="primary">Primary</Button>
<Button intent="secondary">Secondary</Button>
<Button intent="ghost">Ghost</Button>
<Button intent="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Loading state — sets aria-busy, shows spinner
<Button loading>Saving...</Button>

// Renders as <a> with full button styling
<Button asChild intent="secondary">
  <a href="/docs">Read docs</a>
</Button>
```

### Input

```tsx
import { Input } from '@tinyui-uilib/ui';

// IDs are generated automatically via React.useId()
// aria-describedby, aria-invalid, aria-required wired automatically
<Input.Root required invalid={!!errors.email}>
  <Input.Label>Email address</Input.Label>
  <Input.Field
    type="email"
    value={value}
    onChange={(e) => setValue(e.target.value)}
  />
  <Input.Helper>We'll never share your email.</Input.Helper>
  <Input.Error>{errors.email}</Input.Error>
</Input.Root>
```

### Dialog

```tsx
import { Dialog, Button } from '@tinyui-uilib/ui';

// Simple API
<Dialog.Simple
  trigger={<Button intent="destructive">Delete</Button>}
  title="Confirm deletion"
  description="This cannot be undone."
  actions={
    <>
      <Dialog.Close>
        <Button intent="secondary">Cancel</Button>
      </Dialog.Close>
      <Button intent="destructive" onClick={handleDelete}>
        Delete
      </Button>
    </>
  }
/>

// Full control
<Dialog.Root size="lg">
  <Dialog.Trigger>
    <Button>Open settings</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Settings</Dialog.Title>
    </Dialog.Header>
    <Dialog.Body>
      {/* any content */}
    </Dialog.Body>
    <Dialog.Footer>
      <Dialog.Close>
        <Button>Save</Button>
      </Dialog.Close>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
```

### Toast

```tsx
import { useToast, Button } from '@tinyui-uilib/ui';

function SaveButton() {
  const { show } = useToast();

  return (
    <Button
      onClick={async () => {
        await save();
        show({
          title: 'Changes saved',
          variant: 'success',
          action: { label: 'Undo', onClick: handleUndo },
        });
      }}
    >
      Save
    </Button>
  );
}
```

### Theming

```tsx
import { ThemeProvider, useTheme } from '@tinyui-uilib/ui';

// Wrap your app
<ThemeProvider defaultTheme="default">
  <App />
</ThemeProvider>

// Switch themes anywhere
function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      <option value="default">Default</option>
      <option value="dark">Dark</option>
      <option value="brand">Brand</option>
    </select>
  );
}
```

---

## Design Tokens

Tokens are defined in `@tinyui-uilib/tokens` and consumed by components via Vanilla Extract CSS custom properties. You can use them in your own styles:

```ts
import { vars } from '@tinyui-uilib/tokens';
import { style } from '@vanilla-extract/css';

export const card = style({
  backgroundColor: vars.color.surface.raised,
  borderRadius:    vars.radii.lg,
  padding:         vars.space['4'],
  boxShadow:       vars.shadow.md,
  border:          `1px solid ${vars.color.border.default}`,
});
```

### Token categories

| Category | Tokens |
|---|---|
| `color.surface` | `default`, `raised`, `overlay`, `sunken` |
| `color.text` | `primary`, `secondary`, `disabled`, `inverse`, `onAccent` |
| `color.border` | `default`, `strong`, `focus` |
| `color.accent` | `default`, `hover`, `active`, `subtle` |
| `color.destructive` | `default`, `hover`, `subtle` |
| `color.success` | `default`, `subtle` |
| `color.warning` | `default`, `subtle` |
| `space` | `1`–`16` (4px–64px scale) |
| `radii` | `none`, `sm`, `md`, `lg`, `xl`, `full` |
| `typography` | `fontFamily`, `fontSize`, `fontWeight`, `lineHeight` |
| `shadow` | `none`, `sm`, `md`, `lg` |
| `duration` | `instant`, `fast`, `normal`, `slow` |
| `easing` | `standard`, `decelerate`, `accelerate`, `spring` |
| `zIndex` | `dropdown`, `sticky`, `overlay`, `modal`, `popover`, `tooltip`, `toast` |

---

## Storybook

Every component has full Storybook documentation with:
- Interactive controls for all props
- `play()` functions that run automated interaction tests
- Axe accessibility audit on every story
- Theme toolbar to preview all 3 themes

**[View Storybook →](https://main--your-chromatic-url.chromatic.com)**

---

## Local development

```bash
# Clone the repo
git clone https://github.com/tinyui-uilib/uilib.git
cd uilib

# Install dependencies
pnpm install

# Build tokens first (required before anything else)
pnpm --filter @tinyui-uilib/tokens build

# Start Storybook
pnpm --filter @tinyui-uilib/docs storybook

# Run tests
pnpm test

# Build all packages
pnpm build
```

---

## Browser support

| Browser | Version |
|---|---|
| Chrome | Last 2 versions |
| Firefox | Last 2 versions |
| Safari | Last 2 versions |
| Edge | Last 2 versions |

---

## License

MIT
