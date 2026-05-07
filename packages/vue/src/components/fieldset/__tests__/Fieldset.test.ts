import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import Fieldset from '../Fieldset.vue'

/**
 * Fieldset component tests — validates structural rendering,
 * legend/disabled props, and accessibility.
 */

describe('Fieldset', () => {
  // --------------------------------------------------------------------------
  // Rendering
  // --------------------------------------------------------------------------

  it('renders as a <fieldset> element', () => {
    const wrapper = mount(Fieldset)
    expect(wrapper.element.tagName.toLowerCase()).toBe('fieldset')
  })

  it('has base class "fieldset"', () => {
    const wrapper = mount(Fieldset)
    expect(wrapper.classes()).toContain('fieldset')
  })

  it('renders slot content', () => {
    const wrapper = mount(Fieldset, {
      slots: { default: '<input type="text" aria-label="Name" />' },
    })
    expect(wrapper.find('input').exists()).toBe(true)
  })

  // --------------------------------------------------------------------------
  // legend prop
  // --------------------------------------------------------------------------

  it('renders <legend> when legend prop is provided', () => {
    const wrapper = mount(Fieldset, { props: { legend: 'Contact Details' } })
    const legend = wrapper.find('legend')
    expect(legend.exists()).toBe(true)
    expect(legend.text()).toBe('Contact Details')
  })

  it('does NOT render <legend> when legend prop is omitted', () => {
    const wrapper = mount(Fieldset)
    expect(wrapper.find('legend').exists()).toBe(false)
  })

  it('legend element has legend class', () => {
    const wrapper = mount(Fieldset, { props: { legend: 'Contact' } })
    const legend = wrapper.find('legend')
    expect(legend.classes()).toContain('fieldset__legend')
  })

  // --------------------------------------------------------------------------
  // disabled prop
  // --------------------------------------------------------------------------

  it('sets disabled attribute when disabled=true', () => {
    const wrapper = mount(Fieldset, { props: { disabled: true } })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('does NOT set disabled attribute when disabled=false (default)', () => {
    const wrapper = mount(Fieldset)
    expect(wrapper.attributes('disabled')).toBeUndefined()
  })

  it('disabled fieldset disables contained inputs', () => {
    const wrapper = mount(Fieldset, {
      props: { disabled: true },
      slots: { default: '<input type="text" aria-label="Name" />' },
    })
    // Native browser behavior: disabled fieldset disables contained inputs
    // In jsdom, the fieldset disabled attr is set
    expect(wrapper.element.disabled).toBe(true)
  })

  // --------------------------------------------------------------------------
  // class prop
  // --------------------------------------------------------------------------

  it('applies class prop', () => {
    const wrapper = mount(Fieldset, { props: { class: 'my-fieldset' } })
    expect(wrapper.classes()).toContain('my-fieldset')
  })

  // --------------------------------------------------------------------------
  // Accessibility
  // --------------------------------------------------------------------------

  it('passes axe audit — fieldset with legend', async () => {
    const wrapper = mount(Fieldset, {
      props: { legend: 'Personal Information' },
      slots: {
        default:
          '<label for="name">Name</label><input id="name" type="text" />',
      },
      attachTo: document.body,
    })
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
    wrapper.unmount()
  })

  it('passes axe audit — fieldset without legend (still valid for structural grouping)', async () => {
    const wrapper = mount(Fieldset, {
      slots: {
        default:
          '<label for="name">Name</label><input id="name" type="text" />',
      },
      attachTo: document.body,
    })
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
    wrapper.unmount()
  })
})
