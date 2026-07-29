import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";
import { style } from "@vanilla-extract/css";
import { vars } from "@uilib/tokens";

export const switchRootRecipe = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: vars.radii.full,
    border: "none",
    cursor: "pointer",
    flexShrink: 0,
    backgroundColor: vars.color.border.default,
    padding: "2px",
    transition: `background-color ${vars.duration.fast} ${vars.easing.standard}`,
    outline: "none",
    position: "relative",

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
      },
    },

    "@media": {
      "(prefers-reduced-motion: reduce)": { transition: "none" },
    },
  },

  variants: {
    size: {
      sm: { width: "32px", height: "18px" },
      md: { width: "40px", height: "22px" },
      lg: { width: "48px", height: "26px" },
    },
  },

  defaultVariants: { size: "md" },
});

export type SwitchVariants = RecipeVariants<typeof switchRootRecipe>;
export type SwitchSize = "sm" | "md" | "lg";

export const switchThumbRecipe = recipe({
  base: {
    display: "block",
    borderRadius: vars.radii.full,
    backgroundColor: vars.color.surface.default,
    boxShadow: vars.shadow.sm,
    transition: `transform ${vars.duration.fast} ${vars.easing.spring}`,

    selectors: {
      '[data-state="checked"] &': {},
    },

    "@media": {
      "(prefers-reduced-motion: reduce)": { transition: "none" },
    },
  },

  variants: {
    size: {
      sm: {
        width: "14px",
        height: "14px",
        selectors: {
          '[data-state="checked"] &': { transform: "translateX(14px)" },
        },
      },
      md: {
        width: "18px",
        height: "18px",
        selectors: {
          '[data-state="checked"] &': { transform: "translateX(18px)" },
        },
      },
      lg: {
        width: "22px",
        height: "22px",
        selectors: {
          '[data-state="checked"] &': { transform: "translateX(22px)" },
        },
      },
    },
  },

  defaultVariants: { size: "md" },
});

// ── Wrapper for label + switch layout ─────────────────────────────────────────

export const switchWrapperClass = style({
  display: "inline-flex",
  alignItems: "center",
  gap: vars.space["3"],
  cursor: "pointer",

  selectors: {
    "&:has([data-disabled])": {
      cursor: "not-allowed",
    },
  },
});

export const switchLabelClass = style({
  fontFamily: vars.typography.fontFamily.sans,
  fontSize: vars.typography.fontSize.sm,
  fontWeight: vars.typography.fontWeight.medium,
  color: vars.color.text.primary,
  lineHeight: vars.typography.lineHeight.normal,
  userSelect: "none",
});
