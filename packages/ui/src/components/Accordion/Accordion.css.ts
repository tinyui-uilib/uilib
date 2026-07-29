import { style, keyframes } from "@vanilla-extract/css";
import { vars } from "@uilib/tokens";

// ─── Animated height ──────────────────────────────────────────────────────────
// The height: 0 → auto problem: CSS cannot animate to `auto`.
// Radix solves this by setting --radix-accordion-content-height
// as a CSS variable on the content element. We animate to that value.

const slideDown = keyframes({
  from: { height: "0" },
  to: { height: "var(--radix-accordion-content-height)" },
});

const slideUp = keyframes({
  from: { height: "var(--radix-accordion-content-height)" },
  to: { height: "0" },
});

// ─── Root ─────────────────────────────────────────────────────────────────────

export const accordionRootClass = style({
  width: "100%",
  border: `1px solid ${vars.color.border.default}`,
  borderRadius: vars.radii.lg,
  overflow: "hidden",
});

// ─── Item ─────────────────────────────────────────────────────────────────────

export const accordionItemClass = style({
  borderBottom: `1px solid ${vars.color.border.default}`,

  selectors: {
    "&:last-child": {
      borderBottom: "none",
    },
  },
});

// ─── Trigger ──────────────────────────────────────────────────────────────────

export const accordionTriggerClass = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  paddingInline: vars.space["4"],
  paddingBlock: vars.space["4"],
  fontFamily: vars.typography.fontFamily.sans,
  fontSize: vars.typography.fontSize.sm,
  fontWeight: vars.typography.fontWeight.medium,
  color: vars.color.text.primary,
  backgroundColor: "transparent",
  border: "none",
  cursor: "pointer",
  textAlign: "left",
  outline: "none",

  ":hover": {
    backgroundColor: vars.color.surface.raised,
  },

  ":focus-visible": {
    boxShadow: `inset 0 0 0 2px ${vars.color.border.focus}`,
  },

  "@media": {
    "(prefers-reduced-motion: reduce)": { transition: "none" },
  },
});

// ─── Chevron ──────────────────────────────────────────────────────────────────

export const accordionChevronClass = style({
  flexShrink: 0,
  color: vars.color.text.secondary,
  transition: `transform ${vars.duration.normal} ${vars.easing.standard}`,

  selectors: {
    '[data-state="open"] &': {
      transform: "rotate(180deg)",
    },
  },

  "@media": {
    "(prefers-reduced-motion: reduce)": { transition: "none" },
  },
});

// ─── Content ──────────────────────────────────────────────────────────────────

export const accordionContentClass = style({
  overflow: "hidden",

  selectors: {
    '&[data-state="open"]': {
      animation: `${slideDown} ${vars.duration.normal} ${vars.easing.decelerate}`,
    },
    '&[data-state="closed"]': {
      animation: `${slideUp} ${vars.duration.normal} ${vars.easing.accelerate}`,
    },
  },

  "@media": {
    "(prefers-reduced-motion: reduce)": { animation: "none" },
  },
});

export const accordionContentInnerClass = style({
  paddingInline: vars.space["4"],
  paddingBottom: vars.space["4"],
  fontSize: vars.typography.fontSize.sm,
  color: vars.color.text.secondary,
  lineHeight: vars.typography.lineHeight.relaxed,
});
