import { warnDeprecatedProp } from "./warnDeprecated";

/**
 * Resolves a canonical `isX`-style boolean prop against its deprecated
 * bare-named predecessor (e.g. `isDisabled` vs `disabled`), preferring the
 * canonical prop when both are set and warning (dev-only, deduped) when the
 * deprecated prop is used.
 *
 * Plain function rather than a hook — the computation is cheap and doesn't
 * need memoization, so it can be called conditionally without violating the
 * rules of hooks.
 *
 * @example
 * const isDisabled = resolveDeprecatedBooleanProp(
 *   'Switch', 'isDisabled', props.isDisabled, 'disabled', props.disabled,
 * )
 */
export function resolveDeprecatedBooleanProp(
  component: string,
  canonicalName: string,
  canonicalValue: boolean | undefined,
  deprecatedName: string,
  deprecatedValue: boolean | undefined,
  fallback = false,
): boolean {
  if (deprecatedValue !== undefined) {
    warnDeprecatedProp(component, deprecatedName, canonicalName);
  }
  return canonicalValue ?? deprecatedValue ?? fallback;
}
