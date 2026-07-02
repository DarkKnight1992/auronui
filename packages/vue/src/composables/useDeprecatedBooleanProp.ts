import { computed, type ComputedRef } from "vue";
import { warnDeprecatedProp } from "../utils/warnDeprecated";

/**
 * Resolves a canonical `isX`-style boolean prop against its deprecated
 * bare-named predecessor (e.g. `isDisabled` vs `disabled`), preferring the
 * canonical prop when both are set and warning (dev-only, deduped) when the
 * deprecated prop is used.
 *
 * Values are read via getters — not passed directly — so the returned
 * computed stays reactive to prop changes. Reading `props.x` outside a
 * reactive effect copies out a primitive snapshot that never updates; the
 * getter defers that read until the computed's own effect runs.
 *
 * @example
 * ```ts
 * const isDisabled = useDeprecatedBooleanProp(
 *   'Switch', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
 * )
 * ```
 */
export function useDeprecatedBooleanProp(
  component: string,
  canonicalName: string,
  getCanonical: () => boolean | undefined,
  deprecatedName: string,
  getDeprecated: () => boolean | undefined,
  fallback = false,
): ComputedRef<boolean> {
  return computed(() => {
    const deprecatedValue = getDeprecated();
    if (deprecatedValue !== undefined) {
      warnDeprecatedProp(component, deprecatedName, canonicalName);
    }
    return getCanonical() ?? deprecatedValue ?? fallback;
  });
}
