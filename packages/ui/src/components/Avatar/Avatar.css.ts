import { recipe } from "@vanilla-extract/recipes";
import { style } from "@vanilla-extract/css";
import { vars } from "@uilib/tokens";

// ─── Root ─────────────────────────────────────────────────────────────────────

export const avatarRootRecipe = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    verticalAlign: "middle",
    overflow: "hidden",
    userSelect: "none",
    flexShrink: 0,
    position: "relative",
  },

  variants: {
    size: {
      xs: {
        width: "24px",
        height: "24px",
        fontSize: vars.typography.fontSize.xs,
      },
      sm: {
        width: "32px",
        height: "32px",
        fontSize: vars.typography.fontSize.xs,
      },
      md: {
        width: "40px",
        height: "40px",
        fontSize: vars.typography.fontSize.sm,
      },
      lg: {
        width: "48px",
        height: "48px",
        fontSize: vars.typography.fontSize.md,
      },
      xl: {
        width: "56px",
        height: "56px",
        fontSize: vars.typography.fontSize.lg,
      },
      "2xl": {
        width: "72px",
        height: "72px",
        fontSize: vars.typography.fontSize.xl,
      },
    },
    shape: {
      circle: { borderRadius: vars.radii.full },
      square: { borderRadius: vars.radii.md },
    },
  },

  defaultVariants: {
    size: "md",
    shape: "circle",
  },
});

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type AvatarShape = "circle" | "square";
export type AvatarStatus = "online" | "offline" | "away" | "busy";

// ─── Image ────────────────────────────────────────────────────────────────────

export const avatarImageClass = style({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

// ─── Fallback ─────────────────────────────────────────────────────────────────
// Shown when image fails to load or no src provided.
// Background + color come from accent tokens so it's theme-aware.

export const avatarFallbackClass = style({
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: vars.color.accent.subtle,
  color: vars.color.accent.default,
  fontWeight: vars.typography.fontWeight.semibold,
  fontFamily: vars.typography.fontFamily.sans,
  lineHeight: vars.typography.lineHeight.none,
});

// ─── Status indicator ─────────────────────────────────────────────────────────
// Absolutely positioned dot — bottom-right corner of the avatar.
// Border matches surface.default so it looks cut out from the background.

export const avatarStatusRecipe = recipe({
  base: {
    position: "absolute",
    bottom: "0",
    right: "0",
    borderRadius: vars.radii.full,
    border: `2px solid ${vars.color.surface.default}`,
    flexShrink: 0,
  },

  variants: {
    status: {
      online: { backgroundColor: vars.color.success.default },
      offline: { backgroundColor: vars.color.text.disabled },
      away: { backgroundColor: vars.color.warning.default },
      busy: { backgroundColor: vars.color.destructive.default },
    },
    size: {
      xs: { width: "6px", height: "6px" },
      sm: { width: "8px", height: "8px" },
      md: { width: "10px", height: "10px" },
      lg: { width: "12px", height: "12px" },
      xl: { width: "14px", height: "14px" },
      "2xl": { width: "16px", height: "16px" },
    },
  },

  defaultVariants: {
    status: "online",
    size: "md",
  },
});
