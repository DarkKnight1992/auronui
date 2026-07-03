import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { CalendarDateTime } from '@internationalized/date'
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

  it('renders calendar and time scroller side-by-side when open', async () => {
    mount(DateTimePicker, {
      props: { label: 'Date & Time', defaultOpen: true, defaultValue: makeValue() },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.body.querySelector('[data-slot="step-header"]')).toBeNull()
    expect(document.body.querySelector('[data-slot="time-scroller"]')).not.toBeNull()
    // Calendar renders a grid of day cells (Reka CalendarGrid uses role="application")
    expect(document.body.querySelector('[role="gridcell"]')).not.toBeNull()
  })

  it('keeps the popover open after selecting a date', async () => {
    mount(DateTimePicker, {
      props: { label: 'Date & Time', defaultOpen: true, defaultValue: makeValue() },
      attachTo: document.body,
    })
    await nextTick()
    const cell = document.body.querySelector('[role="gridcell"] [data-selected]') as HTMLElement
      ?? document.body.querySelector('[role="gridcell"] button') as HTMLElement
    expect(cell).toBeTruthy()
    cell?.click()
    await nextTick()
    // Time scroller still present → popover did not close
    expect(document.body.querySelector('[data-slot="time-scroller"]')).not.toBeNull()
  })

  it('requests close (update:open=false) when the Done button is clicked', async () => {
    // Controlled `open` so we can assert the emitted close request directly —
    // Reka's popover unmount waits on an animationend that never fires in jsdom,
    // so asserting DOM removal here would be flaky.
    const wrapper = mount(DateTimePicker, {
      props: { label: 'Date & Time', open: true, defaultValue: makeValue() },
      attachTo: document.body,
    })
    await nextTick()
    const doneBtn = document.body.querySelector('[data-slot="done-button"]') as HTMLElement
    expect(doneBtn).toBeTruthy()
    expect(doneBtn.textContent?.trim()).toBe('Done')
    doneBtn.click()
    await nextTick()
    const emitted = wrapper.emitted('update:open')
    expect(emitted).toBeTruthy()
    expect(emitted!.at(-1)).toEqual([false])
  })
})
