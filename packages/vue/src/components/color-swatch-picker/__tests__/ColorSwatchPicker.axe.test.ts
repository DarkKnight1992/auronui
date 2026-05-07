import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import ColorSwatchPicker from '../ColorSwatchPicker.vue'

const mountedWrappers: ReturnType<typeof mount>[] = []

afterEach(() => {
  mountedWrappers.forEach((w) => w.unmount())
  mountedWrappers.length = 0
})

const palette = ['#ff0000', '#ff6b00', '#ffcc00', '#00cc44', '#0055ff', '#aa00ff']

describe('ColorSwatchPicker axe audit', () => {
  it('A1: 6-color palette with aria-label — zero violations', async () => {
    const wrapper = mount(ColorSwatchPicker, {
      props: { colors: palette, 'aria-label': 'Swatches' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('A2: with selection — zero violations', async () => {
    const wrapper = mount(ColorSwatchPicker, {
      props: { colors: palette, defaultValue: '#ff0000', 'aria-label': 'Color swatches' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    await new Promise((r) => setTimeout(r, 50))
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
