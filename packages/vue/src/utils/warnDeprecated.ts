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

export function warnConflictingProps(
  component: string,
  propA: string,
  propB: string,
  resolution: string,
): void {
  if (!import.meta.env.DEV) return
  const key = `${component}:conflict:${propA}:${propB}`
  if (warned.has(key)) return
  warned.add(key)
  console.warn(
    `[AuronUI] ${component}: "${propA}" and "${propB}" cannot be used together — ${resolution}.`,
  )
}

export function warnPanelOrderMismatch(
  domIndex: number,
  registrationIndex: number,
): void {
  if (!import.meta.env.DEV) return
  const key = 'SplitterPanel:order-mismatch'
  if (warned.has(key)) return
  warned.add(key)
  console.warn(
    `[AuronUI] SplitterPanel: a panel mounted after its SplitterGroup is registered at `
    + `position ${registrationIndex} but rendered at position ${domIndex}. reka-ui orders `
    + `panels by their "order" prop and falls back to mount order — it never reads DOM `
    + `order — while resize handles take their pivot from the DOM, so dragging a handle `
    + `will resize the wrong panels. Give every conditionally rendered SplitterPanel an `
    + `explicit "order" (and a stable "id").`,
  )
}

/** @internal — test helper to reset the deduplication cache between tests */
export function _clearWarnedCache(): void {
  warned.clear()
}
