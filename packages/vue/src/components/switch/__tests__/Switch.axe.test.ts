import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import Switch from '../Switch.vue'

describe('Switch axe audit', () => {
  const mountedWrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mountedWrappers.forEach(w => w.unmount())
    mountedWrappers.length = 0
  })

  it('Axe Test 1: Standalone Switch with aria-label passes axe', async () => {
    const wrapper = mount(Switch, {
      props: { modelValue: false, 'aria-label': 'Enable notifications' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('Axe Test 2: Disabled Switch passes axe', async () => {
    const wrapper = mount(Switch, {
      props: { modelValue: false, disabled: true, 'aria-label': 'Unavailable option' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
