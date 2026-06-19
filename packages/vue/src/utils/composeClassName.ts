import { cx } from "tailwind-variants";
import { twMerge } from "tailwind-merge";

export { cx };

/**
 * Mirrors Vue's class binding — string, object, or array (recursive).
 * Matches what Vue 3 accepts on any :class binding so components can
 * pass the user's value straight through without narrowing it to string.
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
 * Accepts strings, objects ({ 'p-4': true }), arrays, and falsy values —
 * matching the full set of values Vue's :class binding accepts.
 *
 * Requires tailwind-merge 3.5.0 (Tailwind 4 compatible).
 *
 * @param classes - Any combination of ClassValue inputs
 * @returns Merged class string with conflicts resolved
 */
export function composeClassName(...classes: ClassValue[]): string {
  return twMerge(cx(...(classes as Parameters<typeof cx>)));
}
