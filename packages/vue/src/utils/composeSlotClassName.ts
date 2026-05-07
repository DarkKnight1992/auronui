/**
 * Composes a slot class name from a slot function or a plain className string.
 *
 * Instead of render-prop callbacks, Reka UI uses string `class` + data-attribute CSS selectors.
 * This utility bridges the gap for components that accept slot class overrides.
 *
 * @param slotFn - Optional slot function that accepts variant props + className
 * @param className - Base class string
 * @param variants - Variant props to pass into slotFn
 * @returns Computed class string
 */
export function composeSlotClassName<V extends Record<string, unknown>>(
  slotFn: ((props: V & { className?: string }) => string) | undefined,
  className: string | undefined,
  variants: V
): string | undefined {
  if (typeof slotFn === "function") {
    return slotFn({ ...variants, className });
  }
  return className;
}
