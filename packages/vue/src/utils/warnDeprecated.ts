const warned = new Set<string>()

// Gated on `process.env.NODE_ENV`, never Vite's env object: Vite statically
// replaces the latter when building *this library*, which compiled every
// warning here to a no-op in the published package. `process.env.NODE_ENV` is
// left for the consumer's bundler to replace (Vite, webpack and Nuxt all do),
// the convention Vue's own esm-bundler build relies on. Written as the bare
// expression — not behind a `typeof process` check — so that replacement
// happens in the browser too; the try/catch covers unbundled ESM.
function isDev(): boolean {
  try {
    return process.env.NODE_ENV !== 'production'
  } catch {
    return false
  }
}

export function warnDeprecatedVariant(
  component: string,
  deprecated: string,
  canonical: string,
): void {
  if (!isDev()) return
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
  if (!isDev()) return
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
  if (!isDev()) return
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
  if (!isDev()) return
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

/**
 * reka-ui reserves `""` as the Select value that clears the selection, and
 * throws a generic error for a `<SelectItem value="">`. Say what to do instead.
 */
export function warnEmptySelectItemValue(): void {
  if (!isDev()) return
  const key = 'SelectItem:empty-value'
  if (warned.has(key)) return
  warned.add(key)
  console.warn(
    `[AuronUI] SelectItem: value="" is not allowed — reka-ui reserves the empty string `
    + `for clearing the selection (it shows the placeholder). For an "any"/"none" option, `
    + `use a sentinel value such as value="__none__" and map it in your handler.`,
  )
}

/** A link component dropped a `javascript:` / `vbscript:` href (see safeHref). */
export function warnUnsafeHref(href: string): void {
  if (!isDev()) return
  console.warn(
    `[AuronUI] Blocked a script URL in href ("${href.slice(0, 40)}"). The link is rendered `
    + `without an href. Validate user-supplied URLs before passing them to a link.`,
  )
}

/** @internal — test helper to reset the deduplication cache between tests */
/**
 * A field-level `defaultValue` of `false` is shadowing a truthy form-level
 * default. Almost always the Vue Boolean-prop cast: a wrapper component
 * declaring `defaultValue?: boolean` forwards `false` on every render where its
 * own author passed nothing, because Vue casts an absent Boolean prop to
 * `false` rather than `undefined`.
 *
 * Deliberately narrow. Warning on *any* field-level default that differs from a
 * form-level one would nag on legitimate per-field overrides; the cast can only
 * ever manufacture `false`, so that is the only case worth flagging.
 */
export function warnDefaultValueShadow(
  name: string,
  formValue: unknown,
): void {
  if (!isDev()) return
  const key = `FormField:default-shadow:${name}`
  if (warned.has(key)) return
  warned.add(key)
  console.warn(
    `[AuronUI] FormField "${name}": field-level defaultValue is false but Form `
    + `defaultValues has ${String(formValue)} — the field-level value wins, so this field `
    + `seeds to false. If you did not pass default-value yourself, a wrapper component `
    + `declaring \`defaultValue?: boolean\` is the likely cause: Vue casts an absent `
    + `Boolean prop to false, not undefined. Type it \`unknown\`, or use FormControl.`,
  )
}

export function _clearWarnedCache(): void {
  warned.clear()
}
