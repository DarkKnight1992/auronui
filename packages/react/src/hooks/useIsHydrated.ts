import { useSyncExternalStore } from "react";

function subscribe(): () => void {
  return () => {};
}

function getSnapshot(): boolean {
  return true;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Returns `false` during SSR and before hydration, and `true` after the
 * component has hydrated in the browser.
 *
 * Implemented with `useSyncExternalStore`, which is the React-idiomatic,
 * hydration-safe way to have a value differ between the server-rendered
 * markup and the client's first render without triggering a hydration
 * mismatch warning — the server snapshot is fixed at `false`; the client
 * snapshot is fixed at `true`, and React reconciles the swap after hydration
 * completes.
 *
 * @remarks
 * If a component conditionally renders different markup based on `isHydrated`,
 * it must ensure the server-rendered output matches the initial client render
 * (both see `false`) to avoid hydration mismatches.
 *
 * @example
 * ```tsx
 * const isHydrated = useIsHydrated()
 * // isHydrated === false (during SSR, safe for server rendering)
 * // isHydrated === true  (after client hydration completes)
 * ```
 */
export function useIsHydrated(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
