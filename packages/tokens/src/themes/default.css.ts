import { createTheme } from "@vanilla-extract/css";
import { vars } from "../contract.css";

export const defaultTheme = createTheme(vars, {
  color: {
    surface: {
      default: "#ffffff",
      raised: "#f8fafc",
      overlay: "#f1f5f9",
      sunken: "#e2e8f0",
    },
    text: {
      primary: "#0f172a",
      secondary: "#64748b",
      disabled: "#94a3b8",
      inverse: "#ffffff",
      onAccent: "#ffffff",
    },
    border: {
      default: "#e2e8f0",
      strong: "#cbd5e1",
      focus: "#3b82f6",
    },
    accent: {
      default: "#2563eb",
      hover: "#1d4ed8",
      active: "#1e40af",
      subtle: "#eff6ff",
    },
    destructive: {
      default: "#dc2626",
      hover: "#b91c1c",
      subtle: "#fef2f2",
    },
    success: {
      default: "#16a34a",
      subtle: "#f0fdf4",
    },
    warning: {
      default: "#d97706",
      subtle: "#fffbeb",
    },
  },

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
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    full: "9999px",
  },

  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"JetBrains Mono", "Fira Code", Consolas, monospace',
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
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
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
