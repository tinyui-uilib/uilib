import { style, keyframes } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";
import { vars } from "@uilib/tokens";

// ─── Keyframes ────────────────────────────────────────────────────────────────

const overlayShow = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const overlayHide = keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});

const contentShow = keyframes({
  from: { opacity: 0, transform: "translate(-50%, -48%) scale(0.96)" },
  to: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
});

const contentHide = keyframes({
  from: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
  to: { opacity: 0, transform: "translate(-50%, -48%) scale(0.96)" },
});

// ─── Overlay ──────────────────────────────────────────────────────────────────
// Full-screen backdrop. aria-hidden — purely decorative.
// Clicking it closes the dialog (Radix handles this).

export const dialogOverlayClass = style({
  position: "fixed",
  inset: 0,
  backgroundColor: "rgb(0 0 0 / 0.5)",
  zIndex: vars.zIndex.overlay,

  selectors: {
    '&[data-state="open"]': {
      animation: `${overlayShow} ${vars.duration.normal} ${vars.easing.decelerate}`,
    },
    '&[data-state="closed"]': {
      animation: `${overlayHide} ${vars.duration.fast} ${vars.easing.accelerate}`,
    },
  },

  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
    },
  },
});

// ─── Content ──────────────────────────────────────────────────────────────────
// The dialog panel. Fixed + centered via transform trick.
// translate(-50%, -50%) from top:50% left:50% = perfect centering
// regardless of dialog size or viewport size.

export const dialogContentRecipe = recipe({
  base: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: vars.color.surface.default,
    borderRadius: vars.radii.xl,
    boxShadow: vars.shadow.md,
    border: `1px solid ${vars.color.border.default}`,
    zIndex: vars.zIndex.modal,
    // Max height prevents dialog from overflowing viewport on small screens
    maxHeight: "85vh",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    // Focus outline removed — Radix manages focus visibility
    outline: "none",

    selectors: {
      '&[data-state="open"]': {
        animation: `${contentShow} ${vars.duration.normal} ${vars.easing.decelerate}`,
      },
      '&[data-state="closed"]': {
        animation: `${contentHide} ${vars.duration.fast} ${vars.easing.accelerate}`,
      },
    },

    "@media": {
      "(prefers-reduced-motion: reduce)": {
        animation: "none",
      },
      // Full-screen on mobile
      "(max-width: 640px)": {
        top: "auto",
        left: "0",
        right: "0",
        bottom: "0",
        transform: "none",
        width: "100%",
        maxWidth: "100%",
        borderRadius: `${vars.radii.xl} ${vars.radii.xl} 0 0`,
        maxHeight: "90vh",
      },
    },
  },

  variants: {
    size: {
      sm: { width: "90vw", maxWidth: "400px" },
      md: { width: "90vw", maxWidth: "560px" },
      lg: { width: "90vw", maxWidth: "720px" },
    },
  },

  defaultVariants: {
    size: "md",
  },
});

export type DialogContentVariants = RecipeVariants<typeof dialogContentRecipe>;
export type DialogSize = "sm" | "md" | "lg";

// ─── Header ───────────────────────────────────────────────────────────────────
// Contains title + optional close button.
// Sticky — stays visible when dialog content scrolls.

export const dialogHeaderClass = style({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: vars.space["4"],
  padding: `${vars.space["6"]} ${vars.space["6"]} 0`,
  // Sticky header stays pinned when dialog body scrolls
  position: "sticky",
  top: 0,
  backgroundColor: vars.color.surface.default,
  zIndex: "1",
});

// ─── Body ─────────────────────────────────────────────────────────────────────

export const dialogBodyClass = style({
  padding: vars.space["6"],
  flexGrow: 1,
  overflowY: "auto",
});

// ─── Footer ───────────────────────────────────────────────────────────────────
// Action buttons. Sticky at bottom when content scrolls.

export const dialogFooterClass = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: vars.space["3"],
  padding: `0 ${vars.space["6"]} ${vars.space["6"]}`,
  position: "sticky",
  bottom: 0,
  backgroundColor: vars.color.surface.default,
});

// ─── Title ────────────────────────────────────────────────────────────────────

export const dialogTitleClass = style({
  fontFamily: vars.typography.fontFamily.sans,
  fontSize: vars.typography.fontSize.lg,
  fontWeight: vars.typography.fontWeight.semibold,
  color: vars.color.text.primary,
  lineHeight: vars.typography.lineHeight.tight,
  margin: 0,
});

// ─── Description ──────────────────────────────────────────────────────────────

export const dialogDescriptionClass = style({
  fontFamily: vars.typography.fontFamily.sans,
  fontSize: vars.typography.fontSize.sm,
  color: vars.color.text.secondary,
  lineHeight: vars.typography.lineHeight.normal,
  margin: 0,
  // Description sits directly below title, inside the body
  marginTop: vars.space["1"],
});

// ─── Close button ─────────────────────────────────────────────────────────────

export const dialogCloseButtonClass = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "28px",
  height: "28px",
  borderRadius: vars.radii.md,
  border: "none",
  backgroundColor: "transparent",
  color: vars.color.text.secondary,
  cursor: "pointer",
  flexShrink: 0,
  padding: 0,

  ":hover": {
    backgroundColor: vars.color.surface.overlay,
    color: vars.color.text.primary,
  },

  ":focus-visible": {
    outline: "none",
    boxShadow: `0 0 0 2px ${vars.color.border.focus}`,
  },
});

// ─── Visually hidden ──────────────────────────────────────────────────────────
// For cases where a title exists for AT but shouldn't be visible.
// Standard SR-only pattern — element in DOM but invisible.

export const visuallyHiddenClass = style({
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: "0",
});
