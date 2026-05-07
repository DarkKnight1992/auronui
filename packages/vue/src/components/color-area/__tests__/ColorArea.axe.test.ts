import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import ColorArea from '../ColorArea.vue'

describe('ColorArea axe audit', () => {
  const mountedWrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mountedWrappers.forEach(w => w.unmount())
    mountedWrappers.length = 0
    document.body.innerHTML = ''
  })

  it('A1: defaultValue=#ff0000 — zero violations', async () => {
    const wrapper = mount(ColorArea, {
      props: { defaultValue: '#ff0000', 'aria-label': 'Color area' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('A2: disabled=true — zero violations', async () => {
    const wrapper = mount(ColorArea, {
      props: { defaultValue: '#ff0000', disabled: true, 'aria-label': 'Color area' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('A3: with aria-label="Color area" — zero violations', async () => {
    const wrapper = mount(ColorArea, {
      props: { defaultValue: '#ff0000', 'aria-label': 'Color area' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
