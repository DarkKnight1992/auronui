import { useMediaQuery as useVueUseMediaQuery } from "@vueuse/core";
import type { Ref } from "vue";

/**
 * Returns a reactive boolean ref that tracks whether a CSS media query matches.
 *
 * Thin wrapper over `@vueuse/core`'s `useMediaQuery`. Provides a stable
 * import path within the Auron package, decoupling component code from the
 * `@vueuse/core` peer dependency API surface.
 *
 * In jsdom test environments, `window.matchMedia` is not implemented — tests
 * must stub it with `vi.stubGlobal('matchMedia', ...)` before calling this
 * composable (see threat model T-00-15).
 *
 * @param query - A valid CSS media query string, e.g. `"(max-width: 768px)"`
 * @returns A `Ref<boolean>` that is `true` when the media query matches
 *
 * @example
 * ```ts
 * const isMobile = useMediaQuery("(max-width: 768px)")
 * // isMobile.value === true when viewport width <= 768px
 * ```
 */
export function useMediaQuery(query: string): Ref<boolean> {
  return useVueUseMediaQuery(query);
}
