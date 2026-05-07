import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import { describe, it, expect } from 'vitest'
import Spinner from '../Spinner.vue'

describe('Spinner', () => {
  it('renders div with role="status" and default aria-label', () => {
    const wrapper = mount(Spinner)
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.attributes('aria-label')).toBe('Loading')
  })

  it('renders with custom aria-label prop', () => {
    const wrapper = mount(Spinner, { props: { label: 'Please wait' } })
    expect(wrapper.attributes('aria-label')).toBe('Please wait')
  })

  it('applies class "spinner spinner--md spinner--accent" with defaults', () => {
    const wrapper = mount(Spinner)
    expect(wrapper.classes()).toContain('spinner')
    expect(wrapper.classes()).toContain('spinner--md')
    expect(wrapper.classes()).toContain('spinner--accent')
  })

  it('applies class "spinner spinner--lg spinner--danger" with size="lg" color="danger"', () => {
    const wrapper = mount(Spinner, { props: { size: 'lg', color: 'danger' } })
    expect(wrapper.classes()).toContain('spinner')
    expect(wrapper.classes()).toContain('spinner--lg')
    expect(wrapper.classes()).toContain('spinner--danger')
  })

  it('applies class "spinner spinner--sm spinner--success" with size="sm" color="success"', () => {
    const wrapper = mount(Spinner, { props: { size: 'sm', color: 'success' } })
    expect(wrapper.classes()).toContain('spinner')
    expect(wrapper.classes()).toContain('spinner--sm')
    expect(wrapper.classes()).toContain('spinner--success')
  })

  it('applies class "spinner spinner--xl spinner--warning" with size="xl" color="warning"', () => {
    const wrapper = mount(Spinner, { props: { size: 'xl', color: 'warning' } })
    expect(wrapper.classes()).toContain('spinner')
    expect(wrapper.classes()).toContain('spinner--xl')
    expect(wrapper.classes()).toContain('spinner--warning')
  })

  it('applies class "spinner spinner--md spinner--current" with color="current"', () => {
    const wrapper = mount(Spinner, { props: { color: 'current' } })
    expect(wrapper.classes()).toContain('spinner')
    expect(wrapper.classes()).toContain('spinner--md')
    expect(wrapper.classes()).toContain('spinner--current')
  })

  it('merges consumer class prop with TVA classes', () => {
    const wrapper = mount(Spinner, { props: { class: 'my-custom-class' } })
    expect(wrapper.classes()).toContain('spinner')
    expect(wrapper.classes()).toContain('my-custom-class')
  })

  it('passes axe audit with zero violations', async () => {
    const wrapper = mount(Spinner, { attachTo: document.body })
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
    wrapper.unmount()
  })
})
