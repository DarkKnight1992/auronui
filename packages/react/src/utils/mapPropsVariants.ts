/**
 * Splits a props object into a [remainingProps, pickedVariants] tuple.
 *
 * Used to separate variant-related props (passed to tailwind-variants)
 * from component-specific props (spread onto the underlying element or primitive).
 *
 * @example
 * const [rest, variants] = mapPropsVariants(props, ["size", "color", "variant"])
 */
export function mapPropsVariants<
  T extends Record<string, unknown>,
  K extends string,
>(
  props: T,
  variantKeys: K[],
  removeVariantProps = true,
): [Omit<T, K>, Partial<Pick<T, Extract<K, keyof T>>>] {
  const picked = {} as Partial<Pick<T, Extract<K, keyof T>>>;
  const rest = {} as Omit<T, K>;

  for (const key of variantKeys) {
    if (key in props) {
      (picked as Record<string, unknown>)[key] = props[key];
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
