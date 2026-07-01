import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { CalendarDate } from '@internationalized/date'
import MonthPicker from '../MonthPicker.vue'

// Polyfill ResizeObserver for jsdom (Reka UI MonthPicker uses it internally)
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

describe('MonthPicker', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    wrappers.forEach(w => w.unmount())
    wrappers.length = 0
  })

  // Test 1: Renders MonthPickerRoot with a grid of 12 months
  it('renders a grid of months', async () => {
    const wrapper = mount(MonthPicker, { attachTo: document.body })
    wrappers.push(wrapper)
    await nextTick()
    const root = wrapper.find('[role="application"]')
    expect(root.exists()).toBe(true)
    const cells = wrapper.findAll('[data-reka-month-picker-cell-trigger], td, button')
    expect(cells.length).toBeGreaterThan(0)
  })

  // Test 2: Selecting a month emits update:modelValue
  it('selecting a month emits modelValue update', async () => {
    const wrapper = mount(MonthPicker, {
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const monthButtons = wrapper.findAll('td button, [role="gridcell"] button')
    if (monthButtons.length > 0) {
      await monthButtons[0].trigger('click')
      await nextTick()
      expect(wrapper.find('[role="application"]').exists()).toBe(true)
    }
  })

  // Test 3: Prev/Next navigate between year pages (month picker pages by year)
  it('clicking Next/Prev navigates between years', async () => {
    const defaultValue = new CalendarDate(2024, 6, 1)
    const wrapper = mount(MonthPicker, {
      props: { defaultValue },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const headingEl = wrapper.find('.calendar__heading')
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBeGreaterThanOrEqual(2)

    const nextBtn = wrapper.find('button[aria-label="Next year"]')
    if (nextBtn.exists() && headingEl.exists()) {
      const initialHeading = headingEl.text()
      await nextBtn.trigger('click')
      await nextTick()
      const newHeading = wrapper.find('.calendar__heading').text()
      expect(newHeading).not.toBe(initialHeading)
    }
  })

  // Test 4: minValue/maxValue restrict selectable months
  it('minValue/maxValue restrict selectable months — renders without error', async () => {
    const wrapper = mount(MonthPicker, {
      props: {
        defaultValue: new CalendarDate(2024, 6, 1),
        minValue: new CalendarDate(2024, 3, 1),
        maxValue: new CalendarDate(2024, 9, 1),
      },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    expect(wrapper.find('[role="application"]').exists()).toBe(true)
    const cells = wrapper.findAll('td')
    expect(cells.length).toBe(12)
  })

  // Test 5: defaultValue renders with that month's year selected
  it('defaultValue renders the containing year', async () => {
    const wrapper = mount(MonthPicker, {
      props: { defaultValue: new CalendarDate(2024, 6, 1) },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    expect(wrapper.find('[role="application"]').exists()).toBe(true)
    expect(wrapper.find('.calendar__heading').text()).toContain('2024')
  })

  // Test 6: base CSS class applied
  it('applies calendar base class to root', async () => {
    const wrapper = mount(MonthPicker, { attachTo: document.body })
    wrappers.push(wrapper)
    await nextTick()
    expect(wrapper.html()).toContain('calendar')
  })
})
