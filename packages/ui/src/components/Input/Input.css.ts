import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";
import { style } from "@vanilla-extract/css";
import { vars } from "@uilib/tokens";

// ─── Root ─────────────────────────────────────────────────────────────────────
// Vertical stack — label → field wrapper → helper/error

export const inputRootClass = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space["1"],
  width: "100%",
});

// ─── Label ────────────────────────────────────────────────────────────────────

export const inputLabelClass = style({
  fontFamily: vars.typography.fontFamily.sans,
  fontSize: vars.typography.fontSize.sm,
  fontWeight: vars.typography.fontWeight.medium,
  color: vars.color.text.primary,
  lineHeight: vars.typography.lineHeight.normal,
  userSelect: "none",

  // Required asterisk via CSS — no extra DOM element needed
  selectors: {
    '&[data-required="true"]::after': {
      content: '" *"',
      color: vars.color.destructive.default,
      marginLeft: vars.space["1"],
      fontWeight: vars.typography.fontWeight.regular,
    },
  },
});

// ─── Field wrapper ────────────────────────────────────────────────────────────
// Wraps the <input> and icon adornments.
// Position relative so icons can be absolutely positioned inside.

export const inputWrapperClass = style({
  position: "relative",
  display: "flex",
  width: "100%",
});

// ─── Adornment ────────────────────────────────────────────────────────────────
// Icon slot — left or right of the input.

export const inputAdornmentClass = style({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  display: "flex",
  alignItems: "center",
  color: vars.color.text.secondary,
  pointerEvents: "none",
  flexShrink: 0,
});

export const inputAdornmentLeftClass = style([
  inputAdornmentClass,
  { left: vars.space["3"] },
]);

export const inputAdornmentRightClass = style([
  inputAdornmentClass,
  { right: vars.space["3"] },
]);

// ─── Field recipe ─────────────────────────────────────────────────────────────

export const inputFieldRecipe = recipe({
  base: {
    width: "100%",
    fontFamily: vars.typography.fontFamily.sans,
    color: vars.color.text.primary,
    backgroundColor: vars.color.surface.default,
    border: `1px solid ${vars.color.border.default}`,
    outline: "none",
    appearance: "none",

    "::placeholder": {
      color: vars.color.text.disabled,
    },

    // Focus — show ring using box-shadow so it doesn't affect layout
    ":focus-visible": {
      borderColor: vars.color.border.focus,
      boxShadow: `0 0 0 3px ${vars.color.accent.subtle}`,
    },

    ":disabled": {
      cursor: "not-allowed",
      opacity: "0.5",
      backgroundColor: vars.color.surface.raised,
    },

    ":read-only": {
      backgroundColor: vars.color.surface.raised,
      cursor: "default",
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
    // ── size ──────────────────────────────────────────────────────────────────
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

    // ── invalid ───────────────────────────────────────────────────────────────
    // Separate from `disabled` — both can be true simultaneously
    invalid: {
      true: {
        borderColor: vars.color.destructive.default,

        ":focus-visible": {
          borderColor: vars.color.destructive.default,
          boxShadow: `0 0 0 3px ${vars.color.destructive.subtle}`,
        },
      },
    },

    // ── icon padding adjustments ──────────────────────────────────────────────
    // Prevents text sitting under the icon
    hasLeftIcon: {
      true: {},
    },
    hasRightIcon: {
      true: {},
    },
  },

  // Compound: adjust padding per size + icon presence
  compoundVariants: [
    {
      variants: { size: "sm", hasLeftIcon: true },
      style: { paddingLeft: vars.space["8"] },
    },
    {
      variants: { size: "md", hasLeftIcon: true },
      style: { paddingLeft: vars.space["10"] },
    },
    {
      variants: { size: "lg", hasLeftIcon: true },
      style: { paddingLeft: vars.space["10"] },
    },
    {
      variants: { size: "sm", hasRightIcon: true },
      style: { paddingRight: vars.space["8"] },
    },
    {
      variants: { size: "md", hasRightIcon: true },
      style: { paddingRight: vars.space["10"] },
    },
    {
      variants: { size: "lg", hasRightIcon: true },
      style: { paddingRight: vars.space["10"] },
    },
  ],

  defaultVariants: {
    size: "md",
    invalid: false,
    hasLeftIcon: false,
    hasRightIcon: false,
  },
});

export type InputFieldVariants = RecipeVariants<typeof inputFieldRecipe>;

// ─── Helper text ──────────────────────────────────────────────────────────────

export const inputHelperClass = style({
  fontFamily: vars.typography.fontFamily.sans,
  fontSize: vars.typography.fontSize.xs,
  color: vars.color.text.secondary,
  lineHeight: vars.typography.lineHeight.normal,
});

// ─── Error message ────────────────────────────────────────────────────────────

export const inputErrorClass = style({
  fontFamily: vars.typography.fontFamily.sans,
  fontSize: vars.typography.fontSize.xs,
  color: vars.color.destructive.default,
  lineHeight: vars.typography.lineHeight.normal,
});
