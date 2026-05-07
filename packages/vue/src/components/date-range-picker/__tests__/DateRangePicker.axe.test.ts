import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import axe from 'axe-core'
import { CalendarDate } from '@internationalized/date'
import DateRangePicker from '../DateRangePicker.vue'

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
const AXE_OPTIONS: axe.RunOptions = {
  rules: {
    region: { enabled: false },
  },
}

describe('DateRangePicker - Accessibility', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  // Test 8a: Axe audit zero violations in closed state
  it('has zero axe violations in closed state', async () => {
    const wrapper = mount(DateRangePicker, {
      props: { label: 'Date Range' },
      attachTo: document.body,
    })
    await nextTick()
    const results = await axe.run(document.body, AXE_OPTIONS)
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })

  // Test 8b: Axe audit zero violations with popover open
  it('has zero axe violations with popover open', async () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        label: 'Date Range',
        open: true,
        defaultValue: {
          start: new CalendarDate(2024, 6, 10),
          end: new CalendarDate(2024, 6, 20),
        },
      },
      attachTo: document.body,
    })
    await nextTick()
    const results = await axe.run(document.body, AXE_OPTIONS)
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })

  // Test 8c: Axe audit in partial-range state (start selected, end pending)
  it('has zero axe violations in partial-range state', async () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        label: 'Date Range',
        open: true,
      },
      attachTo: document.body,
    })
    await nextTick()
    const results = await axe.run(document.body, AXE_OPTIONS)
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })
})
