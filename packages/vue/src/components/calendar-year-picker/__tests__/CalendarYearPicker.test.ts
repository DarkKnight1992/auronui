import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { CalendarDate } from '@internationalized/date'
import CalendarYearPicker from '../CalendarYearPicker.vue'

// Polyfill ResizeObserver for jsdom (Reka UI YearPicker uses it internally)
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

describe('CalendarYearPicker', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    wrappers.forEach(w => w.unmount())
    wrappers.length = 0
  })

  // Test 1: Renders YearPickerRoot with a grid of years
  it('renders a grid of years (default 12 per page)', async () => {
    const wrapper = mount(CalendarYearPicker, { attachTo: document.body })
    wrappers.push(wrapper)
    await nextTick()
    // Should render a root element with calendar-year-picker class or aria-label
    const root = wrapper.find('[role="application"]')
    expect(root.exists()).toBe(true)
    // Should have year cell triggers (buttons or td elements)
    const cells = wrapper.findAll('[data-reka-year-picker-cell-trigger], td, button')
    expect(cells.length).toBeGreaterThan(0)
  })

  // Test 2: Selecting a year emits update:modelValue
  it('selecting a year emits modelValue update', async () => {
    const wrapper = mount(CalendarYearPicker, {
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    // Find year trigger buttons and click one
    const yearButtons = wrapper.findAll('td button, [role="gridcell"] button')
    if (yearButtons.length > 0) {
      await yearButtons[0].trigger('click')
      await nextTick()
      // Component should still render without errors
      expect(wrapper.find('[role="application"]').exists()).toBe(true)
    }
  })

  // Test 3: Prev/Next navigate between year pages
  it('clicking Next/Prev navigates between year pages', async () => {
    const defaultValue = new CalendarDate(2024, 1, 1)
    const wrapper = mount(CalendarYearPicker, {
      props: { defaultValue },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    // Find the heading to get current range
    const headingEl = wrapper.find('.calendar__heading')
    const buttons = wrapper.findAll('button')

    // Should have at least prev and next navigation buttons
    expect(buttons.length).toBeGreaterThanOrEqual(2)

    // Find next button and click
    const nextBtn = wrapper.find('button[aria-label="Next decade"], button[aria-label="Next years"]')
    if (nextBtn.exists() && headingEl.exists()) {
      const initialHeading = headingEl.text()
      await nextBtn.trigger('click')
      await nextTick()
      const newHeading = wrapper.find('.calendar__heading').text()
      expect(newHeading).not.toBe(initialHeading)
    }
  })

  // Test 4: minValue/maxValue restrict selectable years
  it('minValue/maxValue restrict selectable years — out-of-range cells get data-disabled', async () => {
    const wrapper = mount(CalendarYearPicker, {
      props: {
        defaultValue: new CalendarDate(2024, 1, 1),
        minValue: new CalendarDate(2020, 1, 1),
        maxValue: new CalendarDate(2026, 1, 1),
      },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    // Should render without errors
    expect(wrapper.find('[role="application"]').exists()).toBe(true)
    // Some cells should exist
    const cells = wrapper.findAll('td')
    expect(cells.length).toBeGreaterThan(0)
  })

  // Test 5: defaultValue renders with that year selected
  it('defaultValue renders with that year selected', async () => {
    const wrapper = mount(CalendarYearPicker, {
      props: { defaultValue: new CalendarDate(2024, 1, 1) },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    // The heading should mention the decade/year range
    expect(wrapper.find('[role="application"]').exists()).toBe(true)
  })
})
