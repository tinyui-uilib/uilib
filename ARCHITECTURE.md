# Architecture Decision Record

This document explains every major architectural decision in this codebase — what was chosen, why, and what alternatives were considered and rejected. Written for technical reviewers, contributors, and interview contexts.

---

## Table of contents

1. [Monorepo with Turborepo](#1-monorepo-with-turborepo)
2. [Vanilla Extract for styling](#2-vanilla-extract-for-styling)
3. [createThemeContract over createGlobalTheme](#3-createthemecontract-over-createglobaltheme)
4. [Radix UI for accessible primitives](#4-radix-ui-for-accessible-primitives)
5. [The asChild pattern over as prop](#5-the-aschild-pattern-over-as-prop)
6. [Tree-shaking with preserveModules](#6-tree-shaking-with-preservemodules)
7. [SSR theming without FOUC](#7-ssr-theming-without-fouc)
8. [Compound components over monolithic props](#8-compound-components-over-monolithic-props)
9. [CSS-only animations](#9-css-only-animations)
10. [Figma → code token pipeline](#10-figma--code-token-pipeline)
11. [Changesets for versioning](#11-changesets-for-versioning)
12. [Testing strategy](#12-testing-strategy)

---

## 1. Monorepo with Turborepo

**Decision:** Turborepo monorepo with pnpm workspaces.

**Structure:**

```
uilib/
├── packages/
│   ├── tokens/   → @tinyui-uilib/tokens
│   └── ui/       → @tinyui-uilib/ui
├── apps/
│   ├── docs/     → Storybook
│   └── playground/ → Next.js SSR testing
└── tooling/
    └── tsconfig/ → @tinyui-uilib/tsconfig
```

**Why monorepo:**
The library has three distinct concerns — design tokens, components, and documentation — that have different build pipelines and release cadences. A designer updating a color token should not trigger a rebuild of Storybook if components haven't changed. Monorepo gives you that separation while keeping everything in one git history.

**Why Turborepo specifically:**

`dependsOn: ["^build"]` enforces topological ordering. `@tinyui-uilib/ui` never builds before `@tinyui-uilib/tokens` finishes. Without this you get race conditions — components trying to import types from tokens that haven't been generated yet.

Remote caching means CI skips re-running builds whose inputs haven't changed. The `inputs` hash covers source files and `package.json` — a change to Storybook config doesn't invalidate the component build cache.

**Why pnpm over npm/yarn:**
pnpm's strict hoisting prevents phantom dependency bugs — a package can only import what it explicitly declares in `package.json`. `workspace:*` protocol ensures internal packages always resolve to the local version during development, never a stale published copy.

**Alternatives considered:**
- **Single package** — rejected because it conflates token management (design-driven) with component implementation (engineering-driven)
- **Nx** — more opinionated, heavier config, overkill for this scope
- **Lerna** — largely superseded by Turborepo for build orchestration

---

## 2. Vanilla Extract for styling

**Decision:** Vanilla Extract with the `recipe()` API.

**Why zero-runtime:**
CSS-in-JS libraries that inject styles at runtime (Emotion, styled-components) have two problems at scale:

1. Style injection during SSR requires careful synchronization to prevent hydration mismatches
2. Runtime style computation happens on every render, even when nothing changed

VE extracts all styles to static `.css` files at build time. At runtime, calling `buttonRecipe({ intent: 'primary', size: 'md' })` is a pure string lookup — no computation, no DOM manipulation.

**Why `recipe()` over multiple `style()` calls:**
`recipe()` co-locates all variant logic. Without it you end up with:

```ts
// Without recipe — fragmented and hard to maintain
const buttonBase = style({ ... });
const buttonPrimary = style({ ... });
const buttonSecondary = style({ ... });
const buttonSm = style({ ... });

// Manual assembly — error-prone
function getButtonClass(intent, size) {
  return [buttonBase, intent === 'primary' ? buttonPrimary : buttonSecondary, ...].join(' ');
}
```

With `recipe()`, variant logic is first-class and the variant types are automatically inferred by TypeScript.

**Why VE over Tailwind:**

| | Tailwind | Vanilla Extract |
|---|---|---|
| Type safety | None — typos produce no style | Full — invalid tokens are compile errors |
| Design tokens | `tailwind.config.js` — no autocomplete | TypeScript — full IDE support |
| Resume signal | Table stakes | Differentiator |
| Bundle size | Medium (purged) | Smallest (build-time extraction) |

**Why VE over CSS Modules:**
CSS Modules has no concept of variants, no TypeScript token contract, and no `compoundVariants`. Managing a button with 5 intents × 5 sizes in CSS Modules means 25 class combinations assembled manually.

**Alternatives considered:**
- **Tailwind CSS** — rejected because class names aren't type-safe and design tokens live in a config file, not TypeScript
- **CSS Modules** — rejected because there's no variant system and no compile-time token enforcement
- **Emotion/styled-components** — rejected because of runtime overhead and SSR complexity

---

## 3. `createThemeContract` over `createGlobalTheme`

**Decision:** `createThemeContract` defines the token shape; `createTheme` fills it per-theme.

**The distinction:**

```ts
// createGlobalTheme — defines values imperatively
// No enforcement that dark/brand themes have the same tokens
createGlobalTheme(':root', { color: { primary: '#2563eb' } });

// createThemeContract — defines the SHAPE first
// Every theme must satisfy the full contract at compile time
const vars = createThemeContract({ color: { primary: null } });

// TypeScript error if any token is missing
const darkTheme = createTheme(vars, { color: { primary: '#3b82f6' } });
```

**Why this matters:**
If `dark.css.ts` doesn't define `color.accent.hover`, in most systems that's a silent bug — the hover state becomes invisible in dark mode and nobody notices until a user reports it.

With `createThemeContract`, TypeScript sees the missing field and **refuses to compile**. The error happens at development time, not in production.

**Why every theme spells out the full contract explicitly:**
You might think the right pattern is spreading the default theme and overriding values:

```ts
// Looks reasonable — but breaks type safety
const darkTheme = createTheme(vars, {
  ...defaultThemeValues,
  color: { ...defaultThemeValues.color, primary: '#3b82f6' },
});
```

If you spread and override, TypeScript can't catch a missing token — the spread fills it silently with the default value. Explicit contracts mean a forgotten token is a red squiggle, not a production bug at 2am.

---

## 4. Radix UI for accessible primitives

**Decision:** Radix UI Primitives as peer dependencies.

**Why headless:**
Radix provides accessibility behaviour (focus management, ARIA attributes, keyboard navigation) without any styling opinions. This library owns the visual layer entirely. Radix owns the interaction model.

What Radix handles that is genuinely hard to get right:
- Focus trap in dialogs — Tab cycles only within the dialog
- Roving tabindex in tabs — only one tab in tab order at a time, arrow keys navigate
- Portal rendering — dropdown escapes `overflow: hidden` parents
- Scroll lock — page doesn't scroll when a modal is open
- `aria-modal`, `aria-expanded`, `aria-haspopup` — set correctly and automatically

**Why peer deps, not direct deps:**
If Radix were a direct dependency, consumers who already have React and Radix in their app would ship duplicate copies. Two copies of React in one app causes the "hooks can only be called inside a function component" error — one of the harder bugs to diagnose.

**Not using Floating UI directly:**
Radix uses Floating UI internally for positioning. Installing it separately would create version conflicts. All positioning is handled through Radix's `sideOffset` and `align` props.

**Alternatives considered:**
- **React Aria (Adobe)** — more granular but requires more wiring
- **Headless UI (Tailwind)** — Tailwind-specific, less composable
- **Building from scratch** — weeks of work that experts still get wrong regularly

---

## 5. The `asChild` pattern over `as` prop

**Decision:** Radix `Slot` for polymorphism instead of a generic `as` prop.

**The problem with `as` prop:**

```tsx
// The as prop requires complex generic types
type PolymorphicComponentProps<T extends React.ElementType, P = {}> =
  P & { as?: T } & Omit<React.ComponentPropsWithoutRef<T>, keyof P | 'as'>;

// forwardRef with generics breaks TypeScript inference
const Button = React.forwardRef(...) // requires a cast that bypasses type checking
```

**The `asChild` approach:**

```tsx
// Merges button props onto the child via Radix Slot
<Button asChild>
  <a href="/home">Go home</a>
</Button>
// Renders: <a href="/home" class="button-styles...">Go home</a>
// Element is <a>, not <button>. Correct semantics preserved.
```

Slot merges all props (className, onClick, disabled, etc.) onto the child element. No generics, no type casts, correct HTML semantics, refs work correctly.

**Why this is better for a library:**
The child element owner controls what it is. A consumer using `asChild` with a router's `<Link>` component gets correct link semantics with button styling — and TypeScript understands both sets of props correctly.

---

## 6. Tree-shaking with `preserveModules`

**Decision:** `preserveModules: true` in Rollup output config.

**What this does:**
Without `preserveModules`, Rollup bundles everything into a single file:

```
dist/index.mjs  ← contains Button + Input + Dialog + everything
```

A consumer importing only `Button` receives the entire library and must eliminate the rest via tree-shaking — which only works reliably when every re-export is side-effect free.

With `preserveModules: true`, each source file becomes its own output file:

```
dist/components/Button/Button.mjs    ← just Button
dist/components/Input/Input.mjs      ← just Input
dist/components/Dialog/Dialog.mjs    ← just Dialog
```

Import `Button`, only `Button.mjs` loads. No bundler heuristics required.

**`sideEffects: false` is required alongside this:**
This field in `package.json` tells bundlers they can safely remove any module that isn't imported. Without it, bundlers assume any module might do something on import (like inject global CSS) and must include it even if nobody imports it.

**Dual ESM/CJS output:**
ESM (`.mjs`) for modern bundlers — Vite, Next.js, Rollup. CJS (`.cjs`) for older environments and Jest. Both are generated from the same source.

---

## 7. SSR theming without FOUC

**Decision:** Cookie-based theme class on `<html>`, read server-side.

**The FOUC problem:**
Flash of Unstyled Content happens when:

1. Server sends HTML with no theme class on `<html>`
2. Browser renders it with default styles
3. JavaScript loads, reads `localStorage`, applies theme class
4. Styles correct themselves — user sees a flash

**The solution:**

```tsx
// app/layout.tsx — Server Component
// Runs on the server, before a single byte is sent to the browser
const cookieStore = await cookies();
const savedTheme = cookieStore.get('tinyui-theme')?.value ?? 'default';

return (
  <html className={getThemeClass(savedTheme)}>
    <body>{children}</body>
  </html>
);
```

The theme class is on `<html>` in the first byte of HTML. CSS custom properties defined by that class resolve immediately. No JavaScript required for the initial themed render.

**Why cookies over localStorage:**
`localStorage` is only accessible client-side — you can't read it in a Server Component. Cookies travel with every HTTP request and are available server-side. When a user switches theme, we save to a cookie; the server reads it on the next request.

**VE's role:**
Because VE extracts styles at build time, the CSS is already in a `<link>` tag in the `<head>`. The theme class on `<html>` immediately selects the correct CSS custom properties. No style injection, no flash.

**Alternatives considered:**
- **`suppressHydrationWarning`** — masks the mismatch, doesn't solve it. The flash still occurs.
- **`prefers-color-scheme` media query** — handles light/dark but not custom brand themes
- **Client-side only theming** — always flashes on first load

---

## 8. Compound components over monolithic props

**Decision:** Compound component pattern for `Input`, `Dialog`, `Select`, `Accordion`, `Tabs`.

**The problem with monolithic props:**

```tsx
// One component with 15 props — hard to extend, hard to type
<Input
  label="Email"
  labelClassName="..."
  helper="Enter your email"
  helperClassName="..."
  error="Invalid email"
  errorClassName="..."
  leftIcon={<MailIcon />}
  rightIcon={<ClearIcon />}
  invalid={true}
  required={true}
  size="md"
  ...
/>
```

**Compound component approach:**

```tsx
// Each part is composable and independently styleable
<Input.Root invalid={!!error} required>
  <Input.Label>Email</Input.Label>
  <Input.Field leftIcon={<MailIcon />} type="email" />
  <Input.Helper>Enter your email</Input.Helper>
  <Input.Error>{error}</Input.Error>
</Input.Root>
```

**How context wires the parts:**
`Input.Root` generates a stable ID via `React.useId()` and shares it through context:

```
baseId = "input-:r0:"
field   id          = "input-:r0:-field"
label   htmlFor     = "input-:r0:-field"     ← click label to focus input
helper  id          = "input-:r0:-helper"
error   id          = "input-:r0:-error"
field   aria-describedby = "input-:r0:-helper input-:r0:-error"
```

Zero manual ID management. Multiple inputs never collide. `React.useId()` produces the same ID on server and client — no hydration mismatch.

---

## 9. CSS-only animations

**Decision:** VE `keyframes` and `data-state` selectors. No Framer Motion.

**Why no Framer Motion:**
Framer Motion is ~150kb. The animations in this library are entry/exit fades and slides. CSS keyframes are zero-cost and sufficient.

**How Radix enables exit animations:**
Normally, removing an element from the DOM prevents its exit animation from playing. Radix sets `data-state="closed"` before removing — the CSS can animate on this state while the element is still in the DOM:

```ts
selectors: {
  '&[data-state="open"]': {
    animation: `${slideDown} 150ms ease-out`,
  },
  '&[data-state="closed"]': {
    animation: `${slideUp} 100ms ease-in`,
    // Element still in DOM, animation plays, then Radix removes it
  },
},
```

**`prefers-reduced-motion` is CSS, not JS:**

```ts
'@media': {
  '(prefers-reduced-motion: reduce)': {
    animation: 'none',
    transition: 'none',
  },
},
```

This fires automatically in every component for every user who has set their OS motion preference. No JavaScript, no React state, no opt-in required.

---

## 10. Figma → code token pipeline

**Flow:**

```
Figma Variables
  → Tokens Studio plugin exports tokens.json (W3C format)
  → Style Dictionary transforms tokens.json into:
      - CSS custom properties (tokens.css)
      - TypeScript constants (tokens.ts)
  → VE contract consumes the TypeScript shape
  → Components reference vars.* — never raw values
```

**Why W3C format:**
The W3C Design Token Community Group format (`$value`, `$type`) is tool-agnostic. Style Dictionary, Theo, and Token Transformer all support it. Locking to a proprietary format creates vendor dependency on the plugin.

**Why Style Dictionary:**
Async-native, ESM-first, and supports custom transforms. The transform pipeline (px → rem, etc.) runs at build time, not render time.

**The contract enforces completeness:**
If a designer adds a new token in Figma but doesn't update the VE contract, TypeScript catches it before it ships. The pipeline is: Figma → tokens.json → Style Dictionary → generated TS → VE contract → components. Every link is type-checked.

---

## 11. Changesets for versioning

**Decision:** `@changesets/cli` for package versioning and changelog management.

**The monorepo versioning problem:**
When `@tinyui-uilib/tokens` changes, `@tinyui-uilib/ui` (which depends on it) needs a version bump too. Doing this manually across packages is error-prone.

**How changesets solves this:**

```bash
# Developer describes the change
pnpm changeset
# → "which packages changed?" → @tinyui-uilib/ui
# → "patch/minor/major?" → minor
# → "what changed?" → "Add Accordion component"
# → writes .changeset/random-name.md
```

On merge to main, `changesets/action` opens a "Version Packages" PR that contains all bumped versions and generated CHANGELOG entries. Merging that PR triggers publish.

**`updateInternalDependencies: "patch"`:**
When tokens gets a new version, the `@tinyui-uilib/ui` dependency on it is automatically bumped to match. No manual cross-package version coordination needed.

---

## 12. Testing strategy

| Layer | Tool | What it tests |
|---|---|---|
| Unit | Vitest + Testing Library | Props, a11y attributes, keyboard behaviour, ref forwarding |
| Snapshot | Vitest snapshots | Class name stability across refactors |
| Visual | Chromatic | Pixel-level regression per story |
| A11y | Storybook a11y addon (Axe) | WCAG AA compliance per story |
| Interaction | Storybook `play()` functions | User flows — open/close, select, submit |
| Integration | Next.js playground | SSR rendering, hydration, RSC compatibility |

**Why Vitest over Jest:**
Vitest uses the same config as Vite. One tool, one config, no separate `babel.config.js` for JSX. Test and build use identical module resolution.

**Why Testing Library over Enzyme:**
Testing Library tests behaviour as a user experiences it — what is visible, what can be interacted with, what screen readers announce. Enzyme tests implementation details (internal state, lifecycle methods). Components should be refactorable without breaking tests.

**The `within(document.body)` pattern for Radix:**
Radix renders portals into `document.body`, outside the component's render container. Queries must target `document.body` after the portal mounts:

```ts
// Wrong — dialog is in a portal, not in container
const dialog = screen.getByRole('dialog');

// Correct
await waitFor(() => {
  expect(within(document.body).getByRole('dialog')).toBeInTheDocument();
});
```

**`waitFor` for Radix ARIA attributes:**
Radix sets ARIA attributes in a subsequent microtask after mount. Assertions on `aria-modal`, `aria-expanded`, etc. must be wrapped in `waitFor` or they race against the attribute being written.
