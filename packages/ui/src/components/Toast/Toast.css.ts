import { style, keyframes } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";
import { vars } from "@uilib/tokens";

// ─── Keyframes ────────────────────────────────────────────────────────────────
// Slides in from the right, slides out to the right.
// swipeOut follows the user's finger position via --radix-toast-swipe-end-x

const slideIn = keyframes({
  from: { transform: "translateX(calc(100% + 24px))", opacity: 0 },
  to: { transform: "translateX(0)", opacity: 1 },
});

const slideOut = keyframes({
  from: { transform: "translateX(0)", opacity: 1 },
  to: { transform: "translateX(calc(100% + 24px))", opacity: 0 },
});

const swipeOut = keyframes({
  from: { transform: "translateX(var(--radix-toast-swipe-end-x))" },
  to: { transform: "translateX(calc(100% + 24px))" },
});

// ─── Viewport ─────────────────────────────────────────────────────────────────
// Fixed to bottom-right. Radix renders toasts here via a portal.
// This element must be announced as a region to AT.

export const toastViewportClass = style({
  position: "fixed",
  bottom: "24px",
  right: "24px",
  display: "flex",
  flexDirection: "column",
  gap: vars.space["2"],
  width: "380px",
  maxWidth: "calc(100vw - 48px)",
  margin: 0,
  padding: 0,
  listStyle: "none",
  zIndex: vars.zIndex.toast,
  outline: "none",
});

// ─── Root recipe ──────────────────────────────────────────────────────────────

export const toastRootRecipe = recipe({
  base: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    columnGap: vars.space["3"],
    alignItems: "start",
    backgroundColor: vars.color.surface.raised,
    border: `1px solid ${vars.color.border.default}`,
    borderRadius: vars.radii.lg,
    padding: vars.space["4"],
    boxShadow: vars.shadow.lg,
    position: "relative",

    // ── Radix data-state driven animations ──
    selectors: {
      '&[data-state="open"]': {
        animation: `${slideIn} ${vars.duration.normal} ${vars.easing.decelerate}`,
      },
      '&[data-state="closed"]': {
        animation: `${slideOut} ${vars.duration.fast} ${vars.easing.accelerate}`,
      },
      // Swipe gesture states
      '&[data-swipe="move"]': {
        transform: "translateX(var(--radix-toast-swipe-move-x))",
        transition: "none",
      },
      '&[data-swipe="cancel"]': {
        transform: "translateX(0)",
        transition: `transform ${vars.duration.fast} ${vars.easing.spring}`,
      },
      '&[data-swipe="end"]': {
        animation: `${swipeOut} ${vars.duration.fast} ${vars.easing.accelerate} forwards`,
      },
    },

    "@media": {
      "(prefers-reduced-motion: reduce)": {
        animation: "none",
      },
    },
  },

  variants: {
    // Left border color communicates intent — same pattern as Input error
    variant: {
      default: {
        borderLeftWidth: "4px",
        borderLeftColor: vars.color.border.strong,
      },
      success: {
        borderLeftWidth: "4px",
        borderLeftColor: vars.color.success.default,
      },
      error: {
        borderLeftWidth: "4px",
        borderLeftColor: vars.color.destructive.default,
      },
      warning: {
        borderLeftWidth: "4px",
        borderLeftColor: vars.color.warning.default,
      },
      info: {
        borderLeftWidth: "4px",
        borderLeftColor: vars.color.accent.default,
      },
    },
  },

  defaultVariants: {
    variant: "default",
  },
});

export type ToastVariants = RecipeVariants<typeof toastRootRecipe>;
export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

// ─── Content ──────────────────────────────────────────────────────────────────

export const toastContentClass = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space["1"],
});

export const toastTitleClass = style({
  fontFamily: vars.typography.fontFamily.sans,
  fontSize: vars.typography.fontSize.sm,
  fontWeight: vars.typography.fontWeight.semibold,
  color: vars.color.text.primary,
  lineHeight: vars.typography.lineHeight.tight,
});

export const toastDescriptionClass = style({
  fontFamily: vars.typography.fontFamily.sans,
  fontSize: vars.typography.fontSize.sm,
  color: vars.color.text.secondary,
  lineHeight: vars.typography.lineHeight.normal,
});

// ─── Actions ──────────────────────────────────────────────────────────────────

export const toastActionsClass = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  justifyContent: "space-between",
  gap: vars.space["2"],
  flexShrink: 0,
});

export const toastCloseClass = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "20px",
  height: "20px",
  borderRadius: vars.radii.sm,
  border: "none",
  backgroundColor: "transparent",
  color: vars.color.text.secondary,
  cursor: "pointer",
  padding: 0,
  flexShrink: 0,

  ":hover": {
    backgroundColor: vars.color.surface.overlay,
    color: vars.color.text.primary,
  },

  ":focus-visible": {
    outline: "none",
    boxShadow: `0 0 0 2px ${vars.color.border.focus}`,
  },
});

export const toastActionClass = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  paddingInline: vars.space["3"],
  paddingBlock: vars.space["1"],
  fontSize: vars.typography.fontSize.xs,
  fontWeight: vars.typography.fontWeight.medium,
  fontFamily: vars.typography.fontFamily.sans,
  color: vars.color.accent.default,
  backgroundColor: vars.color.accent.subtle,
  border: `1px solid ${vars.color.accent.default}`,
  borderRadius: vars.radii.md,
  cursor: "pointer",
  whiteSpace: "nowrap",

  ":hover": {
    backgroundColor: vars.color.accent.default,
    color: vars.color.text.onAccent,
  },

  ":focus-visible": {
    outline: "none",
    boxShadow: `0 0 0 2px ${vars.color.surface.default}, 0 0 0 4px ${vars.color.border.focus}`,
  },
});
