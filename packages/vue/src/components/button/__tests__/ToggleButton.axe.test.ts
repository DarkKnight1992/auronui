import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import ToggleButton from '../ToggleButton.vue'

describe('ToggleButton axe audit', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    wrappers.forEach(w => w.unmount())
    wrappers.length = 0
  })

  // Test 1: Standalone ToggleButton (unpressed) has zero axe violations
  it('standalone unpressed ToggleButton passes axe', async () => {
    const wrapper = mount(ToggleButton, {
      props: { 'aria-label': 'toggle bold', modelValue: false },
      slots: { default: 'Bold' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results.violations).toEqual([])
  })

  // Test 1 (pressed): Standalone ToggleButton (pressed) has zero axe violations
  it('standalone pressed ToggleButton passes axe', async () => {
    const wrapper = mount(ToggleButton, {
      props: { 'aria-label': 'toggle bold', modelValue: true },
      slots: { default: 'Bold' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results.violations).toEqual([])
  })

  // Test 2: Disabled ToggleButton has zero axe violations
  it('disabled ToggleButton passes axe', async () => {
    const wrapper = mount(ToggleButton, {
      props: { 'aria-label': 'toggle bold', disabled: true },
      slots: { default: 'Bold' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results.violations).toEqual([])
  })

  // Icon-only variant
  it('isIconOnly ToggleButton passes axe', async () => {
    const wrapper = mount(ToggleButton, {
      props: { 'aria-label': 'toggle bold', isIconOnly: true },
      slots: { default: 'B' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results.violations).toEqual([])
  })
})
