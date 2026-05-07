import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import axe from 'axe-core'
import { CalendarDate } from '@internationalized/date'
import DatePicker from '../DatePicker.vue'

// Polyfill ResizeObserver for jsdom
beforeEach(() => {
  ;(globalThis as any).ResizeObserver = function ResizeObserver(
    _callback: ResizeObserverCallback
  ) {
    return {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }
  }
  window.HTMLElement.prototype.scrollIntoView = () => {}
})

// axe rules to disable in test environment:
// - region: components mounted directly on body without a <main> landmark fail this rule.
//   This is a test artifact, not a real accessibility issue in a real app context.
const AXE_OPTIONS: axe.RunOptions = {
  rules: {
    region: { enabled: false },
  },
}

describe('DatePicker - Accessibility', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  // Test 10a: Axe audit zero violations with popover closed
  it('has zero axe violations in closed state', async () => {
    const wrapper = mount(DatePicker, {
      props: { label: 'Pick a date' },
      attachTo: document.body,
    })
    await nextTick()
    const results = await axe.run(document.body, AXE_OPTIONS)
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })

  // Test 10b: Axe audit zero violations with popover open
  it('has zero axe violations with popover open', async () => {
    const wrapper = mount(DatePicker, {
      props: {
        label: 'Pick a date',
        open: true,
        defaultValue: new CalendarDate(2024, 6, 15),
      },
      attachTo: document.body,
    })
    await nextTick()
    const results = await axe.run(document.body, AXE_OPTIONS)
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })
})
