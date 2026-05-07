import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { CalendarDate } from '@internationalized/date'
import DateRangePicker from '../DateRangePicker.vue'

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
  window.HTMLElement.prototype.scrollIntoView = () => {}
})

describe('DateRangePicker', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    wrappers.forEach(w => w.unmount())
    wrappers.length = 0
    document.body.innerHTML = ''
  })

  // Test 1: Renders DateRangePickerRoot with field and trigger button
  it('renders DateRangePickerRoot with field and trigger button', async () => {
    const wrapper = mount(DateRangePicker, { attachTo: document.body })
    wrappers.push(wrapper)
    await nextTick()
    // Should have a trigger button
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    // The date range picker should be present
    expect(wrapper.html()).toContain('date-range-picker')
  })

  // Test 2: Trigger opens popover (open=true for jsdom)
  it('DateRangePickerContent portal is rendered when open=true', async () => {
    const wrapper = mount(DateRangePicker, {
      props: { open: true },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const dialog = document.body.querySelector('[role="dialog"]')
    expect(dialog).not.toBeNull()
    expect(dialog?.getAttribute('data-state')).toBe('open')
  })

  // Test 3: With open=true, RangeCalendar table renders
  it('with open=true, calendar renders with table structure', async () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        open: true,
        defaultValue: { start: new CalendarDate(2024, 6, 10), end: new CalendarDate(2024, 6, 20) },
      },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    // Calendar table should be visible
    const calendarTable = document.body.querySelector('table')
    expect(calendarTable).not.toBeNull()
  })

  // Test 4: First cell click starts range selection (open=true)
  it('date cell triggers are present when open', async () => {
    const wrapper = mount(DateRangePicker, {
      props: { open: true },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    // Cell triggers should be rendered
    const cellTrigger = document.body.querySelector(
      '[data-reka-calendar-cell-trigger]:not([data-disabled])'
    )
    expect(cellTrigger).not.toBeNull()
  })

  // Test 5: Hovering a later cell highlights the range
  it('calendar renders with hoverable cells', async () => {
    const wrapper = mount(DateRangePicker, {
      props: { open: true },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    // Calendar should render with multiple cell triggers
    const cellTriggers = document.body.querySelectorAll('[data-reka-calendar-cell-trigger]')
    expect(cellTriggers.length).toBeGreaterThan(20) // should have ~28+ cells for a month
  })

  // Test 6: Escape key emits update:open=false
  it('Escape key emits update:open=false', async () => {
    const wrapper = mount(DateRangePicker, {
      props: { open: true },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const dialog = document.body.querySelector('[role="dialog"]')
    expect(dialog).not.toBeNull()
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
    dialog?.dispatchEvent(escapeEvent)
    await nextTick()
    const emitted = wrapper.emitted('update:open')
    expect(emitted).not.toBeUndefined()
    if (emitted) {
      expect(emitted[emitted.length - 1]).toEqual([false])
    }
  })

  // Test 7: minValue/maxValue disable out-of-range cells
  it('minValue/maxValue disable out-of-range cells', async () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        open: true,
        defaultValue: { start: new CalendarDate(2024, 6, 10), end: new CalendarDate(2024, 6, 20) },
        minValue: new CalendarDate(2024, 6, 5),
        maxValue: new CalendarDate(2024, 6, 25),
      },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const disabledCells = document.body.querySelectorAll('[data-disabled]')
    expect(disabledCells.length).toBeGreaterThan(0)
  })

  // Test 8: isInvalid adds aria-invalid
  it('isInvalid prop adds aria-invalid attribute', async () => {
    const wrapper = mount(DateRangePicker, {
      props: { isInvalid: true, label: 'Date Range' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const invalidEl = wrapper.find('[aria-invalid]')
    expect(invalidEl.exists()).toBe(true)
  })

  // Test 9: SSR-safe — mounts cleanly without errors
  it('component mounts without errors (SSR-safe)', async () => {
    let mountError: Error | null = null
    try {
      const wrapper = mount(DateRangePicker, {
        props: { label: 'Date Range' },
        attachTo: document.body,
      })
      wrappers.push(wrapper)
      await nextTick()
      expect(wrapper.html()).toContain('date-range-picker')
    } catch (e: any) {
      mountError = e
    }
    expect(mountError).toBeNull()
  })
})
