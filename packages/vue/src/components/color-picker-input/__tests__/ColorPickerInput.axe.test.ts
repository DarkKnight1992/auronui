import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import ColorPickerInput from '../ColorPickerInput.vue'

// ResizeObserver polyfill needed for Reka UI's Popover -> useSize
beforeEach(() => {
  if (!('ResizeObserver' in globalThis)) {
    globalThis.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  }
})

// axe rules to disable in the test environment:
// - region: components mounted directly on body without a <main> landmark fail this rule.
//   This is a test artifact, not a real accessibility issue in a real app context.
const AXE_OPTIONS: axe.RunOptions = {
  rules: {
    region: { enabled: false },
  },
}

describe('ColorPickerInput Axe', () => {
  const mounted: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mounted.forEach(w => w.unmount())
    mounted.length = 0
    document.body.innerHTML = ''
  })

  it('A1: closed, with label — zero violations', async () => {
    const wrapper = mount(ColorPickerInput, {
      props: { defaultValue: '#ff0000', label: 'Accent color' },
      attachTo: document.body,
    })
    mounted.push(wrapper)
    const results = await axe.run(document.body, AXE_OPTIONS)
    expect(results).toHaveNoViolations()
  })

  it('A2: open, with label — zero violations', async () => {
    const wrapper = mount(ColorPickerInput, {
      props: { defaultValue: '#ff0000', label: 'Accent color', open: true },
      attachTo: document.body,
    })
    mounted.push(wrapper)
    const results = await axe.run(document.body, AXE_OPTIONS)
    expect(results).toHaveNoViolations()
  })

  it('A3: disabled=true — zero violations', async () => {
    const wrapper = mount(ColorPickerInput, {
      props: { defaultValue: '#ff0000', label: 'Accent color', isDisabled: true },
      attachTo: document.body,
    })
    mounted.push(wrapper)
    const results = await axe.run(document.body, AXE_OPTIONS)
    expect(results).toHaveNoViolations()
  })
})
