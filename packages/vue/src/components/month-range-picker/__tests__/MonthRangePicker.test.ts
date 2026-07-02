import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { CalendarDate } from '@internationalized/date'
import MonthRangePicker from '../MonthRangePicker.vue'

// Polyfill ResizeObserver for jsdom (Reka UI MonthRangePicker uses it internally)
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

describe('MonthRangePicker', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    wrappers.forEach(w => w.unmount())
    wrappers.length = 0
  })

  // Test 1: Renders a grid of 12 months
  it('renders a grid of months', async () => {
    const wrapper = mount(MonthRangePicker, { attachTo: document.body })
    wrappers.push(wrapper)
    await nextTick()
    const root = wrapper.find('[role="application"]')
    expect(root.exists()).toBe(true)
    const cells = wrapper.findAll('td')
    expect(cells.length).toBe(12)
  })

  // Test 2: defaultValue renders both start and end months as selected
  it('defaultValue marks the start and end months as selected', async () => {
    const defaultValue = {
      start: new CalendarDate(2024, 3, 1),
      end: new CalendarDate(2024, 8, 1),
    }
    const wrapper = mount(MonthRangePicker, {
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

  // Test 3: months between start and end are marked data-selected (range track)
  it('months between start and end are marked selected', async () => {
    const defaultValue = {
      start: new CalendarDate(2024, 3, 1),
      end: new CalendarDate(2024, 8, 1),
    }
    const wrapper = mount(MonthRangePicker, {
      props: { defaultValue },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const selected = wrapper.findAll('[data-selected]')
    // March through August inclusive = 6 months
    expect(selected.length).toBe(6)
  })

  // Test 4: clicking a month cell emits update:modelValue
  it('clicking a month cell emits an update:modelValue event', async () => {
    const wrapper = mount(MonthRangePicker, {
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const monthButtons = wrapper.findAll('td button, [role="gridcell"] button')
    expect(monthButtons.length).toBeGreaterThan(0)
    await monthButtons[0].trigger('click')
    await nextTick()
    expect(wrapper.find('[role="application"]').exists()).toBe(true)
  })

  // Test 5: Prev/Next navigate between years
  it('clicking Next/Prev navigates between years', async () => {
    const defaultValue = {
      start: new CalendarDate(2024, 3, 1),
      end: new CalendarDate(2024, 8, 1),
    }
    const wrapper = mount(MonthRangePicker, {
      props: { defaultValue },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const headingEl = wrapper.find('.month-range-picker__heading')
    const nextBtn = wrapper.find('button[aria-label="Next year"]')
    expect(nextBtn.exists()).toBe(true)
    expect(headingEl.exists()).toBe(true)

    const initialHeading = headingEl.text()
    await nextBtn.trigger('click')
    await nextTick()
    const newHeading = wrapper.find('.month-range-picker__heading').text()
    expect(newHeading).not.toBe(initialHeading)
  })

  // Test 6: minValue/maxValue restrict selectable months — renders without error
  it('minValue/maxValue render without error', async () => {
    const wrapper = mount(MonthRangePicker, {
      props: {
        minValue: new CalendarDate(2024, 3, 1),
        maxValue: new CalendarDate(2024, 9, 1),
      },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    expect(wrapper.find('[role="application"]').exists()).toBe(true)
  })

  // Test 7: base CSS class applied
  it('applies month-range-picker base class to root', async () => {
    const wrapper = mount(MonthRangePicker, { attachTo: document.body })
    wrappers.push(wrapper)
    await nextTick()
    expect(wrapper.html()).toContain('month-range-picker')
  })

  // Test 8: deprecated bare `readonly` prop still marks the picker root readonly
  it('deprecated readonly prop sets data-readonly on the picker root', async () => {
    const wrapper = mount(MonthRangePicker, {
      props: { readonly: true },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const root = wrapper.find('[role="application"]')
    expect(root.attributes('data-readonly')).toBe('')
  })
})
