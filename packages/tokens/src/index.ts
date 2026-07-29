// The contract — what components reference
export { vars } from "./contract.css";
export type { ThemeVars } from "./contract.css";

// Concrete themes — applied as a class on <html>
export { defaultTheme } from "./themes/default.css";
export { darkTheme } from "./themes/dark.css";
export { brandTheme } from "./themes/brand.css";

// Raw generated values — for non-VE consumers (docs, tests, scripts)
export * from "./generated/tokens";
