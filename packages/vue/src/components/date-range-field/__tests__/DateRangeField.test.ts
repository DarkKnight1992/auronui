import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import axe from 'axe-core'
import { CalendarDate } from '@internationalized/date'
import DateRangeField from '../DateRangeField.vue'

// Reka UI date primitives use ResizeObserver internally — polyfill for jsdom
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

describe('DateRangeField', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    wrappers.forEach(w => w.unmount())
    wrappers.length = 0
  })

  // Test 1: Renders two segment lists (start + end) inside a group role
  it('renders start and end segment lists inside a group role', async () => {
    const wrapper = mount(DateRangeField, {
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
    const segments = wrapper.findAll('[data-reka-date-field-segment]')
    expect(segments.length).toBeGreaterThan(0)
  })

  // Test 2: Renders a visible separator between the two segment lists
  it('renders a separator between start and end segment lists', async () => {
    const wrapper = mount(DateRangeField, {
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const separator = wrapper.find('[data-slot="separator"]')
    expect(separator.exists()).toBe(true)
  })

  // Test 3: modelValue displays both start and end date values
  it('modelValue renders the start and end date values in segments', async () => {
    const modelValue = { start: new CalendarDate(2024, 6, 15), end: new CalendarDate(2024, 6, 20) }
    const wrapper = mount(DateRangeField, {
      props: { modelValue },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    expect(wrapper.text()).toContain('2024')
  })

  // Test 4: isInvalid sets aria-invalid on the group
  it('isInvalid=true sets aria-invalid on the role=group element', async () => {
    const wrapper = mount(DateRangeField, {
      props: { isInvalid: true },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const group = wrapper.find('[role="group"]')
    expect(group.exists()).toBe(true)
    expect(group.attributes('aria-invalid')).toBe('true')
  })

  // Test 5: label renders
  it('label prop renders a label element', async () => {
    const wrapper = mount(DateRangeField, {
      props: { label: 'Vacation Dates' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const label = wrapper.find('label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Vacation Dates')
  })

  // Test 6: description renders
  it('description prop renders description text', async () => {
    const wrapper = mount(DateRangeField, {
      props: { description: 'Select the start and end dates' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    expect(wrapper.text()).toContain('Select the start and end dates')
  })

  // Test 7: errorMessage renders when isInvalid
  it('errorMessage renders when isInvalid=true', async () => {
    const wrapper = mount(DateRangeField, {
      props: { isInvalid: true, errorMessage: 'Date range is required' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    expect(wrapper.text()).toContain('Date range is required')
  })

  // Test 8: isDisabled
  it('isDisabled prop applies data-disabled to root group', async () => {
    const wrapper = mount(DateRangeField, {
      props: { isDisabled: true },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const group = wrapper.find('[role="group"]')
    expect(group.attributes('data-disabled')).toBeDefined()
  })

  // Test 9: base CSS class applied
  it('applies date-range-field base class to root', async () => {
    const wrapper = mount(DateRangeField, {
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    expect(wrapper.html()).toContain('date-range-field')
  })

  // Test 10: data-slot="date-range-field" preserved on root
  it('applies data-slot="date-range-field" on the root element', async () => {
    const wrapper = mount(DateRangeField, {
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    expect(wrapper.attributes('data-slot')).toBe('date-range-field')
  })

  // Test 11: axe audit — zero violations with label
  it('passes axe audit with label prop', async () => {
    const wrapper = mount(DateRangeField, {
      props: { label: 'Event Window' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const results = await axe.run(wrapper.element)
    expect(results.violations).toHaveLength(0)
  })

  // Test 12: axe audit — zero violations invalid
  it('passes axe audit with isInvalid + errorMessage', async () => {
    const wrapper = mount(DateRangeField, {
      props: { label: 'Event Window', isInvalid: true, errorMessage: 'Window required' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const results = await axe.run(wrapper.element)
    expect(results.violations).toHaveLength(0)
  })

  // Test 13: axe audit — disabled
  it('passes axe audit when disabled', async () => {
    const wrapper = mount(DateRangeField, {
      props: { label: 'Event Window', isDisabled: true },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const results = await axe.run(wrapper.element)
    expect(results.violations).toHaveLength(0)
  })

  // ── useFormField / FieldLabel / FormFieldHelper regression coverage ──

  // Test 14-16: label renders in the correct DOM location per labelPlacement
  it('labelPlacement="inside" renders the label inside the field wrapper (as a sibling of the segment lists)', async () => {
    const wrapper = mount(DateRangeField, {
      props: { label: 'Vacation Dates', labelPlacement: 'inside' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const group = wrapper.find('[role="group"]')
    const label = group.find('label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Vacation Dates')
  })

  it('labelPlacement="outside" renders the label outside the field wrapper (root-level, before mainWrapper)', async () => {
    const wrapper = mount(DateRangeField, {
      props: { label: 'Vacation Dates', labelPlacement: 'outside' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const group = wrapper.find('[role="group"]')
    expect(group.find('label').exists()).toBe(false)
    const label = wrapper.find('label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Vacation Dates')
  })

  it('labelPlacement="outside-left" renders the label outside the field wrapper (root-level, before mainWrapper)', async () => {
    const wrapper = mount(DateRangeField, {
      props: { label: 'Vacation Dates', labelPlacement: 'outside-left' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const group = wrapper.find('[role="group"]')
    expect(group.find('label').exists()).toBe(false)
    const label = wrapper.find('label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Vacation Dates')
  })

  // Test 17-18: aria-describedby links to the rendered helper element's id
  it('aria-describedby on the group points at the error message id when isInvalid + errorMessage are set', async () => {
    const wrapper = mount(DateRangeField, {
      props: { isInvalid: true, errorMessage: 'Date range is required' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const group = wrapper.find('[role="group"]')
    const describedBy = group.attributes('aria-describedby')
    expect(describedBy).toBeTruthy()
    const errorEl = wrapper.find(`#${describedBy}`)
    expect(errorEl.exists()).toBe(true)
    expect(errorEl.text()).toBe('Date range is required')
  })

  it('aria-describedby on the group points at the description id when only description is set', async () => {
    const wrapper = mount(DateRangeField, {
      props: { description: 'Select the start and end dates' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const group = wrapper.find('[role="group"]')
    const describedBy = group.attributes('aria-describedby')
    expect(describedBy).toBeTruthy()
    const descEl = wrapper.find(`#${describedBy}`)
    expect(descEl.exists()).toBe(true)
    expect(descEl.text()).toBe('Select the start and end dates')
  })

  // Test 19-20: rootDataAttrs — 6-attribute present/absent coverage
  it('sets all 6 root data-attributes when every corresponding condition is true', async () => {
    const wrapper = mount(DateRangeField, {
      props: {
        label: 'Vacation Dates',
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
    const wrapper = mount(DateRangeField, {
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

  // Test 21: REGRESSION — id-derivation bug fix.
  // Before the fix, descriptionId/errorMessageId were built from the raw
  // internal `generatedId`, NOT from the resolved, caller-overridable field
  // id. So overriding `id` correctly changed the rendered `id`/`for`
  // attributes but left `aria-describedby` pointing at a stale id built from
  // `generatedId` — a silent a11y break. This test mounts DateRangeField
  // with an explicit `id` override and asserts `aria-describedby` is scoped
  // off that SAME override (`${id}-error`), not off the internal generator.
  it('aria-describedby tracks a caller-supplied id override (regression: previously derived from the internal id generator)', async () => {
    const wrapper = mount(DateRangeField, {
      props: {
        isInvalid: true,
        errorMessage: 'Date range is required',
      },
      attrs: { id: 'custom-id' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    // The `id` override is forwarded by DateRangeFieldRoot onto its
    // underlying native hidden input (Reka's form-association element),
    // confirming the override reached the component at all.
    expect(wrapper.find('#custom-id').exists()).toBe(true)
    const group = wrapper.find('[role="group"]')
    expect(group.attributes('aria-describedby')).toBe('custom-id-error')
    const errorEl = wrapper.find('#custom-id-error')
    expect(errorEl.exists()).toBe(true)
    expect(errorEl.text()).toBe('Date range is required')
  })
})
