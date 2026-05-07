import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import { describe, it, expect } from 'vitest'
import Separator from '../Separator.vue'

describe('Separator', () => {
  it('renders <hr> element when orientation="horizontal" (default)', () => {
    const wrapper = mount(Separator)
    expect(wrapper.element.tagName.toLowerCase()).toBe('hr')
  })

  it('renders <div> with role="separator" and aria-orientation="vertical" when orientation="vertical"', () => {
    const wrapper = mount(Separator, { props: { orientation: 'vertical' } })
    expect(wrapper.element.tagName.toLowerCase()).toBe('div')
    expect(wrapper.attributes('role')).toBe('separator')
    expect(wrapper.attributes('aria-orientation')).toBe('vertical')
  })

  it('applies "separator separator--horizontal separator--default" with defaults', () => {
    const wrapper = mount(Separator)
    expect(wrapper.classes()).toContain('separator')
    expect(wrapper.classes()).toContain('separator--horizontal')
    expect(wrapper.classes()).toContain('separator--default')
  })

  it('applies "separator separator--vertical separator--secondary" with orientation="vertical" variant="secondary"', () => {
    const wrapper = mount(Separator, {
      props: { orientation: 'vertical', variant: 'secondary' },
    })
    expect(wrapper.classes()).toContain('separator')
    expect(wrapper.classes()).toContain('separator--vertical')
    expect(wrapper.classes()).toContain('separator--secondary')
  })

  it('applies "separator separator--horizontal separator--tertiary" with variant="tertiary"', () => {
    const wrapper = mount(Separator, { props: { variant: 'tertiary' } })
    expect(wrapper.classes()).toContain('separator')
    expect(wrapper.classes()).toContain('separator--horizontal')
    expect(wrapper.classes()).toContain('separator--tertiary')
  })

  it('renders default slot content between two .separator__line divs when default slot provided', () => {
    const wrapper = mount(Separator, {
      slots: { default: '<span>Label</span>' },
    })
    const lines = wrapper.findAll('.separator__line')
    expect(lines).toHaveLength(2)
    const content = wrapper.find('.separator__content')
    expect(content.exists()).toBe(true)
    expect(content.text()).toBe('Label')
  })

  it('passes axe audit for horizontal separator', async () => {
    const wrapper = mount(Separator, { attachTo: document.body })
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
    wrapper.unmount()
  })

  it('passes axe audit for vertical separator', async () => {
    const wrapper = mount(Separator, {
      props: { orientation: 'vertical' },
      attachTo: document.body,
    })
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
    wrapper.unmount()
  })
})
