import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import ColorField from '../ColorField.vue'

const mountedWrappers: ReturnType<typeof mount>[] = []

afterEach(() => {
  mountedWrappers.forEach((w) => w.unmount())
  mountedWrappers.length = 0
})

describe('ColorField axe audit', () => {
  it('A1: standalone with label — zero violations', async () => {
    const wrapper = mount(ColorField, {
      props: { label: 'Color', defaultValue: '#ff0000' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('A2: disabled with label — zero violations', async () => {
    const wrapper = mount(ColorField, {
      props: { label: 'Color', defaultValue: '#ff0000', disabled: true },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('A3: with errorMessage — zero violations', async () => {
    const wrapper = mount(ColorField, {
      props: { label: 'Color', defaultValue: '#ff0000', errorMessage: 'Invalid color' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
