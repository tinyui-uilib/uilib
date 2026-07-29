import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";
import { vars } from "@uilib/tokens";

export const badgeRecipe = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    gap: vars.space["1"],
    fontFamily: vars.typography.fontFamily.sans,
    fontWeight: vars.typography.fontWeight.medium,
    lineHeight: vars.typography.lineHeight.none,
    whiteSpace: "nowrap",
    userSelect: "none",
  },

  variants: {
    variant: {
      solid: {},
      subtle: {},
      outline: {},
    },

    intent: {
      default: {},
      primary: {},
      success: {},
      warning: {},
      destructive: {},
    },

    size: {
      sm: {
        fontSize: vars.typography.fontSize.xs,
        paddingInline: vars.space["2"],
        paddingBlock: vars.space["1"],
        borderRadius: vars.radii.sm,
      },
      md: {
        fontSize: vars.typography.fontSize.xs,
        paddingInline: vars.space["2"],
        paddingBlock: vars.space["1"],
        borderRadius: vars.radii.md,
      },
      lg: {
        fontSize: vars.typography.fontSize.sm,
        paddingInline: vars.space["3"],
        paddingBlock: vars.space["1"],
        borderRadius: vars.radii.md,
      },
    },
  },

  compoundVariants: [
    // ── solid ──
    {
      variants: { variant: "solid", intent: "default" },
      style: {
        backgroundColor: vars.color.surface.sunken,
        color: vars.color.text.primary,
        border: "1px solid transparent",
      },
    },
    {
      variants: { variant: "solid", intent: "primary" },
      style: {
        backgroundColor: vars.color.accent.default,
        color: vars.color.text.onAccent,
        border: "1px solid transparent",
      },
    },
    {
      variants: { variant: "solid", intent: "success" },
      style: {
        backgroundColor: vars.color.success.default,
        color: vars.color.text.onAccent,
        border: "1px solid transparent",
      },
    },
    {
      variants: { variant: "solid", intent: "warning" },
      style: {
        backgroundColor: vars.color.warning.default,
        color: vars.color.text.onAccent,
        border: "1px solid transparent",
      },
    },
    {
      variants: { variant: "solid", intent: "destructive" },
      style: {
        backgroundColor: vars.color.destructive.default,
        color: vars.color.text.onAccent,
        border: "1px solid transparent",
      },
    },

    // ── subtle ──
    {
      variants: { variant: "subtle", intent: "default" },
      style: {
        backgroundColor: vars.color.surface.overlay,
        color: vars.color.text.secondary,
        border: "1px solid transparent",
      },
    },
    {
      variants: { variant: "subtle", intent: "primary" },
      style: {
        backgroundColor: vars.color.accent.subtle,
        color: vars.color.accent.default,
        border: "1px solid transparent",
      },
    },
    {
      variants: { variant: "subtle", intent: "success" },
      style: {
        backgroundColor: vars.color.success.subtle,
        color: vars.color.success.default,
        border: "1px solid transparent",
      },
    },
    {
      variants: { variant: "subtle", intent: "warning" },
      style: {
        backgroundColor: vars.color.warning.subtle,
        color: vars.color.warning.default,
        border: "1px solid transparent",
      },
    },
    {
      variants: { variant: "subtle", intent: "destructive" },
      style: {
        backgroundColor: vars.color.destructive.subtle,
        color: vars.color.destructive.default,
        border: "1px solid transparent",
      },
    },

    // ── outline ──
    {
      variants: { variant: "outline", intent: "default" },
      style: {
        backgroundColor: "transparent",
        color: vars.color.text.secondary,
        border: `1px solid ${vars.color.border.default}`,
      },
    },
    {
      variants: { variant: "outline", intent: "primary" },
      style: {
        backgroundColor: "transparent",
        color: vars.color.accent.default,
        border: `1px solid ${vars.color.accent.default}`,
      },
    },
    {
      variants: { variant: "outline", intent: "success" },
      style: {
        backgroundColor: "transparent",
        color: vars.color.success.default,
        border: `1px solid ${vars.color.success.default}`,
      },
    },
    {
      variants: { variant: "outline", intent: "warning" },
      style: {
        backgroundColor: "transparent",
        color: vars.color.warning.default,
        border: `1px solid ${vars.color.warning.default}`,
      },
    },
    {
      variants: { variant: "outline", intent: "destructive" },
      style: {
        backgroundColor: "transparent",
        color: vars.color.destructive.default,
        border: `1px solid ${vars.color.destructive.default}`,
      },
    },
  ],

  defaultVariants: {
    variant: "subtle",
    intent: "default",
    size: "md",
  },
});

export type BadgeVariants = RecipeVariants<typeof badgeRecipe>;
export type BadgeVariant = "solid" | "subtle" | "outline";
export type BadgeIntent =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "destructive";
export type BadgeSize = "sm" | "md" | "lg";
