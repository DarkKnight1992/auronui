/**
 * Returns "true" when condition is truthy and undefined when falsy.
 *
 * Used to set boolean HTML data-attributes on components. When the attribute
 * value is undefined, Vue removes the attribute from the DOM entirely.
 *
 *
 * @example
 * <div :data-disabled="dataAttr(isDisabled)" />
 * // When isDisabled=true  → <div data-disabled="true">
 * // When isDisabled=false → <div> (attribute absent)
 */
export function dataAttr(
  condition: boolean | undefined
): "true" | undefined {
  return (condition ? "true" : undefined) as "true" | undefined;
}
