/**
 * Dot-path access for plain objects and arrays.
 *
 * The Form family names fields by path (`"password.min_length"`,
 * `"contacts.0.email"`). Every read and write of a form value goes through
 * these two functions so that a name means exactly one thing everywhere —
 * reading defaults, assembling `getValues()`, and resolving a cross-field rule
 * all agree on the same shape.
 */

/** Keys that must never be walked or written — writing them poisons Object.prototype. */
const PROTOTYPE_KEYS = new Set(['__proto__', 'constructor', 'prototype'])

/** Split a dot path into segments. A name without a dot is a single segment. */
export function toPathSegments(path: string): string[] {
  return path.includes('.') ? path.split('.') : [path]
}

function isTraversable(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

/**
 * Read `path` out of `source`.
 *
 * A literal own key always wins, so a flat map keyed by a dotted name
 * (`{ 'auth_factor.force_mfa': true }`) keeps working alongside the nested
 * shape. Otherwise the path is walked, at any depth, through objects and
 * arrays alike — a numeric segment indexes an array.
 */
export function getPath(source: unknown, path: string): unknown {
  if (!isTraversable(source)) return undefined
  if (Object.prototype.hasOwnProperty.call(source, path)) return source[path]

  const segments = toPathSegments(path)
  if (segments.length === 1) return undefined

  let current: unknown = source
  for (const segment of segments) {
    if (PROTOTYPE_KEYS.has(segment)) return undefined
    if (!isTraversable(current)) return undefined
    current = current[segment]
  }
  return current
}

/**
 * Write `value` at `path` in `target`, creating containers as it descends.
 * A container is an array when the *next* segment is numeric, an object
 * otherwise — so `"contacts.0.email"` builds `{ contacts: [{ email }] }`.
 */
export function setPath(target: Record<string, unknown>, path: string, value: unknown): void {
  const segments = toPathSegments(path)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dynamic path walking; the shape is built here, not describable to the type system
  let container: any = target

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    if (PROTOTYPE_KEYS.has(segment)) return

    if (i === segments.length - 1) {
      container[segment] = value
      return
    }

    if (!isTraversable(container[segment])) {
      container[segment] = /^\d+$/.test(segments[i + 1]) ? [] : {}
    }
    container = container[segment]
  }
}

/**
 * Every leaf path in `value`, prefixed by `base`. Used to fan a subtree write
 * (`setValue('auth_factor', { force_mfa: true })`) out to the individual
 * registered fields it covers. An empty object/array is itself a leaf — there
 * is nothing below it to address.
 */
export function flattenPaths(value: unknown, base = ''): Array<{ path: string; value: unknown }> {
  const isPlainObject =
    isTraversable(value) && (Array.isArray(value) || Object.getPrototypeOf(value) === Object.prototype)

  if (!isPlainObject) return [{ path: base, value }]

  const entries = Array.isArray(value)
    ? value.map((item, index) => [String(index), item] as const)
    : Object.entries(value)

  if (entries.length === 0) return [{ path: base, value }]

  const leaves: Array<{ path: string; value: unknown }> = []
  for (const [key, child] of entries) {
    if (PROTOTYPE_KEYS.has(key)) continue
    leaves.push(...flattenPaths(child, base ? `${base}.${key}` : key))
  }
  return leaves
}
