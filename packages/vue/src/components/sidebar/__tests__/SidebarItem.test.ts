import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import SidebarItem from '../SidebarItem.vue'
import { Icon } from '../../icon'
import Chip from '../../chip/Chip.vue'
import { withSidebarContext } from './testHarness'

function mountItem(itemProps: Record<string, unknown>, options: { activeHref?: string } = {}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return mount(withSidebarContext(() => h(SidebarItem, itemProps as any), options))
}

describe('SidebarItem', () => {
  it('renders a Link with the given label and href', () => {
    const wrapper = mountItem({ label: 'Home', href: '/' })
    const link = wrapper.find('a')
    expect(link.text()).toContain('Home')
    expect(link.attributes('href')).toBe('/')
  })

  it('renders an icon from an iconify string name via Icon', () => {
    const wrapper = mountItem({ label: 'Home', href: '/', icon: 'lucide:home' })
    const icon = wrapper.findComponent(Icon)
    expect(icon.exists()).toBe(true)
    expect(icon.props('icon')).toBe('lucide:home')
  })

  it('renders a custom component passed as icon', () => {
    const CustomIcon = defineComponent({ template: '<svg class="custom-icon" />' })
    const wrapper = mountItem({ label: 'Home', href: '/', icon: CustomIcon })
    expect(wrapper.find('svg.custom-icon').exists()).toBe(true)
  })

  it('renders no icon wrapper when icon is not provided', () => {
    const wrapper = mountItem({ label: 'Home', href: '/' })
    expect(wrapper.findComponent(Icon).exists()).toBe(false)
  })

  it('renders a Chip badge with the given color when badge is set', () => {
    const wrapper = mountItem({ label: 'Inbox', href: '/inbox', badge: 3, badgeColor: 'danger' })
    const chip = wrapper.findComponent(Chip)
    expect(chip.exists()).toBe(true)
    expect(chip.text()).toBe('3')
    expect(chip.props('color')).toBe('danger')
  })

  it('renders no badge when badge is not set', () => {
    const wrapper = mountItem({ label: 'Home', href: '/' })
    expect(wrapper.findComponent(Chip).exists()).toBe(false)
  })

  it('passes isDisabled through to the underlying Link', () => {
    const wrapper = mountItem({ label: 'Locked', href: '/locked', isDisabled: true })
    expect(wrapper.find('a').attributes('aria-disabled')).toBe('true')
  })

  it('passes isExternal through to the underlying Link (opens in new tab)', () => {
    const wrapper = mountItem({ label: 'Docs', href: 'https://example.com', isExternal: true })
    const link = wrapper.find('a')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener noreferrer')
  })

  it('sets aria-current="page" when its href matches the provided activeHref', () => {
    const wrapper = mountItem({ label: 'Home', href: '/' }, { activeHref: '/' })
    expect(wrapper.find('a').attributes('aria-current')).toBe('page')
  })

  it('does not set aria-current when its href does not match', () => {
    const wrapper = mountItem({ label: 'Home', href: '/' }, { activeHref: '/other' })
    expect(wrapper.find('a').attributes('aria-current')).toBeUndefined()
  })
})
