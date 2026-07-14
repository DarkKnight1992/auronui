import { useCallback, useSyncExternalStore } from "react";

/**
 * Returns a boolean that tracks whether a CSS media query matches.
 *
 * Implemented with plain browser APIs (`window.matchMedia`) via
 * `useSyncExternalStore`, which keeps the value hydration-safe: the server
 * snapshot is always `false` since `window` doesn't exist there.
 *
 * In jsdom test environments, `window.matchMedia` is not implemented — tests
 * must stub it with `vi.stubGlobal('matchMedia', ...)` before rendering a
 * component/hook that calls this.
 *
 * @param query - A valid CSS media query string, e.g. `"(max-width: 768px)"`
 * @returns `true` when the media query currently matches
 *
 * @example
 * ```tsx
 * const isMobile = useMediaQuery("(max-width: 768px)")
 * // isMobile === true when viewport width <= 768px
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return () => {};
      }
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onStoreChange);
      return () => mql.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return false;
    }
    return window.matchMedia(query).matches;
  }, [query]);

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
