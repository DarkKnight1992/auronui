/**
 * Returns "true" when condition is truthy and undefined when falsy.
 *
 * React drops an attribute from the DOM when its value is `undefined`,
 * so this mirrors the Vue package's dataAttr for boolean data-* attributes.
 *
 * @example
 * <div data-disabled={dataAttr(isDisabled)} />
 */
export function dataAttr(condition: boolean | undefined): "true" | undefined {
  return (condition ? "true" : undefined) as "true" | undefined;
}
