import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import ColorSwatch from '../ColorSwatch.vue'

const mountedWrappers: ReturnType<typeof mount>[] = []

afterEach(() => {
  mountedWrappers.forEach((w) => w.unmount())
  mountedWrappers.length = 0
})

describe('ColorSwatch axe audit', () => {
  it('A1: with color and colorName — zero violations', async () => {
    const wrapper = mount(ColorSwatch, {
      props: { color: '#ff0000', colorName: 'Red' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('A2: without colorName — zero violations', async () => {
    const wrapper = mount(ColorSwatch, {
      props: { color: '#ff0000' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
