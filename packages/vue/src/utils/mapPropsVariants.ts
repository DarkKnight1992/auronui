/**
 * Splits a props object into a [remainingProps, pickedVariants] tuple.
 *
 * Used to separate variant-related props (passed to tailwind-variants)
 * from component-specific props (passed to the underlying element or Reka UI primitive).
 *
 * @param props - Full component props object
 * @param variantKeys - Keys that belong to the variant definition (may be absent from props)
 * @param removeVariantProps - When true (default), variant keys are removed from remainingProps
 * @returns [remainingProps, pickedVariants] tuple
 *
 * @example
 * const [rest, variants] = mapPropsVariants(props, ["size", "color", "variant"])
 * // rest = { disabled: true, onClick: ... }
 * // variants = { size: "md", color: "primary", variant: "solid" }
 */
export function mapPropsVariants<
  T extends Record<string, unknown>,
  K extends string
>(
  props: T,
  variantKeys: K[],
  removeVariantProps = true
): [Omit<T, K>, Partial<Pick<T, Extract<K, keyof T>>>] {
  const picked = {} as Partial<Pick<T, Extract<K, keyof T>>>;
  const rest = {} as Omit<T, K>;

  for (const key of variantKeys) {
    if (key in props) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (picked as any)[key] = (props as any)[key];
    }
  }

  if (removeVariantProps) {
    const variantKeySet = new Set<string>(variantKeys);
    for (const key in props) {
      if (!variantKeySet.has(key)) {
        (rest as Record<string, unknown>)[key] = props[key];
      }
    }
  } else {
    Object.assign(rest, props);
  }

  return [rest, picked];
}
