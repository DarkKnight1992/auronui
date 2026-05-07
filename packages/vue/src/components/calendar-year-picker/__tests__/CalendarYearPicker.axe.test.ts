import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import axe from 'axe-core'
import { CalendarDate } from '@internationalized/date'
import CalendarYearPicker from '../CalendarYearPicker.vue'

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
})

describe('CalendarYearPicker - Accessibility', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('has zero axe violations in default state', async () => {
    const wrapper = mount(CalendarYearPicker, {
      attachTo: document.body,
    })
    await nextTick()
    const results = await axe.run(wrapper.element)
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })

  it('has zero axe violations with a selected year', async () => {
    const wrapper = mount(CalendarYearPicker, {
      props: { defaultValue: new CalendarDate(2024, 1, 1) },
      attachTo: document.body,
    })
    await nextTick()
    const results = await axe.run(wrapper.element)
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })
})
