import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import axe from 'axe-core'
import { CalendarDateTime } from '@internationalized/date'
import DateTimePicker from '../DateTimePicker.vue'

const makeValue = () => new CalendarDateTime(2024, 6, 15, 10, 30)

// Polyfill ResizeObserver and scroll APIs for jsdom
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

// axe rules to disable in test environment:
// - region: components mounted directly on body without a <main> landmark fail this rule.
//   This is a test artifact, not a real accessibility issue in a real app context.
const AXE_OPTIONS: axe.RunOptions = {
  rules: {
    region: { enabled: false },
  },
}

describe('DateTimePicker - Accessibility', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  // Test: Axe audit zero violations in default closed state
  it('has zero axe violations in closed state', async () => {
    const wrapper = mount(DateTimePicker, {
      props: {
        label: 'Pick date & time',
        defaultValue: makeValue(),
      },
      attachTo: document.body,
    })
    await nextTick()
    const results = await axe.run(document.body, AXE_OPTIONS)
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })

  // Test: Axe audit zero violations with popover open
  it('has zero axe violations with popover open', async () => {
    const wrapper = mount(DateTimePicker, {
      props: {
        label: 'Pick date & time',
        defaultOpen: true,
        defaultValue: makeValue(),
      },
      attachTo: document.body,
    })
    await nextTick()
    const results = await axe.run(document.body, AXE_OPTIONS)
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })

  // Test: Axe audit zero violations in invalid state
  it('has zero axe violations in invalid state', async () => {
    const wrapper = mount(DateTimePicker, {
      props: {
        label: 'Pick date & time',
        defaultValue: makeValue(),
        isInvalid: true,
        errorMessage: 'Required',
      },
      attachTo: document.body,
    })
    await nextTick()
    const results = await axe.run(document.body, AXE_OPTIONS)
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })

  // Test: Axe audit zero violations in disabled state
  it('has zero axe violations in disabled state', async () => {
    const wrapper = mount(DateTimePicker, {
      props: {
        label: 'Pick date & time',
        defaultValue: makeValue(),
        isDisabled: true,
      },
      attachTo: document.body,
    })
    await nextTick()
    const results = await axe.run(document.body, AXE_OPTIONS)
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })
})
