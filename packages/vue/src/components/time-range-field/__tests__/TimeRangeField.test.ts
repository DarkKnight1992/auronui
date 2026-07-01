import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import axe from 'axe-core'
import { Time } from '@internationalized/date'
import TimeRangeField from '../TimeRangeField.vue'

// Reka UI time primitives use ResizeObserver internally — polyfill for jsdom
beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

describe('TimeRangeField', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    wrappers.forEach(w => w.unmount())
    wrappers.length = 0
  })

  // Test 1: Renders two segment lists (start + end) inside a group role
  it('renders start and end segment lists inside a group role', async () => {
    const wrapper = mount(TimeRangeField, {
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const group = wrapper.find('[role="group"]')
    expect(group.exists()).toBe(true)
    const startList = wrapper.find('[data-slot="segment-list"][data-type="start"]')
    const endList = wrapper.find('[data-slot="segment-list"][data-type="end"]')
    expect(startList.exists()).toBe(true)
    expect(endList.exists()).toBe(true)
    const segments = wrapper.findAll('[data-reka-time-field-segment]')
    expect(segments.length).toBeGreaterThan(0)
  })

  // Test 2: Renders a visible separator between the two segment lists
  it('renders a separator between start and end segment lists', async () => {
    const wrapper = mount(TimeRangeField, {
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const separator = wrapper.find('[data-slot="separator"]')
    expect(separator.exists()).toBe(true)
  })

  // Test 3: hourCycle=12 — dayPeriod segment rendered (AM/PM) in both lists
  it('hourCycle=12 renders dayPeriod segments (AM/PM)', async () => {
    const wrapper = mount(TimeRangeField, {
      props: { hourCycle: 12 },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const segments = wrapper.findAll('[data-reka-time-field-segment]')
    const parts = segments.map(s => s.attributes('data-reka-time-field-segment'))
    expect(parts).toContain('dayPeriod')
  })

  // Test 4: hourCycle=24 — no dayPeriod segment
  it('hourCycle=24 does not render dayPeriod segments', async () => {
    const wrapper = mount(TimeRangeField, {
      props: { hourCycle: 24 },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const segments = wrapper.findAll('[data-reka-time-field-segment]')
    const parts = segments.map(s => s.attributes('data-reka-time-field-segment'))
    expect(parts).not.toContain('dayPeriod')
  })

  // Test 5: granularity="second" — includes second segments
  it('granularity="second" includes second segments', async () => {
    const wrapper = mount(TimeRangeField, {
      props: { granularity: 'second' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const segments = wrapper.findAll('[data-reka-time-field-segment]')
    const parts = segments.map(s => s.attributes('data-reka-time-field-segment'))
    expect(parts).toContain('second')
  })

  // Test 6: default granularity (minute) — no second segments
  it('default granularity does not include second segments', async () => {
    const wrapper = mount(TimeRangeField, {
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const segments = wrapper.findAll('[data-reka-time-field-segment]')
    const parts = segments.map(s => s.attributes('data-reka-time-field-segment'))
    expect(parts).not.toContain('second')
  })

  // Test 7: modelValue displays both start and end time values
  it('modelValue renders the start and end time values in segments', async () => {
    const modelValue = { start: new Time(9, 0), end: new Time(17, 30) }
    const wrapper = mount(TimeRangeField, {
      props: { modelValue, hourCycle: 24 },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    expect(wrapper.text()).toContain('09')
    expect(wrapper.text()).toContain('17')
    expect(wrapper.text()).toContain('30')
  })

  // Test 8: isInvalid sets aria-invalid on the group
  it('isInvalid=true sets aria-invalid on the role=group element', async () => {
    const wrapper = mount(TimeRangeField, {
      props: { isInvalid: true },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const group = wrapper.find('[role="group"]')
    expect(group.exists()).toBe(true)
    expect(group.attributes('aria-invalid')).toBe('true')
  })

  // Test 9: label renders
  it('label prop renders a label element', async () => {
    const wrapper = mount(TimeRangeField, {
      props: { label: 'Meeting Window' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const label = wrapper.find('label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Meeting Window')
  })

  // Test 10: description renders
  it('description prop renders description text', async () => {
    const wrapper = mount(TimeRangeField, {
      props: { description: 'Select the meeting window' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    expect(wrapper.text()).toContain('Select the meeting window')
  })

  // Test 11: errorMessage renders when isInvalid
  it('errorMessage renders when isInvalid=true', async () => {
    const wrapper = mount(TimeRangeField, {
      props: { isInvalid: true, errorMessage: 'Time range is required' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    expect(wrapper.text()).toContain('Time range is required')
  })

  // Test 12: isDisabled
  it('isDisabled prop applies data-disabled to root group', async () => {
    const wrapper = mount(TimeRangeField, {
      props: { isDisabled: true },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const group = wrapper.find('[role="group"]')
    expect(group.attributes('data-disabled')).toBeDefined()
  })

  // Test 13: base CSS class applied
  it('applies time-range-field base class to root', async () => {
    const wrapper = mount(TimeRangeField, {
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    expect(wrapper.html()).toContain('time-range-field')
  })

  // Test 14: axe audit — zero violations with label
  it('passes axe audit with label prop', async () => {
    const wrapper = mount(TimeRangeField, {
      props: { label: 'Event Window' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const results = await axe.run(wrapper.element)
    expect(results.violations).toHaveLength(0)
  })

  // Test 15: axe audit — zero violations invalid
  it('passes axe audit with isInvalid + errorMessage', async () => {
    const wrapper = mount(TimeRangeField, {
      props: { label: 'Event Window', isInvalid: true, errorMessage: 'Window required' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const results = await axe.run(wrapper.element)
    expect(results.violations).toHaveLength(0)
  })

  // Test 16: axe audit — disabled
  it('passes axe audit when disabled', async () => {
    const wrapper = mount(TimeRangeField, {
      props: { label: 'Event Window', isDisabled: true },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const results = await axe.run(wrapper.element)
    expect(results.violations).toHaveLength(0)
  })
})
