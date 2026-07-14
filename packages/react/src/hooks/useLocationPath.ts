import { useCallback, useSyncExternalStore } from "react";

const LOCATION_CHANGE_EVENT = "auronui:locationchange";
let historyPatched = false;

/**
 * Patches window.history.pushState/replaceState exactly once (module-level
 * guard) so every call also dispatches a same-window custom event. Native
 * pushState/replaceState calls do not fire any browser event on their own —
 * this is the standard dependency-free way to observe SPA route changes
 * without coupling to a specific router.
 */
function patchHistoryOnce(): void {
  if (historyPatched) return;
  historyPatched = true;

  const originalPushState = window.history.pushState.bind(window.history);
  const originalReplaceState = window.history.replaceState.bind(window.history);

  window.history.pushState = function patchedPushState(
    ...args: Parameters<typeof window.history.pushState>
  ): ReturnType<typeof window.history.pushState> {
    originalPushState(...args);
    window.dispatchEvent(new Event(LOCATION_CHANGE_EVENT));
  };

  window.history.replaceState = function patchedReplaceState(
    ...args: Parameters<typeof window.history.replaceState>
  ): ReturnType<typeof window.history.replaceState> {
    originalReplaceState(...args);
    window.dispatchEvent(new Event(LOCATION_CHANGE_EVENT));
  };
}

function subscribe(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  patchHistoryOnce();
  window.addEventListener(LOCATION_CHANGE_EVENT, onStoreChange);
  window.addEventListener("popstate", onStoreChange);
  return () => {
    window.removeEventListener(LOCATION_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("popstate", onStoreChange);
  };
}

function getSnapshot(): string {
  return window.location.pathname;
}

function getServerSnapshot(): string | undefined {
  return undefined;
}

/**
 * Reactive `window.location.pathname`, updated on every SPA navigation
 * (pushState/replaceState) and browser back/forward (popstate) — with no
 * dependency on any specific router. Returns `undefined` during SSR.
 */
export function useLocationPath(): string | undefined {
  const subscribeCb = useCallback(subscribe, []);
  return useSyncExternalStore(subscribeCb, getSnapshot, getServerSnapshot);
}
