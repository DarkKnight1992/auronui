import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Tree from '../Tree.vue'

describe('Tree', () => {
  // Reka UI's TreeRoot only exposes `disabled` via injected context for
  // descendants to consume (no DOM data-disabled/aria-disabled is rendered
  // on the root itself in this version) — so the observable contract we can
  // verify is that the resolved boolean is correctly forwarded as the
  // `disabled` prop on the underlying TreeRoot primitive.
  it('deprecated bare disabled prop resolves to true and is forwarded to TreeRoot', () => {
    const items: Record<string, unknown>[] = [{ id: '1', label: 'Item 1' }]
    const wrapper = mount(Tree, {
      props: {
        items,
        getKey: (item: Record<string, unknown>) => item.id as string,
        disabled: true,
      },
    })
    const treeRoot = wrapper.findComponent({ name: 'TreeRoot' })
    expect(treeRoot.exists()).toBe(true)
    expect(treeRoot.props('disabled')).toBe(true)
    wrapper.unmount()
  })
})
