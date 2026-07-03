import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { Time } from '@internationalized/date'
import TimePicker from '../TimePicker.vue'

const makeValue = () => new Time(10, 30)

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

describe('TimePicker', () => {
  afterEach(() => { document.body.innerHTML = '' })

  it('renders with a trigger button', async () => {
    mount(TimePicker, {
      props: { label: 'Time', defaultValue: makeValue() },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.body.querySelector('button[aria-label="Open time picker"]')).not.toBeNull()
  })

  it('renders the time scroller when open', async () => {
    mount(TimePicker, {
      props: { label: 'Time', defaultOpen: true, defaultValue: makeValue() },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.body.querySelector('[data-slot="time-scroller"]')).not.toBeNull()
  })

  it('clicking a scroller option updates the TimeField segments', async () => {
    mount(TimePicker, {
      props: { label: 'Time', defaultOpen: true, defaultValue: makeValue() },
      attachTo: document.body,
    })
    await nextTick()
    const minuteCol = document.body.querySelectorAll('[data-slot="scroller-column"]')[1]
    const option = minuteCol.querySelectorAll('[role="option"]')[45] as HTMLElement
    option.click()
    await nextTick()
    // TimeField renders reka segments — the minute segment should now show "45"
    const minuteSegment = document.body.querySelector('[data-reka-time-field-segment="minute"]')
    expect(minuteSegment?.textContent).toContain('45')
  })

  it('keeps the popover open after a wheel selection', async () => {
    mount(TimePicker, {
      props: { label: 'Time', defaultOpen: true, defaultValue: makeValue() },
      attachTo: document.body,
    })
    await nextTick()
    const minuteCol = document.body.querySelectorAll('[data-slot="scroller-column"]')[1]
    const option = minuteCol.querySelectorAll('[role="option"]')[20] as HTMLElement
    option.click()
    await nextTick()
    expect(document.body.querySelector('[data-slot="time-scroller"]')).not.toBeNull()
  })

  it('requests close (update:open=false) when the Done button is clicked', async () => {
    const wrapper = mount(TimePicker, {
      props: { label: 'Time', open: true, defaultValue: makeValue() },
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

  it('granularity=second shows 3 scroller columns', async () => {
    mount(TimePicker, {
      props: { label: 'Time', defaultOpen: true, defaultValue: new Time(10, 30, 15), granularity: 'second' },
      attachTo: document.body,
    })
    await nextTick()
    const columns = document.body.querySelectorAll('[data-slot="scroller-column"]')
    expect(columns.length).toBe(3)
  })

  it('hourCycle=12 shows an AM/PM scroller column', async () => {
    mount(TimePicker, {
      props: { label: 'Time', defaultOpen: true, defaultValue: makeValue(), hourCycle: 12 },
      attachTo: document.body,
    })
    await nextTick()
    const columns = document.body.querySelectorAll('[data-slot="scroller-column"]')
    expect(columns.length).toBe(3) // hour + minute + AM/PM
  })

  it('isDisabled disables the TimeField', async () => {
    mount(TimePicker, {
      props: { label: 'Time', defaultValue: makeValue(), isDisabled: true },
      attachTo: document.body,
    })
    await nextTick()
    expect(document.body.querySelector('[data-disabled]')).not.toBeNull()
  })
})
