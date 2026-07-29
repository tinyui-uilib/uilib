import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";
import { vars } from "@uilib/tokens";

export const typographyRecipe = recipe({
  base: {
    // Reset browser defaults — headings have margin/bold by default,
    // paragraphs have margin. We control all of this through tokens.
    margin: 0,
    padding: 0,
    fontFamily: vars.typography.fontFamily.sans,
  },

  variants: {
    // ── size ──────────────────────────────────────────────────────────────────
    // Larger sizes tighten line-height — long lines at large sizes with
    // relaxed line-height look clunky. Small sizes need more breathing room.
    size: {
      xs: {
        fontSize: vars.typography.fontSize.xs,
        lineHeight: vars.typography.lineHeight.normal,
      },
      sm: {
        fontSize: vars.typography.fontSize.sm,
        lineHeight: vars.typography.lineHeight.normal,
      },
      md: {
        fontSize: vars.typography.fontSize.md,
        lineHeight: vars.typography.lineHeight.normal,
      },
      lg: {
        fontSize: vars.typography.fontSize.lg,
        lineHeight: vars.typography.lineHeight.normal,
      },
      xl: {
        fontSize: vars.typography.fontSize.xl,
        lineHeight: vars.typography.lineHeight.tight,
      },
      "2xl": {
        fontSize: vars.typography.fontSize["2xl"],
        lineHeight: vars.typography.lineHeight.tight,
      },
      "3xl": {
        fontSize: vars.typography.fontSize["3xl"],
        lineHeight: vars.typography.lineHeight.tight,
      },
    },

    // ── weight ────────────────────────────────────────────────────────────────
    weight: {
      regular: { fontWeight: vars.typography.fontWeight.regular },
      medium: { fontWeight: vars.typography.fontWeight.medium },
      semibold: { fontWeight: vars.typography.fontWeight.semibold },
      bold: { fontWeight: vars.typography.fontWeight.bold },
    },

    // ── color ─────────────────────────────────────────────────────────────────
    // Semantic names only — never expose raw color values as props
    color: {
      primary: { color: vars.color.text.primary },
      secondary: { color: vars.color.text.secondary },
      disabled: { color: vars.color.text.disabled },
      onAccent: { color: vars.color.text.onAccent },
      // Destructive is intentionally excluded from typography —
      // use the error message pattern from Input instead
    },

    // ── align ─────────────────────────────────────────────────────────────────
    align: {
      left: { textAlign: "left" },
      center: { textAlign: "center" },
      right: { textAlign: "right" },
    },

    // ── truncate ──────────────────────────────────────────────────────────────
    // Single-line truncation with ellipsis.
    // Requires the parent to have a constrained width — otherwise the
    // element expands to fit content and truncation never triggers.
    truncate: {
      true: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        // Block-level so overflow works — inline elements ignore overflow
        display: "block",
      },
    },

    // ── italic ────────────────────────────────────────────────────────────────
    italic: {
      true: { fontStyle: "italic" },
    },

    // ── mono ──────────────────────────────────────────────────────────────────
    // Switches to monospace — useful for code snippets inline in prose
    mono: {
      true: { fontFamily: vars.typography.fontFamily.mono },
    },
  },

  defaultVariants: {
    size: "md",
    weight: "regular",
    color: "primary",
    align: "left",
    truncate: false,
    italic: false,
    mono: false,
  },
});

export type TypographyVariants = RecipeVariants<typeof typographyRecipe>;

// ── Exported aliases for component prop types ─────────────────────────────────
export type TextSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
export type TextWeight = "regular" | "medium" | "semibold" | "bold";
export type TextColor = "primary" | "secondary" | "disabled" | "onAccent";
export type TextAlign = "left" | "center" | "right";
