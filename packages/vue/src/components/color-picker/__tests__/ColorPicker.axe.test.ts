import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import ColorPicker from '../ColorPicker.vue'

// ResizeObserver polyfill needed for ColorSlider -> SliderRoot -> useSize
beforeEach(() => {
  if (!('ResizeObserver' in globalThis)) {
    globalThis.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  }
})

describe('ColorPicker Axe', () => {
  const mounted: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mounted.forEach(w => w.unmount())
    mounted.length = 0
    document.body.innerHTML = ''
  })

  it('A1: defaultValue=#ff0000 with label — zero violations', async () => {
    const wrapper = mount(ColorPicker, {
      props: {
        defaultValue: '#ff0000',
        label: 'Color picker',
      },
      attachTo: document.body,
    })
    mounted.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('A2: disabled=true — zero violations', async () => {
    const wrapper = mount(ColorPicker, {
      props: {
        defaultValue: '#ff0000',
        label: 'Color picker',
        disabled: true,
      },
      attachTo: document.body,
    })
    mounted.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('A3: format=hsl with label — zero violations', async () => {
    const wrapper = mount(ColorPicker, {
      props: {
        defaultValue: '#00ff00',
        format: 'hsl',
        label: 'HSL color picker',
      },
      attachTo: document.body,
    })
    mounted.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
