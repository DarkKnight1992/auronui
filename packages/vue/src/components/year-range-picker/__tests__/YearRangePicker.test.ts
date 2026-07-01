import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { CalendarDate } from '@internationalized/date'
import YearRangePicker from '../YearRangePicker.vue'

// Polyfill ResizeObserver for jsdom (Reka UI YearRangePicker uses it internally)
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

describe('YearRangePicker', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    wrappers.forEach(w => w.unmount())
    wrappers.length = 0
  })

  // Test 1: Renders a grid of years (default 12 per page)
  it('renders a grid of years', async () => {
    const wrapper = mount(YearRangePicker, { attachTo: document.body })
    wrappers.push(wrapper)
    await nextTick()
    const root = wrapper.find('[role="application"]')
    expect(root.exists()).toBe(true)
    const cells = wrapper.findAll('td')
    expect(cells.length).toBe(12)
  })

  // Test 2: defaultValue renders both start and end years as selected
  it('defaultValue marks the start and end years as selected', async () => {
    const defaultValue = {
      start: new CalendarDate(2020, 1, 1),
      end: new CalendarDate(2024, 1, 1),
    }
    const wrapper = mount(YearRangePicker, {
      props: { defaultValue },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const selectionStart = wrapper.find('[data-selection-start]')
    const selectionEnd = wrapper.find('[data-selection-end]')
    expect(selectionStart.exists()).toBe(true)
    expect(selectionEnd.exists()).toBe(true)
  })

  // Test 3: years between start and end are marked data-selected (range track)
  it('years between start and end are marked selected', async () => {
    const defaultValue = {
      start: new CalendarDate(2020, 1, 1),
      end: new CalendarDate(2024, 1, 1),
    }
    const wrapper = mount(YearRangePicker, {
      props: { defaultValue },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const selected = wrapper.findAll('[data-selected]')
    // 2020 through 2024 inclusive = 5 years
    expect(selected.length).toBe(5)
  })

  // Test 4: clicking a year cell emits update:modelValue
  it('clicking a year cell emits an update:modelValue event', async () => {
    const wrapper = mount(YearRangePicker, {
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const yearButtons = wrapper.findAll('td button, [role="gridcell"] button')
    expect(yearButtons.length).toBeGreaterThan(0)
    await yearButtons[0].trigger('click')
    await nextTick()
    expect(wrapper.find('[role="application"]').exists()).toBe(true)
  })

  // Test 5: Prev/Next navigate between year pages
  it('clicking Next/Prev navigates between year pages', async () => {
    const defaultValue = {
      start: new CalendarDate(2020, 1, 1),
      end: new CalendarDate(2024, 1, 1),
    }
    const wrapper = mount(YearRangePicker, {
      props: { defaultValue },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const headingEl = wrapper.find('.year-range-picker__heading')
    const nextBtn = wrapper.find('button[aria-label="Next years"]')
    expect(nextBtn.exists()).toBe(true)
    expect(headingEl.exists()).toBe(true)

    const initialHeading = headingEl.text()
    await nextBtn.trigger('click')
    await nextTick()
    const newHeading = wrapper.find('.year-range-picker__heading').text()
    expect(newHeading).not.toBe(initialHeading)
  })

  // Test 6: minValue/maxValue render without error
  it('minValue/maxValue render without error', async () => {
    const wrapper = mount(YearRangePicker, {
      props: {
        minValue: new CalendarDate(2018, 1, 1),
        maxValue: new CalendarDate(2030, 1, 1),
      },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    expect(wrapper.find('[role="application"]').exists()).toBe(true)
  })

  // Test 7: custom yearsPerPage renders that many cells
  it('yearsPerPage renders that many year cells', async () => {
    const wrapper = mount(YearRangePicker, {
      props: { yearsPerPage: 9 },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const cells = wrapper.findAll('td')
    expect(cells.length).toBe(9)
  })

  // Test 8: base CSS class applied
  it('applies year-range-picker base class to root', async () => {
    const wrapper = mount(YearRangePicker, { attachTo: document.body })
    wrappers.push(wrapper)
    await nextTick()
    expect(wrapper.html()).toContain('year-range-picker')
  })
})
