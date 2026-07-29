import { createTheme } from "@vanilla-extract/css";
import { vars } from "../contract.css";

export const brandTheme = createTheme(vars, {
  color: {
    surface: {
      default: "#fafaf9",
      raised: "#f5f5f4",
      overlay: "#e7e5e4",
      sunken: "#d6d3d1",
    },
    text: {
      primary: "#1c1917",
      secondary: "#78716c",
      disabled: "#a8a29e",
      inverse: "#ffffff",
      onAccent: "#ffffff",
    },
    border: {
      default: "#e7e5e4",
      strong: "#d6d3d1",
      focus: "#7c3aed",
    },
    accent: {
      default: "#7c3aed",
      hover: "#6d28d9",
      active: "#5b21b6",
      subtle: "#f5f3ff",
    },
    destructive: {
      default: "#dc2626",
      hover: "#b91c1c",
      subtle: "#fef2f2",
    },
    success: {
      default: "#059669",
      subtle: "#ecfdf5",
    },
    warning: {
      default: "#d97706",
      subtle: "#fffbeb",
    },
  },

  // All structural tokens identical to default
  space: {
    px: "1px",
    "0": "0px",
    "1": "0.25rem",
    "2": "0.5rem",
    "3": "0.75rem",
    "4": "1rem",
    "5": "1.25rem",
    "6": "1.5rem",
    "8": "2rem",
    "10": "2.5rem",
    "12": "3rem",
    "16": "4rem",
  },
  radii: {
    none: "0px",
    sm: "0.125rem",
    md: "0.25rem",
    lg: "0.375rem",
    xl: "0.5rem",
    full: "9999px",
  },
  typography: {
    fontFamily: {
      sans: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      mono: '"JetBrains Mono", Consolas, monospace',
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      md: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
    },
    fontWeight: {
      regular: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
    lineHeight: {
      none: "1",
      tight: "1.25",
      normal: "1.5",
      relaxed: "1.625",
    },
  },
  shadow: {
    none: "none",
    sm: "0 1px 2px 0 rgb(124 58 237 / 0.08)",
    md: "0 4px 6px -1px rgb(124 58 237 / 0.12), 0 2px 4px -2px rgb(124 58 237 / 0.08)",
    lg: "0 10px 15px -3px rgb(124 58 237 / 0.15), 0 4px 6px -4px rgb(124 58 237 / 0.1)",
  },
  duration: {
    instant: "50ms",
    fast: "100ms",
    normal: "200ms",
    slow: "300ms",
  },
  easing: {
    standard: "cubic-bezier(0.4, 0, 0.2, 1)",
    decelerate: "cubic-bezier(0, 0, 0.2, 1)",
    accelerate: "cubic-bezier(0.4, 0, 1, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },

  zIndex: {
    dropdown: "1000",
    sticky: "1100",
    overlay: "1200",
    modal: "1300",
    popover: "1400",
    tooltip: "1500",
    toast: "1600",
  },
});
