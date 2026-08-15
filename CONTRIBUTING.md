# Contributing

This document covers how to develop in this repo — adding components, running tests, and creating releases.

---

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | >=22.0.0 | [nodejs.org](https://nodejs.org) |
| pnpm | >=10.0.0 | `corepack enable` |
| Git | any | [git-scm.com](https://git-scm.com) |

---

## Getting started

```bash
# Clone
git clone https://github.com/tinyui-uilib/uilib.git
cd uilib

# Install all workspace dependencies
pnpm install

# Build tokens first — everything depends on this
pnpm --filter @tinyui-uilib/tokens build

# Start Storybook
pnpm --filter @tinyui-uilib/docs storybook
```

Storybook opens at `http://localhost:6006`.

---

## Repository structure

```
uilib/
├── .changeset/          ← changeset files (auto-generated + config)
├── .github/
│   └── workflows/
│       ├── ci.yml       ← typecheck, test, build, Chromatic on every push
│       └── release.yml  ← version PR + npm publish on main
├── apps/
│   ├── docs/            ← Storybook app (@tinyui-uilib/docs)
│   │   └── .storybook/
│   │       ├── main.ts       ← Storybook config, VE plugin, story globs
│   │       └── preview.tsx   ← theme decorator, a11y config, toolbar
│   └── playground/      ← Next.js SSR testing app
├── packages/
│   ├── tokens/          ← @tinyui-uilib/tokens
│   │   ├── figma/
│   │   │   └── tokens.json  ← W3C token format, Figma source of truth
│   │   ├── scripts/
│   │   │   └── build-tokens.mjs  ← Style Dictionary transform
│   │   └── src/
│   │       ├── contract.css.ts   ← token SHAPE (nulls)
│   │       ├── themes/
│   │       │   ├── default.css.ts
│   │       │   ├── dark.css.ts
│   │       │   └── brand.css.ts
│   │       └── generated/        ← built from figma/tokens.json
│   └── ui/              ← @tinyui-uilib/ui
│       └── src/
│           ├── components/
│           │   └── Button/
│           │       ├── Button.css.ts    ← VE recipe
│           │       ├── Button.tsx       ← component
│           │       ├── Button.test.tsx  ← tests
│           │       ├── Button.stories.tsx ← stories
│           │       └── index.ts
│           ├── utils/
│           └── index.ts  ← public API barrel
└── tooling/
    └── tsconfig/        ← @tinyui-uilib/tsconfig (shared TS config)
```

---

## Development workflow

### Running tests

```bash
# All packages
pnpm test

# Watch mode during development
pnpm --filter @tinyui-uilib/ui test:watch

# Single component
pnpm --filter @tinyui-uilib/ui test -- Button
```

### Typechecking

```bash
# All packages
pnpm typecheck

# Single package
pnpm --filter @tinyui-uilib/ui typecheck
```

### Building

```bash
# Build everything (tokens first, then ui)
pnpm build

# Build only tokens
pnpm --filter @tinyui-uilib/tokens build

# Build only ui (tokens must be built first)
pnpm --filter @tinyui-uilib/ui build

# Rebuild tokens from figma/tokens.json
pnpm --filter @tinyui-uilib/tokens build:tokens
```

---

## Adding a new component

Follow this exact sequence. Each step has a clear output you can verify before moving on.

### Step 1 — Create the folder structure

```bash
mkdir -p packages/ui/src/components/MyComponent
touch packages/ui/src/components/MyComponent/MyComponent.css.ts
touch packages/ui/src/components/MyComponent/MyComponent.tsx
touch packages/ui/src/components/MyComponent/MyComponent.test.tsx
touch packages/ui/src/components/MyComponent/MyComponent.stories.tsx
touch packages/ui/src/components/MyComponent/index.ts
```

### Step 2 — Write `MyComponent.css.ts`

Use `recipe()` for components with variants. Use `style()` for components with no variants.

```ts
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';
import { vars } from '@tinyui-uilib/tokens';

export const myComponentRecipe = recipe({
  base: {
    // Base styles every instance gets
    fontFamily: vars.typography.fontFamily.sans,
  },

  variants: {
    size: {
      sm: { fontSize: vars.typography.fontSize.sm },
      md: { fontSize: vars.typography.fontSize.md },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});

// Export variant types for use in component props
export type MyComponentVariants = RecipeVariants<typeof myComponentRecipe>;
export type MyComponentSize = 'sm' | 'md';
```

**Rules:**
- Never use raw color/spacing values. Always use `vars.*`
- The `vars.*` reference compiles to `var(--css-custom-property)` which is theme-aware
- `prefers-reduced-motion` must be handled in `@media` for any transition or animation

### Step 3 — Write `MyComponent.tsx`

```tsx
'use client'; // Required for components using forwardRef, event handlers, or browser APIs

import * as React from 'react';
import { myComponentRecipe, type MyComponentSize } from './MyComponent.css';

export interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: MyComponentSize;
}

export const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  function MyComponent({ size, className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={[myComponentRecipe({ size }), className]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {children}
      </div>
    );
  },
);

MyComponent.displayName = 'MyComponent';
```

**Rules:**
- Always use `React.forwardRef` — consumers need the DOM ref for focus, measurement, animation
- Always set `displayName` — shows in React DevTools
- Always spread `...props` and merge `className` — consumers must be able to extend styles
- `'use client'` is required for any component using `forwardRef`, `useState`, `useEffect`, or event handlers

### Step 4 — Write `MyComponent.test.tsx`

Test behaviour, not implementation:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders children', () => {
    render(<MyComponent>Hello</MyComponent>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('forwards ref to the DOM element', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<MyComponent ref={ref}>Hello</MyComponent>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges custom className', () => {
    const { container } = render(
      <MyComponent className="custom">Hello</MyComponent>,
    );
    expect(container.firstChild).toHaveClass('custom');
  });

  it('has correct displayName', () => {
    expect(MyComponent.displayName).toBe('MyComponent');
  });
});
```

**Rules:**
- Never assert on class names — they're implementation details
- Test what users see and can do, and what screen readers receive
- Always test `forwardRef`, `displayName`, and prop passthrough
- Use `userEvent` not `fireEvent` — userEvent simulates real browser behaviour

### Step 5 — Write `MyComponent.stories.tsx`

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import { MyComponent } from './MyComponent';

type Props = ComponentProps<typeof MyComponent>;

const meta: Meta<typeof MyComponent> = {
  title:     'Components/MyComponent',
  component: MyComponent,
  tags:      ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'] satisfies Props['size'][],
    },
  },
  args: {
    children: 'MyComponent',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllSizes: Story = {
  name: 'All sizes',
  render: (args: Props) => (
    <div style={{ display: 'flex', gap: '12px' }}>
      <MyComponent {...args} size="sm">Small</MyComponent>
      <MyComponent {...args} size="md">Medium</MyComponent>
    </div>
  ),
};
```

**Rules:**
- Every story that tests interaction must have a `play()` function
- Use `within(document.body)` for Radix portals (dialogs, dropdowns, tooltips)
- Wrap Radix ARIA attribute assertions in `waitFor` — they're set asynchronously
- Use `satisfies Props['variant'][]` on options arrays to keep them type-safe

### Step 6 — Write `index.ts`

```ts
export { MyComponent } from './MyComponent';
export type { MyComponentProps, MyComponentSize } from './MyComponent';
```

### Step 7 — Add to the barrel export

Open `packages/ui/src/components/index.ts` and add:

```ts
export * from './MyComponent';
```

### Step 8 — Install any new Radix primitive

If the component uses a Radix primitive:

```bash
pnpm --filter @tinyui-uilib/ui add @radix-ui/react-my-primitive
```

Add to `peerDependencies` and `devDependencies` in `packages/ui/package.json`:

```json
"@radix-ui/react-my-primitive": "^1.0.0"
```

### Step 9 — Verify everything

```bash
# Tests pass
pnpm --filter @tinyui-uilib/ui test

# No type errors
pnpm --filter @tinyui-uilib/ui typecheck

# Builds cleanly
pnpm --filter @tinyui-uilib/ui build

# Appears in Storybook
pnpm --filter @tinyui-uilib/docs storybook
```

---

## Adding or changing design tokens

### To add a new token

**1. Add to the contract** (`packages/tokens/src/contract.css.ts`):

```ts
export const vars = createThemeContract({
  color: {
    // ... existing tokens
    newToken: null,  // ← add here
  },
});
```

**2. Add to all three themes** — `default.css.ts`, `dark.css.ts`, `brand.css.ts`:

```ts
export const defaultTheme = createTheme(vars, {
  color: {
    // ... existing values
    newToken: '#value',  // ← add matching value in each theme
  },
});
```

TypeScript will error on any theme that's missing the new token — that's intentional.

**3. Rebuild tokens:**

```bash
pnpm --filter @tinyui-uilib/tokens build
```

### To update Figma token values

1. Export from Figma using Tokens Studio plugin → `figma/tokens.json`
2. Run `pnpm --filter @tinyui-uilib/tokens build:tokens`
3. The generated CSS and TS in `src/generated/` updates automatically
4. Commit both `figma/tokens.json` and `src/generated/tokens.ts`

---

## Branching and PR flow

```bash
# Always work on a branch, never directly on main
git checkout -b feat/my-component

# Make your changes
# Run tests
pnpm test

# Add a changeset describing the change
pnpm changeset
# → Select changed packages
# → Choose patch/minor/major
# → Write a short description

# Commit everything including the changeset file
git add .
git commit -m "feat: add MyComponent"
git push origin feat/my-component
```

Open a PR on GitHub. CI must pass before merge.

---

## Changeset types

| Type | When to use |
|---|---|
| `patch` | Bug fixes, internal refactors, documentation |
| `minor` | New components, new props, new features (backwards compatible) |
| `major` | Breaking changes — renamed props, removed components, changed behaviour |

**Never commit directly to main.** The branch protection rules require CI to pass and a PR to be reviewed.

---

## Release process

After your PR merges to main:

1. The Release workflow detects the pending `.changeset/*.md` file
2. It opens a **"chore: version packages"** PR automatically
3. Review the version bumps and changelog entries
4. Merge the version PR
5. Release workflow publishes to npm

You don't manually run publish. Changesets handles it.

---

## Common issues

### "Cannot find module '@tinyui-uilib/tokens'"

Tokens haven't been built yet:

```bash
pnpm --filter @tinyui-uilib/tokens build
```

### "Generated tokens file missing"

Run the Style Dictionary transform:

```bash
pnpm --filter @tinyui-uilib/tokens build:tokens
```

### Tests fail with "ResizeObserver is not defined"

This mock is in `packages/ui/src/__tests__/setup.ts`. If you added a new test file, ensure `vitest.config.ts` has:

```ts
setupFiles: ['./src/__tests__/setup.ts'],
```

### Storybook can't find stories

The stories glob in `apps/docs/.storybook/main.ts` covers all `*.stories.tsx` files in `packages/ui/src/**`. If your story file is named differently it won't be picked up.

### VE styles not applying in Storybook

The VE plugin must be in `viteFinal` in `apps/docs/.storybook/main.ts`. The workspace alias must point to source, not `dist`:

```ts
'@tinyui-uilib/tokens': resolve(repoRoot, 'packages/tokens/src/index.ts'),
'@tinyui-uilib/ui':     resolve(repoRoot, 'packages/ui/src/index.ts'),
```

---

## Code style

- **No `any` types** — use `unknown` with a type guard if the shape is genuinely unknown
- **No raw color/spacing values in components** — everything through `vars.*`
- **`forwardRef` on every component** — even if you don't need the ref today
- **`displayName` on every forwardRef component** — required for React DevTools
- **Explicit return types on exported functions** — improves generated `.d.ts` quality
- **`aria-hidden="true"` on decorative icons** — every icon slot in every component
