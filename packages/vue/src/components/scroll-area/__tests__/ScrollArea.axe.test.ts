import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import ScrollArea from '../ScrollArea.vue'

describe('ScrollArea axe audit', () => {
  const mountedWrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mountedWrappers.forEach(w => w.unmount())
    mountedWrappers.length = 0
  })

  it('Axe Test 1: default ScrollArea (orientation="vertical") passes axe', async () => {
    const wrapper = mount(ScrollArea, {
      slots: { default: '<p>scrollable content</p>' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('Axe Test 2: ScrollArea with orientation="both" passes axe', async () => {
    const wrapper = mount(ScrollArea, {
      props: { type: 'always', orientation: 'both' },
      slots: { default: '<p>scrollable content</p>' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
