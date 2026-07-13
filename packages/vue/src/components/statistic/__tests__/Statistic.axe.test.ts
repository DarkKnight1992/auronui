import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import Statistic from '../Statistic.vue'

describe('Statistic axe audit', () => {
  const mountedWrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    mountedWrappers.forEach(w => w.unmount())
    mountedWrappers.length = 0
  })

  it('passes axe in default state', async () => {
    const wrapper = mount(Statistic, {
      props: { label: 'Revenue', value: 1234, prefix: '$' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe with description and trend', async () => {
    const wrapper = mount(Statistic, {
      props: { label: 'Growth', value: 12, suffix: '%', description: 'Last 30 days', trend: 'up', trendValue: '3%' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })

  it('passes axe while loading', async () => {
    const wrapper = mount(Statistic, {
      props: { label: 'Users', value: 0, isLoading: true },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
