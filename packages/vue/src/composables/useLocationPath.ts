import { ref, onMounted, onUnmounted, type Ref } from 'vue'

const LOCATION_CHANGE_EVENT = 'auronui:locationchange'
let historyPatched = false

/**
 * Patches window.history.pushState/replaceState exactly once (module-level
 * guard) so every call also dispatches a same-window custom event. Native
 * pushState/replaceState calls do not fire any browser event on their own —
 * this is the standard dependency-free way to observe SPA route changes
 * without coupling to a specific router.
 */
function patchHistoryOnce(): void {
  if (historyPatched) return
  historyPatched = true

  const originalPushState = window.history.pushState.bind(window.history)
  const originalReplaceState = window.history.replaceState.bind(window.history)

  window.history.pushState = function patchedPushState(
    ...args: Parameters<typeof window.history.pushState>
  ): ReturnType<typeof window.history.pushState> {
    originalPushState(...args)
    window.dispatchEvent(new Event(LOCATION_CHANGE_EVENT))
  }

  window.history.replaceState = function patchedReplaceState(
    ...args: Parameters<typeof window.history.replaceState>
  ): ReturnType<typeof window.history.replaceState> {
    originalReplaceState(...args)
    window.dispatchEvent(new Event(LOCATION_CHANGE_EVENT))
  }
}

/**
 * Reactive `window.location.pathname`, updated on every SPA navigation
 * (pushState/replaceState) and browser back/forward (popstate) — with no
 * dependency on any specific router. Returns `undefined` during SSR.
 */
export function useLocationPath(): Ref<string | undefined> {
  const path = ref<string | undefined>(
    typeof window !== 'undefined' ? window.location.pathname : undefined,
  )

  function update(): void {
    path.value = window.location.pathname
  }

  onMounted(() => {
    patchHistoryOnce()
    update()
    window.addEventListener(LOCATION_CHANGE_EVENT, update)
    window.addEventListener('popstate', update)
  })

  onUnmounted(() => {
    if (typeof window === 'undefined') return
    window.removeEventListener(LOCATION_CHANGE_EVENT, update)
    window.removeEventListener('popstate', update)
  })

  return path
}
