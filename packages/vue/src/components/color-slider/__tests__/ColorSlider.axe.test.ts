import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import ColorSlider from '../ColorSlider.vue'

// Reka UI ColorSliderRoot uses SliderRoot internally which uses ResizeObserver — polyfill for jsdom
beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(globalThis as any).ResizeObserver = function ResizeObserver(
    _callback: ResizeObserverCallback
  ) {
    return {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }
  }
})

describe('ColorSlider axe audit', () => {
  const mountedWrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mountedWrappers.forEach(w => w.unmount())
    mountedWrappers.length = 0
    document.body.innerHTML = ''
  })

  it('A1: channel=hue — zero violations', async () => {
    const wrapper = mount(ColorSlider, {
      props: { channel: 'hue', defaultValue: '#ff0000' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('A2: channel=alpha — zero violations', async () => {
    const wrapper = mount(ColorSlider, {
      props: { channel: 'alpha', defaultValue: '#ff0000' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it("A3: channel='hue' orientation='vertical' — zero violations", async () => {
    const wrapper = mount(ColorSlider, {
      props: { channel: 'hue', defaultValue: '#ff0000', orientation: 'vertical' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('A4: disabled=true — zero violations', async () => {
    const wrapper = mount(ColorSlider, {
      props: { channel: 'hue', defaultValue: '#ff0000', disabled: true},
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
