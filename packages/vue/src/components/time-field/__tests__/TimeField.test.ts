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

  // Test 12b: applies all color variant classes to the inputWrapper (group) element
  it('applies all color variants', async () => {
    const colors = ['default', 'primary', 'secondary', 'accent', 'success', 'warning', 'danger'] as const
    for (const color of colors) {
      const wrapper = mount(TimeField, {
        props: { color },
        attachTo: document.body,
      })
      await nextTick()
      expect(wrapper.find('[role="group"]').classes()).toContain(`time-field--${color}`)
      wrapper.unmount()
    }
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

  // ── useFormField / FieldLabel / FormFieldHelper regression coverage ──

  // Test 16-18: label renders in the correct DOM location per labelPlacement
  it('labelPlacement="inside" renders the label inside the field wrapper (as a sibling of the segment list)', async () => {
    const wrapper = mount(TimeField, {
      props: { label: 'Meeting Time', labelPlacement: 'inside' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const group = wrapper.find('[role="group"]')
    const label = group.find('label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Meeting Time')
  })

  it('labelPlacement="outside" renders the label outside the field wrapper (root-level, before mainWrapper)', async () => {
    const wrapper = mount(TimeField, {
      props: { label: 'Meeting Time', labelPlacement: 'outside' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const group = wrapper.find('[role="group"]')
    expect(group.find('label').exists()).toBe(false)
    const label = wrapper.find('label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Meeting Time')
  })

  it('labelPlacement="outside-left" renders the label outside the field wrapper (root-level, before mainWrapper)', async () => {
    const wrapper = mount(TimeField, {
      props: { label: 'Meeting Time', labelPlacement: 'outside-left' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const group = wrapper.find('[role="group"]')
    expect(group.find('label').exists()).toBe(false)
    const label = wrapper.find('label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Meeting Time')
  })

  // Test 19-20: aria-describedby links to the rendered helper element's id
  it('aria-describedby on the group points at the error message id when isInvalid + errorMessage are set', async () => {
    const wrapper = mount(TimeField, {
      props: { isInvalid: true, errorMessage: 'Time is required' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const group = wrapper.find('[role="group"]')
    const describedBy = group.attributes('aria-describedby')
    expect(describedBy).toBeTruthy()
    const errorEl = wrapper.find(`#${describedBy}`)
    expect(errorEl.exists()).toBe(true)
    expect(errorEl.text()).toBe('Time is required')
  })

  it('aria-describedby on the group points at the description id when only description is set', async () => {
    const wrapper = mount(TimeField, {
      props: { description: 'Select the meeting time' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const group = wrapper.find('[role="group"]')
    const describedBy = group.attributes('aria-describedby')
    expect(describedBy).toBeTruthy()
    const descEl = wrapper.find(`#${describedBy}`)
    expect(descEl.exists()).toBe(true)
    expect(descEl.text()).toBe('Select the meeting time')
  })

  // Test 21-22: rootDataAttrs — 6-attribute present/absent coverage
  it('sets all 6 root data-attributes when every corresponding condition is true', async () => {
    const wrapper = mount(TimeField, {
      props: {
        label: 'Meeting Time',
        description: 'helper',
        isInvalid: true,
        isDisabled: true,
        isReadOnly: true,
        isRequired: true,
        errorMessage: 'err',
      },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const root = wrapper.element
    expect(root.getAttribute('data-invalid')).toBe('true')
    expect(root.getAttribute('data-disabled')).toBe('true')
    expect(root.getAttribute('data-readonly')).toBe('true')
    expect(root.getAttribute('data-required')).toBe('true')
    expect(root.getAttribute('data-has-label')).toBe('true')
    expect(root.getAttribute('data-has-helper')).toBe('true')
  })

  it('omits all 6 root data-attributes when every corresponding condition is false', async () => {
    const wrapper = mount(TimeField, {
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const root = wrapper.element
    expect(root.hasAttribute('data-invalid')).toBe(false)
    expect(root.hasAttribute('data-disabled')).toBe(false)
    expect(root.hasAttribute('data-readonly')).toBe(false)
    expect(root.hasAttribute('data-required')).toBe(false)
    expect(root.hasAttribute('data-has-label')).toBe(false)
    expect(root.hasAttribute('data-has-helper')).toBe(false)
  })

  // Test 23: REGRESSION — id-derivation bug fix.
  // Before the fix, descriptionId/errorMessageId were built from the raw
  // internal `generatedId`, NOT from the resolved, caller-overridable field
  // id. So overriding `id` correctly changed the rendered `id`/`for`
  // attributes but left `aria-describedby` pointing at a stale id built from
  // `generatedId` — a silent a11y break. This test mounts TimeField with an
  // explicit `id` override and asserts `aria-describedby` is scoped off that
  // SAME override (`${id}-error`), not off the internal generator.
  it('aria-describedby tracks a caller-supplied id override (regression: previously derived from the internal id generator)', async () => {
    const wrapper = mount(TimeField, {
      props: {
        isInvalid: true,
        errorMessage: 'Time is required',
      },
      attrs: { id: 'custom-id' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    // The `id` override is forwarded by TimeFieldRoot onto its underlying
    // native hidden input (Reka's form-association element), confirming the
    // override reached the component at all.
    expect(wrapper.find('#custom-id').exists()).toBe(true)
    const group = wrapper.find('[role="group"]')
    expect(group.attributes('aria-describedby')).toBe('custom-id-error')
    const errorEl = wrapper.find('#custom-id-error')
    expect(errorEl.exists()).toBe(true)
    expect(errorEl.text()).toBe('Time is required')
  })
})
