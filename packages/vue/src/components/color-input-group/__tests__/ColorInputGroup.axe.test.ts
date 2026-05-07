import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import ColorInputGroup from '../ColorInputGroup.vue'

const mountedWrappers: ReturnType<typeof mount>[] = []

afterEach(() => {
  mountedWrappers.forEach((w) => w.unmount())
  mountedWrappers.length = 0
})

describe('ColorInputGroup axe audit', () => {
  it('A1: with label — zero violations', async () => {
    const wrapper = mount(ColorInputGroup, {
      props: { label: 'Background color', defaultValue: '#ff0000' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('A2: with errorMessage — zero violations', async () => {
    const wrapper = mount(ColorInputGroup, {
      props: { label: 'Background color', defaultValue: '#ff0000', errorMessage: 'Invalid color' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
