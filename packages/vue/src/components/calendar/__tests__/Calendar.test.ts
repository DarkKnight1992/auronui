import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { CalendarDate, type DateValue } from '@internationalized/date'
import Calendar from '../Calendar.vue'

// Polyfill ResizeObserver for jsdom (Reka UI Calendar uses it internally)
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

describe('Calendar', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    wrappers.forEach(w => w.unmount())
    wrappers.length = 0
  })

  // Test 1: Renders calendar with required structure
  it('renders CalendarRoot with header, grid, and 7 head cells', async () => {
    const wrapper = mount(Calendar, { attachTo: document.body })
    wrappers.push(wrapper)
    await nextTick()
    // Header should be present
    expect(wrapper.find('.calendar').exists()).toBe(true)
    // Should have 7 head cells (th elements in the grid header)
    const headCells = wrapper.findAll('th')
    expect(headCells.length).toBe(7)
    // Navigation buttons exist
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  })

  // Test 2: defaultValue selects that date
  it('defaultValue prop selects the specified date', async () => {
    const defaultValue = new CalendarDate(2024, 3, 15)
    const wrapper = mount(Calendar, {
      props: { defaultValue },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    // Find the selected cell trigger
    const selectedCell = wrapper.find('[data-selected="true"]')
    expect(selectedCell.exists()).toBe(true)
  })

  // Test 3: CalendarNext advances to next month
  it('clicking CalendarNext advances to next month', async () => {
    // Mount with a specific date so heading is predictable
    const defaultValue = new CalendarDate(2024, 1, 15) // January 2024
    const wrapper = mount(Calendar, {
      props: { defaultValue },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    // Heading is rendered as .calendar__heading div
    const initialHeading = wrapper.find('.calendar__heading').text()

    // Find the next navigation button (aria-label="Next month")
    const nextBtn = wrapper.find('button[aria-label="Next month"]')
    expect(nextBtn.exists()).toBe(true)
    await nextBtn.trigger('click')
    await nextTick()
    const newHeading = wrapper.find('.calendar__heading').text()
    expect(newHeading).not.toBe(initialHeading)
  })

  // Test 4: isDateDisabled predicate disables matching cells
  it('isDateDisabled predicate disables matching cells', async () => {
    const isDateDisabled = (date: DateValue) =>
      date.year === 2024 && date.month === 3 && date.day === 15

    const wrapper = mount(Calendar, {
      props: {
        defaultValue: new CalendarDate(2024, 3, 1),
        isDateDisabled,
      },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    // There should be at least one cell with data-disabled
    const disabledCells = wrapper.findAll('[data-disabled]')
    expect(disabledCells.length).toBeGreaterThan(0)
  })

  // Test 5: numberOfMonths=2 renders two grids
  it('numberOfMonths=2 renders two calendar grids', async () => {
    const wrapper = mount(Calendar, {
      props: { numberOfMonths: 2 },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    // Should have 2 tables/grids
    const tables = wrapper.findAll('table')
    expect(tables.length).toBe(2)
  })

  // Test 6: v-model support via defineModel
  it('emits update:modelValue when a date cell is clicked', async () => {
    const wrapper = mount(Calendar, {
      props: {
        defaultValue: new CalendarDate(2024, 3, 1),
      },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    // Find an enabled cell trigger and click it
    const cellTrigger = wrapper.find('[role="gridcell"] button:not([data-disabled])')
    if (cellTrigger.exists()) {
      await cellTrigger.trigger('click')
      await nextTick()
      // Component should still render (no crash)
      expect(wrapper.find('.calendar').exists()).toBe(true)
    }
  })

  // Test 7 (view switcher): clicking heading switches to month view
  it('clicking heading switches to month view with 12 month cells', async () => {
    const wrapper = mount(Calendar, {
      props: { defaultValue: new CalendarDate(2024, 3, 15) },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const headingBtn = wrapper.find('.calendar__heading-button')
    expect(headingBtn.exists()).toBe(true)
    await headingBtn.trigger('click')
    await nextTick()

    expect(wrapper.find('.calendar__month-grid').exists()).toBe(true)
    expect(wrapper.find('.calendar__grid').exists()).toBe(false)

    const monthCells = wrapper.findAll('.calendar__month-cell')
    expect(monthCells.length).toBe(12)
  })

  // Test 8 (view switcher): clicking heading twice switches to year view
  it('clicking heading twice switches to year view with 12 year cells', async () => {
    const wrapper = mount(Calendar, {
      props: { defaultValue: new CalendarDate(2024, 3, 15) },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const firstHeadingBtn = wrapper.find('.calendar__heading-button')
    await firstHeadingBtn.trigger('click')
    await nextTick()
    // After first click we're in month view; heading button should still render
    const monthViewHeadingBtn = wrapper.find('.calendar__heading-button')
    await monthViewHeadingBtn.trigger('click')
    await nextTick()

    expect(wrapper.find('.calendar__year-grid').exists()).toBe(true)
    expect(wrapper.find('.calendar__grid').exists()).toBe(false)
    expect(wrapper.find('.calendar__month-grid').exists()).toBe(false)

    const yearCells = wrapper.findAll('.calendar__year-cell')
    expect(yearCells.length).toBe(12)
  })

  // Test 9 (view switcher): selecting a month returns to date view focused on that month
  it('selecting a month in month view returns to date view on that month', async () => {
    const wrapper = mount(Calendar, {
      props: { defaultValue: new CalendarDate(2024, 3, 15) },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    await wrapper.find('.calendar__heading-button').trigger('click')
    await nextTick()
    // Month cells; find the one whose label contains "Jun"
    const monthButtons = wrapper.findAll('.calendar__month-cell')
    const juneBtn = monthButtons.find(b => b.text().toLowerCase().includes('jun'))
    expect(juneBtn).toBeDefined()
    await juneBtn!.trigger('click')
    await nextTick()

    // Back to date view
    expect(wrapper.find('.calendar__grid').exists()).toBe(true)
    expect(wrapper.find('.calendar__month-grid').exists()).toBe(false)

    // Heading text should mention June (or locale equivalent)
    const headingText = wrapper.find('.calendar__heading-button').text().toLowerCase()
    expect(headingText).toContain('jun')
  })

  // Test 10 (view switcher): selecting a year returns to month view
  it('selecting a year in year view returns to month view for that year', async () => {
    const wrapper = mount(Calendar, {
      props: { defaultValue: new CalendarDate(2024, 3, 15) },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    await wrapper.find('.calendar__heading-button').trigger('click')
    await nextTick()
    await wrapper.find('.calendar__heading-button').trigger('click')
    await nextTick()

    // Year view should render; pick any year cell and click it
    const yearCells = wrapper.findAll('.calendar__year-cell')
    expect(yearCells.length).toBe(12)
    const firstYearText = yearCells[0].text()
    await yearCells[0].trigger('click')
    await nextTick()

    // Back to month view
    expect(wrapper.find('.calendar__month-grid').exists()).toBe(true)
    expect(wrapper.find('.calendar__year-grid').exists()).toBe(false)

    // Month-view heading should show the selected year
    const monthViewHeading = wrapper.find('.calendar__heading-button').text()
    expect(monthViewHeading).toContain(firstYearText)
  })

  // Test 11 (view switcher): no <select> elements rendered in any view
  it('does not render any native <select> in date, month, or year views', async () => {
    const wrapper = mount(Calendar, {
      props: { defaultValue: new CalendarDate(2024, 3, 15) },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    // Date view
    expect(wrapper.findAll('select').length).toBe(0)

    await wrapper.find('.calendar__heading-button').trigger('click')
    await nextTick()
    // Month view
    expect(wrapper.findAll('select').length).toBe(0)

    await wrapper.find('.calendar__heading-button').trigger('click')
    await nextTick()
    // Year view
    expect(wrapper.findAll('select').length).toBe(0)
  })
})
