import { defineComponent, computed, ref, type VNode } from 'vue'
import { useSidebarProvide } from '../sidebar.context'

/**
 * Mounts children inside a component that provides Sidebar's context
 * directly, without needing a real <Sidebar> in the tree. Used by
 * SidebarItem/SidebarSection tests, which read activeHref/searchQuery
 * via useSidebarInject().
 */
export function withSidebarContext(
  render: () => VNode | VNode[],
  options: { activeHref?: string } = {},
) {
  return defineComponent({
    setup() {
      useSidebarProvide({
        activeHref: computed(() => options.activeHref),
        searchQuery: ref(''),
      })
      return () => render()
    },
  })
}
