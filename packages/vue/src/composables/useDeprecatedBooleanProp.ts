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
 *
 * `fallback` may also be a getter (`() => boolean`) for cases where the fallback itself
 * must stay reactive — e.g. falling through to a parent context's resolved value when
 * both the canonical and deprecated props are unset:
 * ```ts
 * const isDisabled = useDeprecatedBooleanProp(
 *   'AutocompleteInput', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
 *   () => ctx.isDisabled.value,
 * )
 * ```
 */
export function useDeprecatedBooleanProp(
  component: string,
  canonicalName: string,
  getCanonical: () => boolean | undefined,
  deprecatedName: string,
  getDeprecated: () => boolean | undefined,
  fallback: boolean | (() => boolean) = false,
): ComputedRef<boolean> {
  return computed(() => {
    const deprecatedValue = getDeprecated();
    if (deprecatedValue !== undefined) {
      warnDeprecatedProp(component, deprecatedName, canonicalName);
    }
    const resolvedFallback = typeof fallback === "function" ? fallback() : fallback;
    return getCanonical() ?? deprecatedValue ?? resolvedFallback;
  });
}
