import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import axe from 'axe-core'
import { Time } from '@internationalized/date'
import TimeField from '../TimeField.vue'

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

describe('TimeField', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    wrappers.forEach(w => w.unmount())
    wrappers.length = 0
  })

  // Test 1: Renders TimeFieldRoot with segment elements
  it('renders time segments inside a group role', async () => {
    const wrapper = mount(TimeField, {
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const group = wrapper.find('[role="group"]')
    expect(group.exists()).toBe(true)
    const segments = wrapper.findAll('[data-reka-time-field-segment]')
    expect(segments.length).toBeGreaterThan(0)
  })

  // Test 2: hourCycle=12 — dayPeriod segment rendered (AM/PM)
  it('hourCycle=12 renders dayPeriod segment (AM/PM)', async () => {
    const wrapper = mount(TimeField, {
      props: { hourCycle: 12 },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const segments = wrapper.findAll('[data-reka-time-field-segment]')
    const parts = segments.map(s => s.attributes('data-reka-time-field-segment'))
    expect(parts).toContain('dayPeriod')
  })

  // Test 3: hourCycle=24 — no dayPeriod segment
  it('hourCycle=24 does not render dayPeriod segment', async () => {
    const wrapper = mount(TimeField, {
      props: { hourCycle: 24 },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const segments = wrapper.findAll('[data-reka-time-field-segment]')
    const parts = segments.map(s => s.attributes('data-reka-time-field-segment'))
    expect(parts).not.toContain('dayPeriod')
  })

  // Test 4: granularity="second" — includes seconds segment
  it('granularity="second" includes a second segment', async () => {
    const wrapper = mount(TimeField, {
      props: { granularity: 'second' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const segments = wrapper.findAll('[data-reka-time-field-segment]')
    const parts = segments.map(s => s.attributes('data-reka-time-field-segment'))
    expect(parts).toContain('second')
  })

  // Test 5: default granularity (minute) — no seconds segment
  it('default granularity does not include seconds segment', async () => {
    const wrapper = mount(TimeField, {
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const segments = wrapper.findAll('[data-reka-time-field-segment]')
    const parts = segments.map(s => s.attributes('data-reka-time-field-segment'))
    expect(parts).not.toContain('second')
  })

  // Test 6: modelValue displays the time value
  it('modelValue renders the time value in segments', async () => {
    const modelValue = new Time(14, 30)
    const wrapper = mount(TimeField, {
      props: { modelValue, hourCycle: 24 },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    // In 24h mode, hour 14 should be visible
    expect(wrapper.text()).toContain('14')
    expect(wrapper.text()).toContain('30')
  })

  // Test 7: isInvalid sets aria-invalid on the group
  it('isInvalid=true sets aria-invalid on the role=group element', async () => {
    const wrapper = mount(TimeField, {
      props: { isInvalid: true },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const group = wrapper.find('[role="group"]')
    expect(group.exists()).toBe(true)
    expect(group.attributes('aria-invalid')).toBe('true')
  })

  // Test 8: label renders
  it('label prop renders a label element', async () => {
    const wrapper = mount(TimeField, {
      props: { label: 'Meeting Time' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const label = wrapper.find('label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Meeting Time')
  })

  // Test 9: description renders
  it('description prop renders description text', async () => {
    const wrapper = mount(TimeField, {
      props: { description: 'Select the meeting time' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    expect(wrapper.text()).toContain('Select the meeting time')
  })

  // Test 10: errorMessage renders when isInvalid
  it('errorMessage renders when isInvalid=true', async () => {
    const wrapper = mount(TimeField, {
      props: { isInvalid: true, errorMessage: 'Time is required' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    expect(wrapper.text()).toContain('Time is required')
  })

  // Test 11: isDisabled
  it('isDisabled prop applies data-disabled to root group', async () => {
    const wrapper = mount(TimeField, {
      props: { isDisabled: true },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const group = wrapper.find('[role="group"]')
    expect(group.attributes('data-disabled')).toBeDefined()
  })

  // Test 12: base CSS class applied
  it('applies time-field base class to root', async () => {
    const wrapper = mount(TimeField, {
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    expect(wrapper.html()).toContain('time-field')
  })

  // Test 13: axe audit — zero violations with label
  it('passes axe audit with label prop', async () => {
    const wrapper = mount(TimeField, {
      props: { label: 'Event Time' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const results = await axe.run(wrapper.element)
    expect(results.violations).toHaveLength(0)
  })

  // Test 14: axe audit — zero violations invalid
  it('passes axe audit with isInvalid + errorMessage', async () => {
    const wrapper = mount(TimeField, {
      props: { label: 'Event Time', isInvalid: true, errorMessage: 'Time required' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const results = await axe.run(wrapper.element)
    expect(results.violations).toHaveLength(0)
  })

  // Test 15: axe audit — disabled
  it('passes axe audit when disabled', async () => {
    const wrapper = mount(TimeField, {
      props: { label: 'Event Time', isDisabled: true },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const results = await axe.run(wrapper.element)
    expect(results.violations).toHaveLength(0)
  })
})
