import { useEffect, useState } from "react";

/**
 * Returns `false` during SSR and before mount, and `true` after the
 * component has mounted in the browser.
 *
 * Uses a plain `useState` + `useEffect` pair rather than
 * `useSyncExternalStore` (unlike `useIsHydrated`) — this hook intentionally
 * flips to `true` one commit *after* the initial render (mirroring Vue's
 * `onMounted` timing), whereas `useSyncExternalStore` would resolve
 * synchronously during the same render pass on the client.
 *
 * @example
 * ```tsx
 * const isMounted = useIsMounted()
 * // isMounted === false (during SSR or before the mount effect fires)
 * // isMounted === true  (after the mount effect fires)
 * ```
 */
export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}
