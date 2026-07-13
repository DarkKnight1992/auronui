import { defineComponent, computed, ref, type Ref, type VNode } from 'vue'
import { useSidebarProvide } from '../sidebar.context'

/**
 * Mounts children inside a component that provides Sidebar's context
 * directly, without needing a real <Sidebar> in the tree. Used by
 * SidebarItem/SidebarSection tests, which read activeHref/searchQuery
 * via useSidebarInject().
 *
 * The provided searchQuery ref is exposed as `wrapper.vm.searchQuery` so
 * tests can mutate it directly (e.g. `wrapper.vm.searchQuery = 'button'`)
 * to exercise search-reveals-collapsed-children behavior.
 */
export function withSidebarContext(
  render: () => VNode | VNode[],
  options: { activeHref?: string } = {},
) {
  return defineComponent({
    setup(_, { expose }) {
      const searchQuery: Ref<string> = ref('')
      useSidebarProvide({
        activeHref: computed(() => options.activeHref),
        searchQuery,
      })
      expose({ searchQuery })
      return () => render()
    },
  })
}
