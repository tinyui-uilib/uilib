import { style, keyframes } from "@vanilla-extract/css";
import { vars } from "@uilib/tokens";

const popIn = keyframes({
  from: { opacity: 0, transform: "scale(0.96) translateY(-4px)" },
  to: { opacity: 1, transform: "scale(1) translateY(0)" },
});

const popOut = keyframes({
  from: { opacity: 1, transform: "scale(1) translateY(0)" },
  to: { opacity: 0, transform: "scale(0.96) translateY(-4px)" },
});

export const popoverContentClass = style({
  backgroundColor: vars.color.surface.default,
  border: `1px solid ${vars.color.border.default}`,
  borderRadius: vars.radii.lg,
  boxShadow: vars.shadow.lg,
  padding: vars.space["4"],
  zIndex: vars.zIndex.popover,
  outline: "none",
  // Width is set per-use — no default width here

  selectors: {
    '&[data-state="open"]': {
      animation: `${popIn} ${vars.duration.fast} ${vars.easing.decelerate}`,
    },
    '&[data-state="closed"]': {
      animation: `${popOut} ${vars.duration.fast} ${vars.easing.accelerate}`,
    },
  },

  "@media": {
    "(prefers-reduced-motion: reduce)": { animation: "none" },
  },
});

export const popoverArrowClass = style({
  fill: vars.color.surface.default,
  stroke: vars.color.border.default,
});

export const popoverHeaderClass = style({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: vars.space["3"],
  marginBottom: vars.space["3"],
});

export const popoverTitleClass = style({
  fontFamily: vars.typography.fontFamily.sans,
  fontSize: vars.typography.fontSize.sm,
  fontWeight: vars.typography.fontWeight.semibold,
  color: vars.color.text.primary,
  margin: 0,
});

export const popoverCloseClass = style({
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
