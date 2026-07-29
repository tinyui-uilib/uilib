import { recipe } from "@vanilla-extract/recipes";
import { style } from "@vanilla-extract/css";
import { vars } from "@uilib/tokens";

// ─── List ─────────────────────────────────────────────────────────────────────

export const tabsListRecipe = recipe({
  base: {
    display: "inline-flex",
    flexShrink: 0,
  },

  variants: {
    variant: {
      line: {
        borderBottom: `2px solid ${vars.color.border.default}`,
        gap: vars.space["1"],
      },
      pill: {
        backgroundColor: vars.color.surface.raised,
        borderRadius: vars.radii.lg,
        padding: vars.space["1"],
        gap: vars.space["1"],
      },
    },
  },

  defaultVariants: { variant: "line" },
});

export type TabsVariant = "line" | "pill";

// ─── Trigger ──────────────────────────────────────────────────────────────────

export const tabsTriggerRecipe = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    gap: vars.space["2"],
    fontFamily: vars.typography.fontFamily.sans,
    fontWeight: vars.typography.fontWeight.medium,
    cursor: "pointer",
    outline: "none",
    border: "none",
    backgroundColor: "transparent",
    color: vars.color.text.secondary,
    whiteSpace: "nowrap",
    transition: [
      `color            ${vars.duration.fast} ${vars.easing.standard}`,
      `background-color ${vars.duration.fast} ${vars.easing.standard}`,
    ].join(", "),

    ":hover": {
      color: vars.color.text.primary,
    },

    ":focus-visible": {
      outline: "none",
      boxShadow: `0 0 0 2px ${vars.color.border.focus}`,
      borderRadius: vars.radii.md,
    },

    ":disabled": {
      cursor: "not-allowed",
      opacity: "0.5",
    },

    "@media": {
      "(prefers-reduced-motion: reduce)": { transition: "none" },
    },
  },

  variants: {
    variant: {
      line: {
        paddingInline: vars.space["4"],
        paddingBottom: vars.space["3"],
        paddingTop: vars.space["2"],
        fontSize: vars.typography.fontSize.sm,
        borderBottom: "2px solid transparent",
        marginBottom: "-2px",

        selectors: {
          '&[data-state="active"]': {
            color: vars.color.text.primary,
            borderColor: vars.color.accent.default,
          },
        },
      },
      pill: {
        paddingInline: vars.space["3"],
        paddingBlock: vars.space["2"],
        fontSize: vars.typography.fontSize.sm,
        borderRadius: vars.radii.md,

        selectors: {
          '&[data-state="active"]': {
            color: vars.color.text.primary,
            backgroundColor: vars.color.surface.default,
            boxShadow: vars.shadow.sm,
          },
        },
      },
    },
  },

  defaultVariants: { variant: "line" },
});

// ─── Content ──────────────────────────────────────────────────────────────────

export const tabsContentClass = style({
  outline: "none",

  ":focus-visible": {
    boxShadow: `0 0 0 2px ${vars.color.border.focus}`,
    borderRadius: vars.radii.md,
  },
});
