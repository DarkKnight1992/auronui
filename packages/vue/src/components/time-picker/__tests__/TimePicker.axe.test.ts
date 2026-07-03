import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import axe from 'axe-core'
import { Time } from '@internationalized/date'
import TimePicker from '../TimePicker.vue'

const makeValue = () => new Time(10, 30)

beforeEach(() => {
  ;(globalThis as any).ResizeObserver = function ResizeObserver(_cb: ResizeObserverCallback) {
    return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() }
  }
  window.HTMLElement.prototype.scrollIntoView = vi.fn()
  window.HTMLElement.prototype.scroll = vi.fn()
  Object.defineProperty(HTMLElement.prototype, 'scrollTop', {
    configurable: true,
    get: vi.fn().mockReturnValue(0),
    set: vi.fn(),
  })
})

// region: components mounted directly on body without a <main> landmark fail this rule.
// This is a test artifact, not a real accessibility issue in a real app context.
const AXE_OPTIONS: axe.RunOptions = {
  rules: {
    region: { enabled: false },
  },
}

describe('TimePicker - Accessibility', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('has zero axe violations in closed state', async () => {
    const wrapper = mount(TimePicker, {
      props: { label: 'Pick a time', defaultValue: makeValue() },
      attachTo: document.body,
    })
    await nextTick()
    const results = await axe.run(document.body, AXE_OPTIONS)
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })

  it('has zero axe violations with popover open', async () => {
    const wrapper = mount(TimePicker, {
      props: { label: 'Pick a time', defaultOpen: true, defaultValue: makeValue() },
      attachTo: document.body,
    })
    await nextTick()
    const results = await axe.run(document.body, AXE_OPTIONS)
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  }, 15000)

  it('has zero axe violations in invalid state', async () => {
    const wrapper = mount(TimePicker, {
      props: { label: 'Pick a time', defaultValue: makeValue(), isInvalid: true, errorMessage: 'Required' },
      attachTo: document.body,
    })
    await nextTick()
    const results = await axe.run(document.body, AXE_OPTIONS)
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })

  it('has zero axe violations in disabled state', async () => {
    const wrapper = mount(TimePicker, {
      props: { label: 'Pick a time', defaultValue: makeValue(), isDisabled: true },
      attachTo: document.body,
    })
    await nextTick()
    const results = await axe.run(document.body, AXE_OPTIONS)
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })
})
