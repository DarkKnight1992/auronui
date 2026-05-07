import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import NumberField from '../NumberField.vue'

describe('NumberField axe audit', () => {
  const mountedWrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mountedWrappers.forEach(w => w.unmount())
    mountedWrappers.length = 0
  })

  // Test 12: Axe audit in default state with aria-label → 0 violations
  it('passes axe in default state with aria-label', async () => {
    const wrapper = mount(NumberField, {
      props: { ariaLabel: 'Quantity' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  // Test 13: Axe audit with visible label → 0 violations
  it('passes axe with visible label', async () => {
    const wrapper = mount(NumberField, {
      props: { label: 'Quantity' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe with min=0 max=100 step=1', async () => {
    const wrapper = mount(NumberField, {
      props: {
        label: 'Items',
        min: 0,
        max: 100,
        step: 1,
        modelValue: 50,
        'onUpdate:modelValue': () => {},
      },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe when isDisabled=true', async () => {
    const wrapper = mount(NumberField, {
      props: { label: 'Quantity', isDisabled: true },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe with bordered variant', async () => {
    const wrapper = mount(NumberField, {
      props: { label: 'Amount', variant: 'bordered' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe with fullWidth=true', async () => {
    const wrapper = mount(NumberField, {
      props: { label: 'Quantity', fullWidth: true },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe with currency formatOptions', async () => {
    const wrapper = mount(NumberField, {
      props: {
        label: 'Price',
        modelValue: 1000,
        formatOptions: { style: 'currency', currency: 'USD' },
        'onUpdate:modelValue': () => {},
      },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
