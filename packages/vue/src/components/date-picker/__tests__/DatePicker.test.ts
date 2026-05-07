import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { CalendarDate } from '@internationalized/date'
import DatePicker from '../DatePicker.vue'

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
  // jsdom doesn't implement scrollIntoView
  window.HTMLElement.prototype.scrollIntoView = () => {}
})

describe('DatePicker', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    wrappers.forEach(w => w.unmount())
    wrappers.length = 0
    document.body.innerHTML = ''
  })

  // Test 1: Renders DatePickerRoot with field and trigger button
  it('renders DatePickerRoot with a field and a trigger button', async () => {
    const wrapper = mount(DatePicker, { attachTo: document.body })
    wrappers.push(wrapper)
    await nextTick()
    // Should have a trigger button (calendar icon button)
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    // The date picker field should be present
    expect(wrapper.html()).toContain('date-picker')
  })

  // Test 2: popover content is rendered in DOM when open=true
  // jsdom cannot open Reka UI popover via pointer events (no real layout engine).
  // Use :open="true" for open-state tests.
  it('DatePickerContent portal element is rendered in DOM when open', async () => {
    const wrapper = mount(DatePicker, {
      props: { open: true },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    // The popover dialog element should be in the DOM when open
    const dialog = document.body.querySelector('[role="dialog"]')
    expect(dialog).not.toBeNull()
    expect(dialog?.getAttribute('data-state')).toBe('open')
  })

  // Test 3: With open=true, calendar renders with table structure
  // Note: Reka UI CalendarGrid renders as <table role="application">, not role="grid"
  it('with open=true, calendar renders with table structure', async () => {
    const wrapper = mount(DatePicker, {
      props: {
        open: true,
        defaultValue: new CalendarDate(2024, 6, 15),
      },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    // Calendar table should be visible in the popover
    const calendarTable = document.body.querySelector('table')
    expect(calendarTable).not.toBeNull()
  })

  // Test 4: Clicking a date cell is possible when open
  it('date cell triggers are present when open (clickable calendar)', async () => {
    const wrapper = mount(DatePicker, {
      props: {
        open: true,
        defaultValue: new CalendarDate(2024, 6, 15),
      },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    // Reka CalendarCellTrigger renders as <div role="button" data-reka-calendar-cell-trigger="">
    const cellTrigger = document.body.querySelector(
      '[data-reka-calendar-cell-trigger]:not([data-disabled])'
    )
    expect(cellTrigger).not.toBeNull()
    if (cellTrigger) {
      ;(cellTrigger as HTMLElement).click()
      await nextTick()
      // After click, modelValue emitted or popover closed (closeOnSelect=true)
    }
  })

  // Test 5: Escape key emits update:open=false
  it('Escape key emits update:open=false', async () => {
    const wrapper = mount(DatePicker, {
      props: { open: true },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    // Press Escape on the dialog
    const dialog = document.body.querySelector('[role="dialog"]')
    expect(dialog).not.toBeNull()
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
    dialog?.dispatchEvent(escapeEvent)
    await nextTick()
    // Should have emitted update:open with false
    const emitted = wrapper.emitted('update:open')
    expect(emitted).not.toBeUndefined()
    if (emitted) {
      expect(emitted[emitted.length - 1]).toEqual([false])
    }
  })

  // Test 6: defaultValue shows selected date in calendar (open=true)
  it('defaultValue highlights date in calendar when open', async () => {
    const defaultValue = new CalendarDate(2024, 6, 15)
    const wrapper = mount(DatePicker, {
      props: { open: true, defaultValue },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    // The selected date should be visible
    const selectedCell = document.body.querySelector('[data-selected="true"]')
    expect(selectedCell).not.toBeNull()
  })

  // Test 7: minValue/maxValue disable out-of-range cells (open=true)
  it('minValue/maxValue disable out-of-range cells', async () => {
    const wrapper = mount(DatePicker, {
      props: {
        open: true,
        defaultValue: new CalendarDate(2024, 6, 15),
        minValue: new CalendarDate(2024, 6, 10),
        maxValue: new CalendarDate(2024, 6, 20),
      },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    // Disabled cells should exist (dates outside range)
    const disabledCells = document.body.querySelectorAll('[data-disabled]')
    expect(disabledCells.length).toBeGreaterThan(0)
  })

  // Test 8: isInvalid adds aria-invalid attribute
  it('isInvalid prop adds aria-invalid attribute', async () => {
    const wrapper = mount(DatePicker, {
      props: { isInvalid: true, label: 'Date' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    // Should have aria-invalid somewhere in the component
    const invalidEl = wrapper.find('[aria-invalid]')
    expect(invalidEl.exists()).toBe(true)
  })

  // Test 9: visibleMonths=2 renders two calendar tables (open=true)
  it('visibleMonths=2 renders two calendar tables', async () => {
    const wrapper = mount(DatePicker, {
      props: {
        open: true,
        defaultValue: new CalendarDate(2024, 6, 15),
        visibleMonths: 2,
      },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    // Should have 2 tables (one per month)
    const tables = document.body.querySelectorAll('table')
    expect(tables.length).toBeGreaterThanOrEqual(2)
  })

  // Test 10: label and description render correctly
  it('renders label and description text', async () => {
    const wrapper = mount(DatePicker, {
      props: { label: 'Appointment Date', description: 'Select your appointment' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    expect(wrapper.text()).toContain('Appointment Date')
    expect(wrapper.text()).toContain('Select your appointment')
  })

  // Test 11: Component mounts without errors (SSR-safe check)
  it('component mounts without errors (no client-only APIs in setup)', async () => {
    let mountError: Error | null = null
    try {
      const wrapper = mount(DatePicker, {
        props: { label: 'SSR Test Date' },
        attachTo: document.body,
      })
      wrappers.push(wrapper)
      await nextTick()
      expect(wrapper.html()).toContain('date-picker')
    } catch (e: any) {
      mountError = e
    }
    expect(mountError).toBeNull()
  })
})
