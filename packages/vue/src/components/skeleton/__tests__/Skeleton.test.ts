import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import { describe, it, expect } from 'vitest'
import Skeleton from '../Skeleton.vue'

describe('Skeleton', () => {
  it('renders a div element', () => {
    const wrapper = mount(Skeleton)
    expect(wrapper.element.tagName.toLowerCase()).toBe('div')
  })

  it('has aria-hidden="true" attribute', () => {
    const wrapper = mount(Skeleton)
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })

  it('applies class "skeleton skeleton--shimmer" with default animationType="shimmer"', () => {
    const wrapper = mount(Skeleton)
    expect(wrapper.classes()).toContain('skeleton')
    expect(wrapper.classes()).toContain('skeleton--shimmer')
  })

  it('applies class "skeleton skeleton--pulse" with animationType="pulse"', () => {
    const wrapper = mount(Skeleton, { props: { animationType: 'pulse' } })
    expect(wrapper.classes()).toContain('skeleton')
    expect(wrapper.classes()).toContain('skeleton--pulse')
  })

  it('applies class "skeleton skeleton--none" with animationType="none"', () => {
    const wrapper = mount(Skeleton, { props: { animationType: 'none' } })
    expect(wrapper.classes()).toContain('skeleton')
    expect(wrapper.classes()).toContain('skeleton--none')
  })

  it('merges consumer class prop with TVA base slot classes', () => {
    const wrapper = mount(Skeleton, { props: { class: 'my-custom-class' } })
    expect(wrapper.classes()).toContain('skeleton')
    expect(wrapper.classes()).toContain('my-custom-class')
  })

  it('renders default slot content when provided', () => {
    const wrapper = mount(Skeleton, {
      slots: { default: '<span>Content</span>' },
    })
    expect(wrapper.find('span').exists()).toBe(true)
    expect(wrapper.find('span').text()).toBe('Content')
  })

  it('passes axe audit with zero violations', async () => {
    const wrapper = mount(Skeleton, { attachTo: document.body })
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
    wrapper.unmount()
  })
})
