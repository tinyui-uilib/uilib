/**
 * Classname utility — filters falsy values and joins.
 * Intentionally not using clsx: this is the only place in the library
 * that needs conditional class merging, and the savings don't justify
 * adding a dependency.
 */
export function cn(
  ...classes: Array<string | boolean | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
