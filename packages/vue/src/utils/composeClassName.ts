import { cx } from "tailwind-variants";
import { twMerge } from "tailwind-merge";

export { cx };

/**
 * Merges Tailwind CSS classes, resolving conflicts via tailwind-merge.
 * Uses cx() from tailwind-variants to join classes, then twMerge() to
 * deduplicate conflicting utilities (e.g. "p-4 p-2" → "p-2").
 *
 * Requires tailwind-merge 3.5.0 (Tailwind 4 compatible).
 *
 * @param classes - Class strings, undefined, null, or false values
 * @returns Merged class string with conflicts resolved
 */
export function composeClassName(
  ...classes: (string | undefined | null | false)[]
): string {
  return twMerge(cx(...(classes as Parameters<typeof cx>)));
}
