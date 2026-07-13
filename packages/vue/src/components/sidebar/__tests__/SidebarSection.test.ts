import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import SidebarSection from '../SidebarSection.vue'
import SidebarItem from '../SidebarItem.vue'
import { withSidebarContext } from './testHarness'

describe('SidebarSection', () => {
  it('renders a heading when label is provided', () => {
    const wrapper = mount(
      withSidebarContext(() =>
        h(SidebarSection, { label: 'Components', items: [{ label: 'Button', href: '/button' }] }),
      ),
    )
    expect(wrapper.text()).toContain('Components')
  })

  it('renders no heading when label is omitted', () => {
    const wrapper = mount(
      withSidebarContext(() => h(SidebarSection, { items: [{ label: 'Button', href: '/button' }] })),
    )
    expect(wrapper.find('.sidebar__section-heading').exists()).toBe(false)
  })

  it('renders one SidebarItem per entry in items', () => {
    const wrapper = mount(
      withSidebarContext(() =>
        h(SidebarSection, {
          items: [
            { label: 'Button', href: '/button' },
            { label: 'Select', href: '/select' },
          ],
        }),
      ),
    )
    expect(wrapper.findAllComponents(SidebarItem).length).toBe(2)
  })

  it('supports the compound slot API in place of the items prop', () => {
    const wrapper = mount(
      withSidebarContext(() =>
        h(SidebarSection, { label: 'Custom' }, () =>
          h('li', null, [h(SidebarItem, { label: 'Manual', href: '/manual' })]),
        ),
      ),
    )
    expect(wrapper.text()).toContain('Manual')
  })
})
