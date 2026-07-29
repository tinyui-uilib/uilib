import { style, keyframes } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";
import { vars } from "@uilib/tokens";

// ─── Keyframes ────────────────────────────────────────────────────────────────
// Two axes of animation — vertical slide + opacity fade.
// Slide distance is small (4px) — enough to feel physical, not dramatic.

const slideDown = keyframes({
  from: { opacity: 0, transform: "translateY(-4px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

const slideUp = keyframes({
  from: { opacity: 1, transform: "translateY(0)" },
  to: { opacity: 0, transform: "translateY(-4px)" },
});

// ─── Trigger ──────────────────────────────────────────────────────────────────
// The visible button that opens the dropdown.
// Heights match Input exactly — 32px / 40px / 48px — so Select
// and Input align when used together in a form row.

export const selectTriggerRecipe = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: vars.space["2"],
    width: "100%",
    fontFamily: vars.typography.fontFamily.sans,
    color: vars.color.text.primary,
    backgroundColor: vars.color.surface.default,
    border: `1px solid ${vars.color.border.default}`,
    cursor: "pointer",
    outline: "none",
    userSelect: "none",

    ":focus-visible": {
      borderColor: vars.color.border.focus,
      boxShadow: `0 0 0 3px ${vars.color.accent.subtle}`,
    },

    ":disabled": {
      cursor: "not-allowed",
      opacity: "0.5",
      backgroundColor: vars.color.surface.raised,
    },

    // Radix sets data-placeholder when no value is selected
    selectors: {
      "&[data-placeholder]": {
        color: vars.color.text.disabled,
      },
      // Radix sets data-state="open" on the trigger when dropdown is open
      '&[data-state="open"]': {
        borderColor: vars.color.border.focus,
        boxShadow: `0 0 0 3px ${vars.color.accent.subtle}`,
      },
    },

    transition: [
      `border-color ${vars.duration.fast} ${vars.easing.standard}`,
      `box-shadow   ${vars.duration.fast} ${vars.easing.standard}`,
    ].join(", "),

    "@media": {
      "(prefers-reduced-motion: reduce)": {
        transition: "none",
      },
    },
  },

  variants: {
    size: {
      sm: {
        height: "32px",
        paddingInline: vars.space["3"],
        fontSize: vars.typography.fontSize.sm,
        borderRadius: vars.radii.md,
      },
      md: {
        height: "40px",
        paddingInline: vars.space["4"],
        fontSize: vars.typography.fontSize.md,
        borderRadius: vars.radii.md,
      },
      lg: {
        height: "48px",
        paddingInline: vars.space["4"],
        fontSize: vars.typography.fontSize.lg,
        borderRadius: vars.radii.lg,
      },
    },

    invalid: {
      true: {
        borderColor: vars.color.destructive.default,

        ":focus-visible": {
          borderColor: vars.color.destructive.default,
          boxShadow: `0 0 0 3px ${vars.color.destructive.subtle}`,
        },

        selectors: {
          '&[data-state="open"]': {
            borderColor: vars.color.destructive.default,
            boxShadow: `0 0 0 3px ${vars.color.destructive.subtle}`,
          },
        },
      },
    },
  },

  defaultVariants: {
    size: "md",
    invalid: false,
  },
});

export type SelectTriggerVariants = RecipeVariants<typeof selectTriggerRecipe>;
export type SelectSize = "sm" | "md" | "lg";

// ─── Icon ─────────────────────────────────────────────────────────────────────
// Chevron wrapper. Rotates 180° when open — CSS only, no JS.

export const selectIconClass = style({
  display: "inline-flex",
  alignItems: "center",
  flexShrink: 0,
  color: vars.color.text.secondary,
  transition: `transform ${vars.duration.fast} ${vars.easing.standard}`,

  selectors: {
    // Parent trigger carries data-state — child icon reads it via CSS
    '[data-state="open"] &': {
      transform: "rotate(180deg)",
    },
  },

  "@media": {
    "(prefers-reduced-motion: reduce)": {
      transition: "none",
    },
  },
});

// ─── Content ──────────────────────────────────────────────────────────────────
// The dropdown panel. Rendered in a portal so it escapes overflow:hidden.

export const selectContentClass = style({
  backgroundColor: vars.color.surface.default,
  border: `1px solid ${vars.color.border.default}`,
  borderRadius: vars.radii.lg,
  boxShadow: vars.shadow.lg,
  padding: vars.space["1"],
  // Matches trigger width — Radix handles this via --radix-select-trigger-width
  minWidth: "var(--radix-select-trigger-width)",
  // Cap height at ~40vh before scroll kicks in
  maxHeight: "var(--radix-select-content-available-height)",
  overflowY: "auto",
  // Stack above everything else
  zIndex: vars.zIndex.dropdown,

  selectors: {
    '&[data-state="open"]': {
      animation: `${slideDown} ${vars.duration.fast} ${vars.easing.decelerate}`,
    },
    '&[data-state="closed"]': {
      animation: `${slideUp} ${vars.duration.fast} ${vars.easing.accelerate}`,
    },
  },

  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
    },
  },
});

// ─── Viewport ─────────────────────────────────────────────────────────────────
// Inner scroll container — Radix requires this wrapping the items

export const selectViewportClass = style({
  padding: vars.space["1"],
});

// ─── Item ─────────────────────────────────────────────────────────────────────
// One option. Radix handles keyboard highlight via data-highlighted.

export const selectItemClass = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space["2"],
  paddingInline: vars.space["3"],
  paddingBlock: vars.space["2"],
  fontSize: vars.typography.fontSize.sm,
  color: vars.color.text.primary,
  borderRadius: vars.radii.md,
  cursor: "default",
  // Prevents text selection while navigating with keyboard
  userSelect: "none",
  outline: "none",
  position: "relative",

  // data-highlighted fires on keyboard focus AND mouse hover.
  // This is Radix's unified "active item" state.
  selectors: {
    "&[data-highlighted]": {
      backgroundColor: vars.color.accent.subtle,
      color: vars.color.accent.default,
    },
    "&[data-disabled]": {
      color: vars.color.text.disabled,
      pointerEvents: "none",
    },
    // Selected item — slightly different from highlighted
    '&[data-state="checked"]': {
      fontWeight: vars.typography.fontWeight.medium,
    },
  },

  transition: `background-color ${vars.duration.instant} ${vars.easing.standard}`,

  "@media": {
    "(prefers-reduced-motion: reduce)": {
      transition: "none",
    },
  },
});

// ─── Item indicator ───────────────────────────────────────────────────────────
// Checkmark that appears on the selected item.
// Radix only renders this when the item is selected.

export const selectItemIndicatorClass = style({
  display: "inline-flex",
  alignItems: "center",
  color: vars.color.accent.default,
  flexShrink: 0,
});

// ─── Group label ──────────────────────────────────────────────────────────────
// Visual header above a group of related options.

export const selectLabelClass = style({
  paddingInline: vars.space["3"],
  paddingBlock: vars.space["1"],
  fontSize: vars.typography.fontSize.xs,
  fontWeight: vars.typography.fontWeight.semibold,
  color: vars.color.text.secondary,
  // Uppercase + tracking makes group labels visually distinct from items
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  userSelect: "none",
});

// ─── Separator ────────────────────────────────────────────────────────────────
// Horizontal rule between groups.

export const selectSeparatorClass = style({
  height: "1px",
  backgroundColor: vars.color.border.default,
  marginBlock: vars.space["1"],
  marginInline: vars.space["2"],
});
