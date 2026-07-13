import { createContext } from '../../utils/context'
import type { Ref, ComputedRef } from 'vue'

export interface SidebarContext {
  /** Effective active href — controlled `activeHref` prop, or auto-detected via useLocationPath(). */
  activeHref: ComputedRef<string | undefined>
  /** Current search query. Empty string when search is disabled or empty. */
  searchQuery: Ref<string>
}

export const {
  useProvide: useSidebarProvide,
  useInject: useSidebarInject,
  key: sidebarContextKey,
} = createContext<SidebarContext>('Sidebar')
