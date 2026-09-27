# @tinyui-uilib/ui

Accessible React component library with zero-runtime styling and 3-theme support.

[![npm version](https://img.shields.io/npm/v/@tinyui-uilib/ui)](https://www.npmjs.com/package/@tinyui-uilib/ui)
[![npm downloads](https://img.shields.io/npm/dm/@tinyui-uilib/ui)](https://www.npmjs.com/package/@tinyui-uilib/ui)

**[Storybook →](https://6a7ee0765af0bda05ed327a4-ztyfuvsflh.chromatic.com)** · **[GitHub →](https://github.com/tinyui-uilib/uilib)**

---

## What's inside

15 components built on [Radix UI](https://www.radix-ui.com) primitives with [Vanilla Extract](https://vanilla-extract.style) styling:

`Button` · `Input` · `Text` · `Heading` · `Select` · `Avatar` · `Toast` · `Dialog` · `Badge` · `Switch` · `Checkbox` · `Tabs` · `Tooltip` · `Accordion` · `Popover`

---

## Installation

```bash
npm install @tinyui-uilib/ui @tinyui-uilib/tokens
```

**Peer dependencies:**

```bash
npm install @vanilla-extract/css @vanilla-extract/recipes react react-dom
```

**Radix primitives** — install only what you use:

```bash
npm install @radix-ui/react-slot        # Button (asChild)
npm install @radix-ui/react-dialog      # Dialog
npm install @radix-ui/react-select      # Select
npm install @radix-ui/react-checkbox    # Checkbox
npm install @radix-ui/react-switch      # Switch
npm install @radix-ui/react-tabs        # Tabs
npm install @radix-ui/react-toast       # Toast
npm install @radix-ui/react-tooltip     # Tooltip
npm install @radix-ui/react-accordion   # Accordion
npm install @radix-ui/react-popover     # Popover
npm install @radix-ui/react-avatar      # Avatar
```

---

## Setup

### Next.js (App Router)

**`next.config.ts`:**

```ts
const nextConfig = {
  transpilePackages: ['@tinyui-uilib/ui', '@tinyui-uilib/tokens'],
};

export default nextConfig;
```

**`app/layout.tsx`:**

```tsx
import { defaultTheme } from '@tinyui-uilib/tokens';
import { ToastProvider } from '@tinyui-uilib/ui';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={defaultTheme}>
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
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
});
```

**`main.tsx`:**

```tsx
import { defaultTheme } from '@tinyui-uilib/tokens';
import { ToastProvider } from '@tinyui-uilib/ui';

document.documentElement.classList.add(defaultTheme);

root.render(
  <ToastProvider>
    <App />
  </ToastProvider>
);
```

---

## Usage

### Button

```tsx
import { Button } from '@tinyui-uilib/ui';

// Intents
<Button intent="primary">Save</Button>
<Button intent="secondary">Cancel</Button>
<Button intent="ghost">Skip</Button>
<Button intent="destructive">Delete</Button>

// Sizes: xs | sm | md | lg | xl
<Button size="sm">Small</Button>

// Loading — sets aria-busy, shows spinner
<Button loading>Saving...</Button>

// Render as link with full button styling
<Button asChild intent="secondary">
  <a href="/docs">Read docs</a>
</Button>
```

### Input

```tsx
import { Input } from '@tinyui-uilib/ui';

// IDs, aria-describedby, aria-invalid wired automatically
<Input.Root invalid={!!error} required>
  <Input.Label>Email</Input.Label>
  <Input.Field type="email" value={value} onChange={...} />
  <Input.Helper>We'll never share your email.</Input.Helper>
  <Input.Error>{error}</Input.Error>
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
  size="sm"
  actions={
    <>
      <Dialog.Close><Button intent="secondary">Cancel</Button></Dialog.Close>
      <Button intent="destructive" onClick={handleDelete}>Delete</Button>
    </>
  }
/>

// Full compound API
<Dialog.Root>
  <Dialog.Trigger><Button>Open</Button></Dialog.Trigger>
  <Dialog.Content size="md">
    <Dialog.Header>
      <Dialog.Title>Settings</Dialog.Title>
    </Dialog.Header>
    <Dialog.Body>{/* content */}</Dialog.Body>
    <Dialog.Footer>
      <Dialog.Close><Button>Close</Button></Dialog.Close>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
```

### Toast

```tsx
import { useToast } from '@tinyui-uilib/ui';

function SaveButton() {
  const { show } = useToast();

  return (
    <Button onClick={() => show({
      title: 'Saved successfully',
      variant: 'success',
      action: { label: 'Undo', onClick: handleUndo },
    })}>
      Save
    </Button>
  );
}
```

### Select

```tsx
import { Select } from '@tinyui-uilib/ui';

<Select.Root onValueChange={setValue}>
  <Select.Trigger placeholder="Choose a framework..." />
  <Select.Content>
    <Select.Group>
      <Select.Label>React</Select.Label>
      <Select.Item value="next">Next.js</Select.Item>
      <Select.Item value="remix">Remix</Select.Item>
    </Select.Group>
    <Select.Separator />
    <Select.Group>
      <Select.Label>Vue</Select.Label>
      <Select.Item value="nuxt">Nuxt</Select.Item>
    </Select.Group>
  </Select.Content>
</Select.Root>
```

### Checkbox with indeterminate state

```tsx
import { Checkbox, CheckboxGroup } from '@tinyui-uilib/ui';

// Header is indeterminate when some items are checked
<CheckboxGroup
  label="Select all"
  items={items}
  onChange={handleChange}
/>
```

### Theming

```tsx
import { ThemeProvider, useTheme } from '@tinyui-uilib/ui';

<ThemeProvider defaultTheme="default">
  <App />
</ThemeProvider>

// Switch themes anywhere
const { theme, setTheme } = useTheme();
setTheme('dark');    // default | dark | brand
```

---

## Theming

All components reference design tokens — never hardcoded values. Switch themes by changing the CSS class on `<html>`:

```tsx
import { defaultTheme, darkTheme, brandTheme } from '@tinyui-uilib/tokens';

// Apply on the server (Next.js) — zero flash of unstyled content
<html className={defaultTheme}>

// Or switch client-side
document.documentElement.className = darkTheme;
```

---

## Custom styles with tokens

Use design tokens in your own styles:

```ts
import { vars } from '@tinyui-uilib/tokens';
import { style } from '@vanilla-extract/css';

export const card = style({
  backgroundColor: vars.color.surface.raised,
  borderRadius:    vars.radii.lg,
  padding:         vars.space['4'],
  boxShadow:       vars.shadow.md,
});
```

---

## Tree-shaking

Each component has its own output file. Importing `Button` only loads `Button` — not the other 14 components:

```
Button.mjs   →  2.1 kB  (760 bytes gzipped)
Full library →  41.5 kB JS
Tree-shaking savings: 95%
```

---

## Package stats

| | |
| --- | --- |
| Published size | 68 kB |
| Unpacked size | 417 kB |
| Components | 15 |
| Formats | ESM + CJS |
| TypeScript | Full declarations |
| React | 18 + 19 |

---

## License

MIT
