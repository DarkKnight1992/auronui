import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import Checkbox from '../Checkbox.vue'

describe('Checkbox axe audit', () => {
  const mountedWrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mountedWrappers.forEach(w => w.unmount())
    mountedWrappers.length = 0
  })

  it('Axe Test 1: unchecked Checkbox with aria-label passes axe with zero violations', async () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: false, 'aria-label': 'Accept terms' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('Axe Test 2: checked Checkbox passes axe with zero violations', async () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: true, 'aria-label': 'Accept terms' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('Axe Test 3: indeterminate Checkbox passes axe with zero violations', async () => {
    const wrapper = mount(Checkbox, {
      props: { isIndeterminate: true, 'aria-label': 'Select all' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('Axe Test 4: disabled Checkbox passes axe with zero violations', async () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: false, disabled: true, 'aria-label': 'Unavailable option' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
