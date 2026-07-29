import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";
import { style, keyframes } from "@vanilla-extract/css";
import { vars } from "@uilib/tokens";

const checkIn = keyframes({
  from: { opacity: 0, transform: "scale(0.6)" },
  to: { opacity: 1, transform: "scale(1)" },
});

export const checkboxRootRecipe = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    border: `1.5px solid ${vars.color.border.default}`,
    backgroundColor: vars.color.surface.default,
    cursor: "pointer",
    outline: "none",
    transition: [
      `border-color     ${vars.duration.fast} ${vars.easing.standard}`,
      `background-color ${vars.duration.fast} ${vars.easing.standard}`,
    ].join(", "),

    ":focus-visible": {
      boxShadow: `0 0 0 2px ${vars.color.surface.default}, 0 0 0 4px ${vars.color.border.focus}`,
    },

    ":disabled": {
      cursor: "not-allowed",
      opacity: "0.5",
    },

    selectors: {
      '&[data-state="checked"]': {
        backgroundColor: vars.color.accent.default,
        borderColor: vars.color.accent.default,
      },
      '&[data-state="indeterminate"]': {
        backgroundColor: vars.color.accent.default,
        borderColor: vars.color.accent.default,
      },
    },

    "@media": {
      "(prefers-reduced-motion: reduce)": { transition: "none" },
    },
  },

  variants: {
    size: {
      sm: { width: "14px", height: "14px", borderRadius: vars.radii.sm },
      md: { width: "16px", height: "16px", borderRadius: vars.radii.sm },
      lg: { width: "20px", height: "20px", borderRadius: vars.radii.md },
    },
  },

  defaultVariants: { size: "md" },
});

export type CheckboxVariants = RecipeVariants<typeof checkboxRootRecipe>;
export type CheckboxSize = "sm" | "md" | "lg";

export const checkboxIndicatorClass = style({
  display: "flex",
  color: vars.color.text.onAccent,
  animation: `${checkIn} ${vars.duration.fast} ${vars.easing.spring}`,

  "@media": {
    "(prefers-reduced-motion: reduce)": { animation: "none" },
  },
});

export const checkboxWrapperClass = style({
  display: "inline-flex",
  alignItems: "flex-start",
  gap: vars.space["2"],
  cursor: "pointer",

  selectors: {
    "&:has([data-disabled])": { cursor: "not-allowed" },
  },
});

export const checkboxLabelClass = style({
  fontFamily: vars.typography.fontFamily.sans,
  fontSize: vars.typography.fontSize.sm,
  fontWeight: vars.typography.fontWeight.medium,
  color: vars.color.text.primary,
  lineHeight: vars.typography.lineHeight.normal,
  userSelect: "none",
  paddingTop: "1px",
});
