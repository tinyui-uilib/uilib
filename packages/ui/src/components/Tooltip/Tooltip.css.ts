import { style, keyframes } from "@vanilla-extract/css";
import { vars } from "@uilib/tokens";

const fadeIn = keyframes({
  from: { opacity: 0, transform: "scale(0.96)" },
  to: { opacity: 1, transform: "scale(1)" },
});

const fadeOut = keyframes({
  from: { opacity: 1, transform: "scale(1)" },
  to: { opacity: 0, transform: "scale(0.96)" },
});

export const tooltipContentClass = style({
  backgroundColor: vars.color.text.primary,
  color: vars.color.text.inverse,
  borderRadius: vars.radii.md,
  paddingInline: vars.space["3"],
  paddingBlock: vars.space["2"],
  fontSize: vars.typography.fontSize.xs,
  fontFamily: vars.typography.fontFamily.sans,
  lineHeight: vars.typography.lineHeight.normal,
  maxWidth: "280px",
  zIndex: vars.zIndex.tooltip,
  // Prevents tooltip from being selected
  userSelect: "none",
  pointerEvents: "none",

  selectors: {
    '&[data-state="delayed-open"]': {
      animation: `${fadeIn} ${vars.duration.fast} ${vars.easing.decelerate}`,
    },
    '&[data-state="closed"]': {
      animation: `${fadeOut} ${vars.duration.fast} ${vars.easing.accelerate}`,
    },
  },

  "@media": {
    "(prefers-reduced-motion: reduce)": { animation: "none" },
  },
});

export const tooltipArrowClass = style({
  fill: vars.color.text.primary,
});
