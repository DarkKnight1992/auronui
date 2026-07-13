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

  it('renders nested children, expanded by default', () => {
    const wrapper = mountItem({
      label: 'Components',
      href: '/components',
      items: [
        { label: 'Button', href: '/components/button' },
        { label: 'Select', href: '/components/select' },
      ],
    })
    const links = wrapper.findAll('a')
    expect(links.map((l) => l.text())).toEqual(['Components', 'Button', 'Select'])
  })

  it('renders no nested list when items is not provided', () => {
    const wrapper = mountItem({ label: 'Home', href: '/' })
    expect(wrapper.find('.sidebar__item-children').exists()).toBe(false)
  })

  it('marks a nested child as active when its href matches activeHref', () => {
    const wrapper = mountItem(
      {
        label: 'Components',
        href: '/components',
        items: [{ label: 'Button', href: '/components/button' }],
      },
      { activeHref: '/components/button' },
    )
    const active = wrapper.findAll('a').filter((l) => l.attributes('aria-current') === 'page')
    expect(active.length).toBe(1)
    expect(active[0].text()).toBe('Button')
  })

  it('renders a toggle button with aria-expanded="true" when an item has children', () => {
    const wrapper = mountItem({
      label: 'Components',
      href: '/components',
      items: [{ label: 'Button', href: '/components/button' }],
    })
    const toggle = wrapper.find('button[aria-expanded]')
    expect(toggle.exists()).toBe(true)
    expect(toggle.attributes('aria-expanded')).toBe('true')
  })

  it('renders no toggle button when an item has no children', () => {
    const wrapper = mountItem({ label: 'Home', href: '/' })
    expect(wrapper.find('button[aria-expanded]').exists()).toBe(false)
  })

  it('clicking the toggle collapses the nested children', async () => {
    const wrapper = mountItem({
      label: 'Components',
      href: '/components',
      items: [{ label: 'Button', href: '/components/button' }],
    })
    expect(wrapper.find('.sidebar__item-children').exists()).toBe(true)

    await wrapper.find('button[aria-expanded]').trigger('click')

    expect(wrapper.find('.sidebar__item-children').exists()).toBe(false)
    expect(wrapper.find('button[aria-expanded]').attributes('aria-expanded')).toBe('false')
  })

  it('clicking the toggle does not navigate the parent Link', async () => {
    const wrapper = mountItem({
      label: 'Components',
      href: '/components',
      items: [{ label: 'Button', href: '/components/button' }],
    })
    await wrapper.find('button[aria-expanded]').trigger('click')
    // Parent Link itself is untouched by the toggle click (no navigation side effect
    // to assert directly in jsdom, but the toggle must be a sibling, not nested in <a>).
    expect(wrapper.find('a[href="/components"] button').exists()).toBe(false)
  })

  it('a manual collapse sticks even when the group contains the active link', async () => {
    const wrapper = mountItem(
      {
        label: 'Components',
        href: '/components',
        items: [{ label: 'Button', href: '/components/button' }],
      },
      { activeHref: '/components/button' },
    )
    await wrapper.find('button[aria-expanded]').trigger('click')
    // Collapsed, despite containing the active link — an explicit user
    // choice must not be silently overridden.
    expect(wrapper.find('.sidebar__item-children').exists()).toBe(false)
  })

  it('an active search query still reveals children even if manually collapsed', async () => {
    const Harness = withSidebarContext(() =>
      h(SidebarItem, {
        label: 'Components',
        href: '/components',
        items: [{ label: 'Button', href: '/components/button' }],
      }),
    )
    const wrapper = mount(Harness)
    await wrapper.find('button[aria-expanded]').trigger('click')
    expect(wrapper.find('.sidebar__item-children').exists()).toBe(false)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(wrapper.vm as any).searchQuery = 'button'
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.sidebar__item-children').exists()).toBe(true)
  })

  it('renders a button (not a Link) for a childless-href group item, toggling on click', async () => {
    const wrapper = mountItem({
      label: 'Group',
      items: [{ label: 'Button', href: '/components/button' }],
    })
    // The group's own row has no href, so it must render as a <button>, not
    // an <a> — even though its child ("Button") legitimately has its own <a>.
    const row = wrapper.find('button.sidebar__item')
    expect(row.exists()).toBe(true)
    expect(row.attributes('aria-expanded')).toBe('true')

    await row.trigger('click')
    expect(wrapper.find('.sidebar__item-children').exists()).toBe(false)
  })
})
