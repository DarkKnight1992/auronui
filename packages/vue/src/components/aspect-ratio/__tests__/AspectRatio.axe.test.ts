import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import AspectRatio from '../AspectRatio.vue'

describe('AspectRatio axe audit', () => {
  const mountedWrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mountedWrappers.forEach(w => w.unmount())
    mountedWrappers.length = 0
  })

  it('Axe Test 1: Default AspectRatio with slot content passes axe', async () => {
    const wrapper = mount(AspectRatio, {
      slots: { default: 'Content' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('Axe Test 2: Custom ratio AspectRatio passes axe', async () => {
    const wrapper = mount(AspectRatio, {
      props: { ratio: 16 / 9 },
      slots: { default: 'Content' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
