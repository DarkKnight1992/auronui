import { cx } from "tailwind-variants";
import { twMerge } from "tailwind-merge";

export { cx };

/**
 * Matches what `clsx`/tailwind-variants' `cx` accepts on any className prop —
 * string, object, or array (recursive) — mirroring the Vue package's ClassValue.
 */
export type ClassValue =
  | string
  | false
  | null
  | undefined
  | Record<string, unknown>
  | ClassValue[];

/**
 * Merges Tailwind CSS classes, resolving conflicts via tailwind-merge.
 *
 * Requires tailwind-merge 3.5.0 (Tailwind 4 compatible).
 *
 * @param classes - Any combination of ClassValue inputs
 * @returns Merged class string with conflicts resolved
 */
export function composeClassName(...classes: ClassValue[]): string {
  return twMerge(cx(...(classes as Parameters<typeof cx>)));
}
