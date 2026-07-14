const warned = new Set<string>();

const isDev = process.env.NODE_ENV !== "production";

export function warnDeprecatedVariant(
  component: string,
  deprecated: string,
  canonical: string,
): void {
  if (!isDev) return;
  const key = `${component}:${deprecated}`;
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(
    `[AuronUI] ${component}: variant="${deprecated}" is deprecated, use variant="${canonical}" instead.`,
  );
}

export function warnDeprecatedProp(
  component: string,
  deprecated: string,
  canonical: string,
): void {
  if (!isDev) return;
  const key = `${component}:prop:${deprecated}`;
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(
    `[AuronUI] ${component}: prop "${deprecated}" is deprecated, use "${canonical}" instead.`,
  );
}

export function warnConflictingProps(
  component: string,
  propA: string,
  propB: string,
  resolution: string,
): void {
  if (!isDev) return;
  const key = `${component}:conflict:${propA}:${propB}`;
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(
    `[AuronUI] ${component}: "${propA}" and "${propB}" cannot be used together — ${resolution}.`,
  );
}

/** @internal — test helper to reset the deduplication cache between tests */
export function _clearWarnedCache(): void {
  warned.clear();
}
