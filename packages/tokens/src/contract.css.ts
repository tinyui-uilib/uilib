import { createThemeContract } from "@vanilla-extract/css";

/**
 * createThemeContract defines the SHAPE of tokens — not the values.
 * Every null is a slot that each theme must fill.
 * If a theme misses a slot → TypeScript compile error, not a visual bug.
 */
export const vars = createThemeContract({
  color: {
    surface: {
      default: null, // page background
      raised: null, // cards, panels
      overlay: null, // hover fills
      sunken: null, // inputs, recessed areas
    },
    text: {
      primary: null,
      secondary: null,
      disabled: null,
      inverse: null, // text on dark backgrounds
      onAccent: null, // text on colored buttons
    },
    border: {
      default: null,
      strong: null,
      focus: null, // keyboard focus ring
    },
    accent: {
      default: null,
      hover: null,
      active: null,
      subtle: null, // light tint background
    },
    destructive: {
      default: null,
      hover: null,
      subtle: null,
    },
    success: {
      default: null,
      subtle: null,
    },
    warning: {
      default: null,
      subtle: null,
    },
  },

  space: {
    px: null,
    "0": null,
    "1": null, // 4px
    "2": null, // 8px
    "3": null, // 12px
    "4": null, // 16px
    "5": null, // 20px
    "6": null, // 24px
    "8": null, // 32px
    "10": null, // 40px
    "12": null, // 48px
    "16": null, // 64px
  },

  radii: {
    none: null,
    sm: null,
    md: null,
    lg: null,
    xl: null,
    full: null,
  },

  typography: {
    fontFamily: {
      sans: null,
      mono: null,
    },
    fontSize: {
      xs: null,
      sm: null,
      md: null,
      lg: null,
      xl: null,
      "2xl": null,
      "3xl": null,
    },
    fontWeight: {
      regular: null,
      medium: null,
      semibold: null,
      bold: null,
    },
    lineHeight: {
      none: null,
      tight: null,
      normal: null,
      relaxed: null,
    },
  },

  shadow: {
    none: null,
    sm: null,
    md: null,
    lg: null,
  },

  duration: {
    instant: null,
    fast: null,
    normal: null,
    slow: null,
  },

  easing: {
    standard: null, // general motion
    decelerate: null, // elements entering
    accelerate: null, // elements leaving
    spring: null, // toggles, checkboxes
  },

  zIndex: {
    dropdown: null,
    sticky: null,
    overlay: null,
    modal: null,
    popover: null,
    tooltip: null,
    toast: null,
  },
});

export type ThemeVars = typeof vars;
