import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import axe from 'axe-core'
import { CalendarDate } from '@internationalized/date'
import RangeCalendar from '../RangeCalendar.vue'

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
})

describe('RangeCalendar - Accessibility', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('has zero axe violations in default state', async () => {
    const wrapper = mount(RangeCalendar, { attachTo: document.body })
    await nextTick()
    const results = await axe.run(wrapper.element)
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })

  it('has zero axe violations with a selected range', async () => {
    const wrapper = mount(RangeCalendar, {
      props: {
        defaultValue: {
          start: new CalendarDate(2024, 6, 10),
          end: new CalendarDate(2024, 6, 20),
        },
      },
      attachTo: document.body,
    })
    await nextTick()
    const results = await axe.run(wrapper.element)
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })
})
