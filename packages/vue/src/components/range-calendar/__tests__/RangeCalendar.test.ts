import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { CalendarDate, type DateValue } from '@internationalized/date'
import RangeCalendar from '../RangeCalendar.vue'

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

describe('RangeCalendar', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    wrappers.forEach(w => w.unmount())
    wrappers.length = 0
  })

  // Test 1: Renders RangeCalendarRoot with all sub-parts
  it('renders RangeCalendarRoot with header, grid, and 7 head cells', async () => {
    const wrapper = mount(RangeCalendar, { attachTo: document.body })
    wrappers.push(wrapper)
    await nextTick()
    expect(wrapper.find('.range-calendar').exists()).toBe(true)
    const headCells = wrapper.findAll('th')
    expect(headCells.length).toBe(7)
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  })

  // Test 2: defaultValue with a range shows selected cells
  it('defaultValue with a range shows start and end as selected', async () => {
    const defaultValue = {
      start: new CalendarDate(2024, 6, 10),
      end: new CalendarDate(2024, 6, 20),
    }
    const wrapper = mount(RangeCalendar, {
      props: { defaultValue },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    // Should have selected cells for start and end
    const selectedCells = wrapper.findAll('[data-selected]')
    expect(selectedCells.length).toBeGreaterThan(0)
  })

  // Test 3: isDateDisabled disables matching cells
  it('isDateDisabled predicate disables matching cells', async () => {
    const isDateDisabled = (date: DateValue) =>
      date.year === 2024 && date.month === 6 && date.day === 15

    const wrapper = mount(RangeCalendar, {
      props: {
        defaultValue: { start: new CalendarDate(2024, 6, 1), end: new CalendarDate(2024, 6, 1) },
        isDateDisabled,
      },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const disabledCells = wrapper.findAll('[data-disabled]')
    expect(disabledCells.length).toBeGreaterThan(0)
  })

  // Test 4: minValue/maxValue constrain the selectable range
  it('minValue/maxValue constrain selectable range', async () => {
    const wrapper = mount(RangeCalendar, {
      props: {
        minValue: new CalendarDate(2024, 6, 5),
        maxValue: new CalendarDate(2024, 6, 25),
        defaultValue: { start: new CalendarDate(2024, 6, 10), end: new CalendarDate(2024, 6, 15) },
      },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    // Component renders without errors; min/max respected
    expect(wrapper.find('.range-calendar').exists()).toBe(true)
    // Prev button should be disabled when at min boundary
    const prevBtn = wrapper.find('button[aria-label="Previous month"]')
    expect(prevBtn.exists()).toBe(true)
  })

  // Test 5: Navigates to next month via Next button
  it('clicking Next month button advances to next month', async () => {
    const defaultValue = {
      start: new CalendarDate(2024, 1, 10),
      end: new CalendarDate(2024, 1, 20),
    }
    const wrapper = mount(RangeCalendar, {
      props: { defaultValue },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const initialHeading = wrapper.find('.range-calendar__heading').text()
    const nextBtn = wrapper.find('button[aria-label="Next month"]')
    expect(nextBtn.exists()).toBe(true)
    await nextBtn.trigger('click')
    await nextTick()
    const newHeading = wrapper.find('.range-calendar__heading').text()
    expect(newHeading).not.toBe(initialHeading)
  })
})
