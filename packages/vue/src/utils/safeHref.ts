import { warnUnsafeHref } from './warnDeprecated'

// Browsers strip ASCII whitespace and control characters from a URL before
// reading its scheme, so `java\tscript:` and ` javascript:` still execute.
const IGNORED_URL_CHARS = /[\u0000- ]/g
const SCRIPT_SCHEME = /^(?:javascript|vbscript):/i

/**
 * Drops `javascript:` / `vbscript:` URLs from an `href`. Vue — unlike React,
 * which refuses them — renders such a URL as-is, so a link component fed a
 * user-supplied URL would ship a script that runs on click. Every other URL
 * (relative, `#`, `mailto:`, `data:` …) is returned unchanged.
 */
export function safeHref(href: string | undefined): string | undefined {
  if (href === undefined) return undefined
  if (SCRIPT_SCHEME.test(href.replace(IGNORED_URL_CHARS, ''))) {
    warnUnsafeHref(href)
    return undefined
  }
  return href
}
