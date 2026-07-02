const warned = new Set<string>()

export function warnDeprecatedVariant(
  component: string,
  deprecated: string,
  canonical: string,
): void {
  if (!import.meta.env.DEV) return
  const key = `${component}:${deprecated}`
  if (warned.has(key)) return
  warned.add(key)
  console.warn(
    `[AuronUI] ${component}: variant="${deprecated}" is deprecated, use variant="${canonical}" instead.`,
  )
}

export function warnDeprecatedProp(
  component: string,
  deprecated: string,
  canonical: string,
): void {
  if (!import.meta.env.DEV) return
  const key = `${component}:prop:${deprecated}`
  if (warned.has(key)) return
  warned.add(key)
  console.warn(
    `[AuronUI] ${component}: prop "${deprecated}" is deprecated, use "${canonical}" instead.`,
  )
}

/** @internal — test helper to reset the deduplication cache between tests */
export function _clearWarnedCache(): void {
  warned.clear()
}
