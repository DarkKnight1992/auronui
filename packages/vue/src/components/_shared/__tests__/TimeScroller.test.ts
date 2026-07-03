import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { CalendarDateTime, Time } from '@internationalized/date'
import TimeScroller from '../TimeScroller.vue'

beforeEach(() => {
  ;(globalThis as any).ResizeObserver = function ResizeObserver(_cb: ResizeObserverCallback) {
    return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() }
  }
  window.HTMLElement.prototype.scrollIntoView = vi.fn()
  window.HTMLElement.prototype.scroll = vi.fn()
  Object.defineProperty(HTMLElement.prototype, 'scrollTop', {
    configurable: true,
    get: vi.fn().mockReturnValue(0),
    set: vi.fn(),
  })
})

describe('TimeScroller — CalendarDateTime value', () => {
  afterEach(() => { document.body.innerHTML = '' })

  it('renders hour and minute columns for granularity=minute', async () => {
    const value = new CalendarDateTime(2024, 6, 15, 10, 30)
    const wrapper = mount(TimeScroller, {
      props: { modelValue: value, granularity: 'minute', hourCycle: 24 },
      attachTo: document.body,
    })
    await nextTick()
    const columns = wrapper.findAll('[data-slot="scroller-column"]')
    expect(columns).toHaveLength(2) // hour + minute
  })

  it('renders hour, minute, second columns for granularity=second', async () => {
    const value = new CalendarDateTime(2024, 6, 15, 10, 30, 0)
    const wrapper = mount(TimeScroller, {
      props: { modelValue: value, granularity: 'second', hourCycle: 24 },
      attachTo: document.body,
    })
    await nextTick()
    const columns = wrapper.findAll('[data-slot="scroller-column"]')
    expect(columns).toHaveLength(3) // hour + minute + second
  })

  it('renders AM/PM column for hourCycle=12', async () => {
    const value = new CalendarDateTime(2024, 6, 15, 14, 30)
    const wrapper = mount(TimeScroller, {
      props: { modelValue: value, granularity: 'minute', hourCycle: 12 },
      attachTo: document.body,
    })
    await nextTick()
    const columns = wrapper.findAll('[data-slot="scroller-column"]')
    expect(columns).toHaveLength(3) // hour + minute + AM/PM
  })

  it('emits update:modelValue with the tapped minute, leaving hour unchanged', async () => {
    const value = new CalendarDateTime(2024, 6, 15, 10, 30)
    const wrapper = mount(TimeScroller, {
      props: { modelValue: value, granularity: 'minute', hourCycle: 24 },
      attachTo: document.body,
    })
    await nextTick()

    const minuteCol = wrapper.findAll('[data-slot="scroller-column"]')[1]
    const options = minuteCol.findAll('[role="option"]')
    await options[15].trigger('click')

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    const [newValue] = emitted![0] as [CalendarDateTime]
    expect(newValue.minute).toBe(15)
    expect(newValue.hour).toBe(10)
  })

  it('emits update:modelValue with the tapped hour, leaving minute unchanged', async () => {
    const value = new CalendarDateTime(2024, 6, 15, 10, 30)
    const wrapper = mount(TimeScroller, {
      props: { modelValue: value, granularity: 'minute', hourCycle: 24 },
      attachTo: document.body,
    })
    await nextTick()

    const hourCol = wrapper.findAll('[data-slot="scroller-column"]')[0]
    const options = hourCol.findAll('[role="option"]')
    await options[14].trigger('click')

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    const [newValue] = emitted![0] as [CalendarDateTime]
    expect(newValue.hour).toBe(14)
    expect(newValue.minute).toBe(30)
  })

  it('marks every repeated copy of the selected value as selected', async () => {
    const value = new CalendarDateTime(2024, 6, 15, 10, 30)
    const wrapper = mount(TimeScroller, {
      props: { modelValue: value, granularity: 'minute', hourCycle: 24 },
      attachTo: document.body,
    })
    await nextTick()

    const minuteCol = wrapper.findAll('[data-slot="scroller-column"]')[1]
    const options = minuteCol.findAll('[role="option"]')
    expect(options[30].attributes('aria-selected')).toBe('true')
    expect(options[90].attributes('aria-selected')).toBe('true')
    expect(options[0].attributes('aria-selected')).toBe('false')
  })
})

describe('TimeScroller — Time value (used by TimePicker)', () => {
  afterEach(() => { document.body.innerHTML = '' })

  it('renders correctly and emits update:modelValue with a Time instance when modelValue is a Time', async () => {
    const value = new Time(9, 15)
    const wrapper = mount(TimeScroller, {
      props: { modelValue: value, granularity: 'minute', hourCycle: 24 },
      attachTo: document.body,
    })
    await nextTick()
    const columns = wrapper.findAll('[data-slot="scroller-column"]')
    expect(columns).toHaveLength(2)

    const minuteCol = columns[1]
    const options = minuteCol.findAll('[role="option"]')
    await options[45].trigger('click')

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    const [newValue] = emitted![0] as [Time]
    expect(newValue).toBeInstanceOf(Time)
    expect(newValue.minute).toBe(45)
    expect(newValue.hour).toBe(9)
  })
})
