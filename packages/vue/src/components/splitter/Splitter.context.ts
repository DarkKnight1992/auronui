import type { ComputedRef, InjectionKey } from 'vue'
import type { SplitterVariants } from '@auronui/styles'

/**
 * A SplitterPanel wrapper, as seen by its group. `getElement` is read live so it
 * stays correct across remounts; `remount` forces the underlying reka-ui panel to
 * unregister and register again, which is how a group repairs its panel order.
 */
export interface SplitterPanelEntry {
  getElement: () => HTMLElement | null
  remount: () => void
}

export interface SplitterGroupContext {
  direction: ComputedRef<SplitterVariants['direction']>
  /** Whether the group repairs panel registration order after a late mount. */
  preservePanelOrder: ComputedRef<boolean>
  /**
   * Mirrors reka-ui's own panel registration counter, so a panel can compare the
   * position it was registered at against the position it actually renders at.
   * Returns the registering panel's index; see SplitterPanel for why that matters.
   */
  notePanelMounted: () => number
  notePanelUnmounted: () => void
  /** Adds a panel to the group's registry; the returned function removes it. */
  registerPanelEntry: (entry: SplitterPanelEntry) => () => void
  /**
   * Remounts every panel rendered after `domIndex` so they re-register behind the
   * panel that just mounted, putting reka-ui's registry back in DOM order.
   */
  reorderPanelsAfter: (groupElement: Element, domIndex: number) => void
}

export const splitterContextKey = Symbol('SplitterGroup') as InjectionKey<SplitterGroupContext>
