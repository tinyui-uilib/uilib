import { recipe } from "@vanilla-extract/recipes";
import { style, keyframes } from "@vanilla-extract/css";
import { vars } from "@uilib/tokens";

// ─── Spinner ────────────────────────────────────────────────────────────────
// CSS-only. No Framer Motion. Scoped animation name — won't clash with
// any other keyframe in the consuming app.

const spin = keyframes({
  from: { transform: "rotate(0deg)" },
  to: { transform: "rotate(360deg)" },
});

export const spinnerClass = style({
  display: "inline-block",
  width: "1em",
  height: "1em",
  border: "2px solid currentColor",
  borderTopColor: "transparent",
  borderRadius: vars.radii.full,
  flexShrink: 0,
  animation: `${spin} ${vars.duration.slow} linear infinite`,

  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
      opacity: 0.5,
    },
  },
});

// ─── Icon slot ──────────────────────────────────────────────────────────────
// Wraps leftIcon / rightIcon. aria-hidden on the wrapper in the TSX,
// not here — that's a runtime concern not a style concern.

export const iconClass = style({
  display: "inline-flex",
  alignItems: "center",
  flexShrink: 0,
});

// ─── Button recipe ───────────────────────────────────────────────────────────

export const buttonRecipe = recipe({
  base: {
    // Layout
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: vars.space["2"],

    // Typography — always inherit from token, never hardcode
    fontFamily: vars.typography.fontFamily.sans,
    fontWeight: vars.typography.fontWeight.medium,
    lineHeight: vars.typography.lineHeight.none,
    textDecoration: "none",
    whiteSpace: "nowrap",

    // Reset
    border: "1px solid transparent",
    outline: "none",
    cursor: "pointer",
    userSelect: "none",
    position: "relative",

    // CSS-only transitions — all properties that visually change on interaction
    transition: [
      `background-color ${vars.duration.fast} ${vars.easing.standard}`,
      `color           ${vars.duration.fast} ${vars.easing.standard}`,
      `border-color    ${vars.duration.fast} ${vars.easing.standard}`,
      `box-shadow      ${vars.duration.fast} ${vars.easing.standard}`,
      `opacity         ${vars.duration.fast} ${vars.easing.standard}`,
    ].join(", "),

    // Focus ring — :focus-visible fires only on keyboard nav, not mouse clicks.
    // This is the correct a11y pattern. :focus would show the ring on click too.
    ":focus-visible": {
      boxShadow: `0 0 0 2px ${vars.color.surface.default}, 0 0 0 4px ${vars.color.border.focus}`,
    },

    ":disabled": {
      cursor: "not-allowed",
      pointerEvents: "none",
      opacity: "0.5",
    },

    "@media": {
      "(prefers-reduced-motion: reduce)": {
        transition: "none",
      },
    },
  },

  variants: {
    // ── intent ───────────────────────────────────────────────────────────────
    // Semantic role. "What does clicking this do?"
    // Never name these by color (bluePrimary, redButton) — names should
    // survive a rebrand without becoming lies.

    intent: {
      primary: {
        backgroundColor: vars.color.accent.default,
        color: vars.color.text.onAccent,
        borderColor: vars.color.accent.default,
        ":hover": {
          backgroundColor: vars.color.accent.hover,
          borderColor: vars.color.accent.hover,
        },
        ":active": {
          backgroundColor: vars.color.accent.active,
          borderColor: vars.color.accent.active,
        },
      },

      secondary: {
        backgroundColor: "transparent",
        color: vars.color.text.primary,
        borderColor: vars.color.border.default,
        ":hover": {
          backgroundColor: vars.color.surface.raised,
          borderColor: vars.color.border.strong,
        },
        ":active": {
          backgroundColor: vars.color.surface.overlay,
        },
      },

      ghost: {
        backgroundColor: "transparent",
        color: vars.color.text.primary,
        borderColor: "transparent",
        ":hover": {
          backgroundColor: vars.color.surface.overlay,
        },
        ":active": {
          backgroundColor: vars.color.surface.sunken,
        },
      },

      destructive: {
        backgroundColor: vars.color.destructive.default,
        color: vars.color.text.onAccent,
        borderColor: vars.color.destructive.default,
        ":hover": {
          backgroundColor: vars.color.destructive.hover,
          borderColor: vars.color.destructive.hover,
        },
        ":active": {
          opacity: "0.9",
        },
      },

      // Link intent: behaves visually like inline text, not a block button
      link: {
        backgroundColor: "transparent",
        color: vars.color.accent.default,
        borderColor: "transparent",
        height: "auto",
        padding: "0",
        fontWeight: vars.typography.fontWeight.regular,
        ":hover": {
          textDecoration: "underline",
        },
      },
    },

    // ── size ─────────────────────────────────────────────────────────────────
    // Fixed heights ensure vertical rhythm consistency across layouts.
    // Padding is horizontal only — height is the source of truth.

    size: {
      xs: {
        height: "28px",
        paddingInline: vars.space["2"],
        fontSize: vars.typography.fontSize.xs,
        borderRadius: vars.radii.sm,
        gap: vars.space["1"],
      },
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
        paddingInline: vars.space["6"],
        fontSize: vars.typography.fontSize.lg,
        borderRadius: vars.radii.lg,
      },
      xl: {
        height: "56px",
        paddingInline: vars.space["8"],
        fontSize: vars.typography.fontSize.xl,
        borderRadius: vars.radii.lg,
      },
    },

    // ── fullWidth ─────────────────────────────────────────────────────────────
    fullWidth: {
      true: { width: "100%" },
    },

    // ── iconOnly ──────────────────────────────────────────────────────────────
    // Square button for icon-only usage. Removes horizontal padding,
    // locks width to match height.
    iconOnly: {
      true: {
        paddingInline: "0",
        aspectRatio: "1",
      },
    },

    // ── loading ───────────────────────────────────────────────────────────────
    loading: {
      true: {
        cursor: "wait",
        pointerEvents: "none",
      },
    },
  },

  // ── compoundVariants ───────────────────────────────────────────────────────
  // Rules that only apply when MULTIPLE variants match simultaneously.
  // iconOnly needs an explicit width per size — aspectRatio alone isn't
  // reliable across all browsers when height is set in px.

  compoundVariants: [
    { variants: { iconOnly: true, size: "xs" }, style: { width: "28px" } },
    { variants: { iconOnly: true, size: "sm" }, style: { width: "32px" } },
    { variants: { iconOnly: true, size: "md" }, style: { width: "40px" } },
    { variants: { iconOnly: true, size: "lg" }, style: { width: "48px" } },
    { variants: { iconOnly: true, size: "xl" }, style: { width: "56px" } },
  ],

  defaultVariants: {
    intent: "primary",
    size: "md",
    fullWidth: false,
    iconOnly: false,
    loading: false,
  },
});
