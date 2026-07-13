import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Statistic from '../Statistic.vue'

describe('Statistic', () => {
  it('renders label and value', () => {
    const wrapper = mount(Statistic, { props: { label: 'Revenue', value: 1234 } })
    expect(wrapper.find('[data-slot="statistic-label"]').text()).toBe('Revenue')
    expect(wrapper.find('[data-slot="statistic-value"]').text()).toBe('1234')
  })

  it('renders a string value verbatim', () => {
    const wrapper = mount(Statistic, { props: { label: 'Status', value: 'Active' } })
    expect(wrapper.find('[data-slot="statistic-value"]').text()).toBe('Active')
  })

  it('applies precision to a numeric value', () => {
    const wrapper = mount(Statistic, { props: { label: 'Rate', value: 12.3456, precision: 2 } })
    expect(wrapper.find('[data-slot="statistic-value"]').text()).toBe('12.35')
  })

  it('renders prefix and suffix when provided', () => {
    const wrapper = mount(Statistic, { props: { label: 'Price', value: 42, prefix: '$', suffix: 'USD' } })
    expect(wrapper.find('[data-slot="statistic-prefix"]').text()).toBe('$')
    expect(wrapper.find('[data-slot="statistic-suffix"]').text()).toBe('USD')
  })

  it('renders no prefix/suffix spans when not provided', () => {
    const wrapper = mount(Statistic, { props: { label: 'Price', value: 42 } })
    expect(wrapper.find('[data-slot="statistic-prefix"]').exists()).toBe(false)
    expect(wrapper.find('[data-slot="statistic-suffix"]').exists()).toBe(false)
  })

  it('renders description when provided', () => {
    const wrapper = mount(Statistic, { props: { label: 'Users', value: 100, description: 'Last 30 days' } })
    expect(wrapper.find('[data-slot="statistic-description"]').text()).toBe('Last 30 days')
  })

  it('renders no description span when not provided', () => {
    const wrapper = mount(Statistic, { props: { label: 'Users', value: 100 } })
    expect(wrapper.find('[data-slot="statistic-description"]').exists()).toBe(false)
  })

  it('isLoading: true renders a Skeleton instead of the value', () => {
    const wrapper = mount(Statistic, { props: { label: 'Users', value: 100, isLoading: true } })
    expect(wrapper.find('[data-slot="statistic-value"]').exists()).toBe(false)
    expect(wrapper.find('[aria-hidden="true"]').exists()).toBe(true)
  })

  it('isLoading: false renders the value, not a Skeleton', () => {
    const wrapper = mount(Statistic, { props: { label: 'Users', value: 100, isLoading: false } })
    expect(wrapper.find('[data-slot="statistic-value"]').exists()).toBe(true)
  })

  it('applies each color class to the value', () => {
    const colors = ['default', 'primary', 'secondary', 'accent', 'success', 'warning', 'danger'] as const
    for (const color of colors) {
      const wrapper = mount(Statistic, { props: { label: 'X', value: 1, color } })
      expect(wrapper.find('[data-slot="statistic-value"]').classes()).toContain(`statistic__value--${color}`)
    }
  })

  it('renders trend indicator with data-trend and trendValue text', () => {
    const wrapper = mount(Statistic, { props: { label: 'Growth', value: 10, trend: 'up', trendValue: '12%' } })
    const trend = wrapper.find('[data-slot="statistic-trend"]')
    expect(trend.exists()).toBe(true)
    expect(trend.attributes('data-trend')).toBe('up')
    expect(trend.text()).toContain('12%')
  })

  it('renders no trend indicator when trend is not provided', () => {
    const wrapper = mount(Statistic, { props: { label: 'Growth', value: 10 } })
    expect(wrapper.find('[data-slot="statistic-trend"]').exists()).toBe(false)
  })

  it('passing class="custom" merges with base classes on the root', () => {
    const wrapper = mount(Statistic, { props: { label: 'X', value: 1, class: 'custom-class' } })
    expect(wrapper.classes()).toContain('custom-class')
    expect(wrapper.classes()).toContain('statistic')
  })
})
