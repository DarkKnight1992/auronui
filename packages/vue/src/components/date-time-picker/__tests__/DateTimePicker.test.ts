import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { CalendarDateTime } from '@internationalized/date'
import DateTimePickerTimeScroller from '../DateTimePickerTimeScroller.vue'
import DateTimePickerTimezone from '../DateTimePickerTimezone.vue'
import DateTimePicker from '../DateTimePicker.vue'

const makeValue = () => new CalendarDateTime(2024, 6, 15, 10, 30)

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

describe('DateTimePickerTimeScroller', () => {
  afterEach(() => { document.body.innerHTML = '' })

  it('renders hour and minute columns for granularity=minute', async () => {
    const value = new CalendarDateTime(2024, 6, 15, 10, 30)
    const wrapper = mount(DateTimePickerTimeScroller, {
      props: { modelValue: value, granularity: 'minute', hourCycle: 24 },
      attachTo: document.body,
    })
    await nextTick()
    const columns = wrapper.findAll('[data-slot="scroller-column"]')
    expect(columns).toHaveLength(2) // hour + minute
  })

  it('renders hour, minute, second columns for granularity=second', async () => {
    const value = new CalendarDateTime(2024, 6, 15, 10, 30, 0)
    const wrapper = mount(DateTimePickerTimeScroller, {
      props: { modelValue: value, granularity: 'second', hourCycle: 24 },
      attachTo: document.body,
    })
    await nextTick()
    const columns = wrapper.findAll('[data-slot="scroller-column"]')
    expect(columns).toHaveLength(3) // hour + minute + second
  })

  it('renders AM/PM column for hourCycle=12', async () => {
    const value = new CalendarDateTime(2024, 6, 15, 14, 30)
    const wrapper = mount(DateTimePickerTimeScroller, {
      props: { modelValue: value, granularity: 'minute', hourCycle: 12 },
      attachTo: document.body,
    })
    await nextTick()
    const columns = wrapper.findAll('[data-slot="scroller-column"]')
    expect(columns).toHaveLength(3) // hour + minute + AM/PM
  })

  it('emits update:modelValue with new minute when scroll changes minute column', async () => {
    const value = new CalendarDateTime(2024, 6, 15, 10, 30)
    const wrapper = mount(DateTimePickerTimeScroller, {
      props: { modelValue: value, granularity: 'minute', hourCycle: 24 },
      attachTo: document.body,
    })
    await nextTick()

    const columns = wrapper.findAll('[data-slot="scroller-column"]')
    const minuteCol = columns[1]

    Object.defineProperty(minuteCol.element, 'scrollTop', {
      configurable: true,
      get: vi.fn().mockReturnValue(15 * 40), // 40px per item
      set: vi.fn(),
    })

    await minuteCol.trigger('scroll')
    await nextTick()

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    const [newValue] = emitted![0] as [CalendarDateTime]
    expect(newValue.minute).toBe(15)
    expect(newValue.hour).toBe(10) // hour unchanged
  })

  it('emits update:modelValue with new hour when scroll changes hour column', async () => {
    const value = new CalendarDateTime(2024, 6, 15, 10, 30)
    const wrapper = mount(DateTimePickerTimeScroller, {
      props: { modelValue: value, granularity: 'minute', hourCycle: 24 },
      attachTo: document.body,
    })
    await nextTick()

    const columns = wrapper.findAll('[data-slot="scroller-column"]')
    const hourCol = columns[0]

    Object.defineProperty(hourCol.element, 'scrollTop', {
      configurable: true,
      get: vi.fn().mockReturnValue(14 * 40), // hour=14 (index 14 in 0-23)
      set: vi.fn(),
    })

    await hourCol.trigger('scroll')
    await nextTick()

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    const [newValue] = emitted![0] as [CalendarDateTime]
    expect(newValue.hour).toBe(14)
    expect(newValue.minute).toBe(30) // minute unchanged
  })

  it('selected item has aria-selected=true', async () => {
    const value = new CalendarDateTime(2024, 6, 15, 10, 30)
    const wrapper = mount(DateTimePickerTimeScroller, {
      props: { modelValue: value, granularity: 'minute', hourCycle: 24 },
      attachTo: document.body,
    })
    await nextTick()

    const minuteCol = wrapper.findAll('[data-slot="scroller-column"]')[1]
    const options = minuteCol.findAll('[role="option"]')
    expect(options[30].attributes('aria-selected')).toBe('true')
    expect(options[0].attributes('aria-selected')).toBe('false')
  })

  it('marks a column data-focused only while it has focus', async () => {
    const value = new CalendarDateTime(2024, 6, 15, 10, 30)
    const wrapper = mount(DateTimePickerTimeScroller, {
      props: { modelValue: value, granularity: 'minute', hourCycle: 24 },
      attachTo: document.body,
    })
    await nextTick()
    const hourCol = wrapper.findAll('[data-slot="scroller-column"]')[0]
    expect(hourCol.attributes('data-focused')).toBeUndefined()
    await hourCol.trigger('focus')
    expect(hourCol.attributes('data-focused')).toBe('true')
    await hourCol.trigger('blur')
    expect(hourCol.attributes('data-focused')).toBeUndefined()
  })
})

describe('DateTimePickerTimezone', () => {
  afterEach(() => { document.body.innerHTML = '' })

  it('renders a search input and timezone list', async () => {
    const wrapper = mount(DateTimePickerTimezone, {
      props: { currentZone: 'America/New_York' },
      attachTo: document.body,
    })
    await nextTick()
    expect(wrapper.find('[data-slot="tz-search"]').exists()).toBe(true)
    expect(wrapper.find('[data-slot="tz-list"]').exists()).toBe(true)
  })

  it('filters timezones when user types', async () => {
    const wrapper = mount(DateTimePickerTimezone, {
      props: { currentZone: 'America/New_York' },
      attachTo: document.body,
    })
    await nextTick()
    const input = wrapper.find('[data-slot="tz-search"]')
    await input.setValue('New_York')
    await nextTick()
    const items = wrapper.findAll('[data-slot="tz-item"]')
    expect(items.length).toBeGreaterThan(0)
    items.forEach(item => {
      expect(item.text().toLowerCase()).toContain('new')
    })
  })

  it('emits select with IANA key when item is clicked', async () => {
    const wrapper = mount(DateTimePickerTimezone, {
      props: { currentZone: 'UTC' },
      attachTo: document.body,
    })
    await nextTick()
    const firstItem = wrapper.find('[data-slot="tz-item"]')
    await firstItem.trigger('click')
    expect(wrapper.emitted('select')?.[0]).toBeDefined()
    expect(typeof wrapper.emitted('select')![0][0]).toBe('string')
  })

  it('marks current zone as aria-selected', async () => {
    const wrapper = mount(DateTimePickerTimezone, {
      props: { currentZone: 'America/New_York' },
      attachTo: document.body,
    })
    await nextTick()
    const input = wrapper.find('[data-slot="tz-search"]')
    await input.setValue('New_York')
    await nextTick()

    const selectedItem = wrapper.find('[aria-selected="true"]')
    expect(selectedItem.exists()).toBe(true)
    expect(selectedItem.attributes('data-slot')).toBe('tz-item')
  })
})

describe('DateTimePicker', () => {
  afterEach(() => { document.body.innerHTML = '' })

  it('renders with a trigger button', async () => {
    const wrapper = mount(DateTimePicker, {
      props: { label: 'Date & Time', defaultValue: makeValue() },
      attachTo: document.body,
    })
    await nextTick()
    expect(wrapper.find('button[aria-label="Open date time picker"]').exists()).toBe(true)
  })

  it('shows "Pick a date" as step title when open', async () => {
    mount(DateTimePicker, {
      props: { label: 'Date & Time', defaultOpen: true, defaultValue: makeValue() },
      attachTo: document.body,
    })
    await nextTick()
    const header = document.body.querySelector('[data-slot="step-header"]')
    expect(header?.textContent).toContain('Pick a date')
  })

  it('back button has data-hidden=true on the date step', async () => {
    mount(DateTimePicker, {
      props: { label: 'Date & Time', defaultOpen: true, defaultValue: makeValue() },
      attachTo: document.body,
    })
    await nextTick()
    const backBtn = document.body.querySelector('[data-slot="back-button"]') as HTMLElement | null
    expect(backBtn?.dataset.hidden).toBe('true')
  })

  it('pressing forward button advances to time step', async () => {
    mount(DateTimePicker, {
      props: { label: 'Date & Time', defaultOpen: true, defaultValue: makeValue() },
      attachTo: document.body,
    })
    await nextTick()
    const fwdBtn = document.body.querySelector('[data-slot="forward-button"]') as HTMLElement
    await fwdBtn.click()
    await nextTick()
    expect(document.body.querySelector('[data-slot="step-header"]')?.textContent).toContain('Pick a time')
    expect(document.body.querySelector('[data-slot="time-scroller"]')).not.toBeNull()
  })

  it('pressing back from time step returns to date step', async () => {
    mount(DateTimePicker, {
      props: { label: 'Date & Time', defaultOpen: true, defaultValue: makeValue() },
      attachTo: document.body,
    })
    await nextTick()
    const advance = async () => {
      const btn = document.body.querySelector('[data-slot="forward-button"]') as HTMLElement
      await btn.click()
      await nextTick()
    }
    await advance() // date → time
    const backBtn = document.body.querySelector('[data-slot="back-button"]') as HTMLElement
    await backBtn.click()
    await nextTick()
    expect(document.body.querySelector('[data-slot="step-header"]')?.textContent).toContain('Pick a date')
  })
})
