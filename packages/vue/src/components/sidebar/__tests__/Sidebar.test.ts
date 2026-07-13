import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Sidebar from '../Sidebar.vue'
import type { SidebarSectionData } from '../Sidebar.types'

const sections: SidebarSectionData[] = [
  {
    label: 'Getting Started',
    items: [
      { label: 'Introduction', href: '/intro' },
      { label: 'Installation', href: '/install' },
    ],
  },
  {
    label: 'Components',
    items: [
      { label: 'Button', href: '/components/button' },
      { label: 'Select', href: '/components/select' },
    ],
  },
]

describe('Sidebar — core', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/')
  })

  it('renders <nav aria-label="Sidebar"> by default', () => {
    const wrapper = mount(Sidebar, { props: { sections } })
    const nav = wrapper.find('nav')
    expect(nav.exists()).toBe(true)
    expect(nav.attributes('aria-label')).toBe('Sidebar')
  })

  it('renders a custom ariaLabel', () => {
    const wrapper = mount(Sidebar, { props: { sections, ariaLabel: 'Docs navigation' } })
    expect(wrapper.find('nav').attributes('aria-label')).toBe('Docs navigation')
  })

  it('renders all sections with their headings', () => {
    const wrapper = mount(Sidebar, { props: { sections } })
    expect(wrapper.text()).toContain('Getting Started')
    expect(wrapper.text()).toContain('Components')
  })

  it('renders all items with their links', () => {
    const wrapper = mount(Sidebar, { props: { sections } })
    const links = wrapper.findAll('a')
    expect(links.length).toBe(4)
    expect(links.map((l) => l.text())).toEqual(['Introduction', 'Installation', 'Button', 'Select'])
  })

  it('controlled activeHref sets aria-current="page" on the matching link only', () => {
    const wrapper = mount(Sidebar, { props: { sections, activeHref: '/components/button' } })
    const active = wrapper.findAll('a').filter((l) => l.attributes('aria-current') === 'page')
    expect(active.length).toBe(1)
    expect(active[0].text()).toBe('Button')
  })

  it('no activeHref and no matching location: no link is marked current', () => {
    const wrapper = mount(Sidebar, { props: { sections } })
    expect(wrapper.findAll('a[aria-current="page"]').length).toBe(0)
  })

  it('does not render a search box by default', () => {
    const wrapper = mount(Sidebar, { props: { sections } })
    expect(wrapper.find('input[type="search"]').exists()).toBe(false)
  })

  it('renders slot content when sections is not provided (compound mode)', () => {
    const wrapper = mount(Sidebar, {
      slots: { default: '<div class="custom-content">custom</div>' },
    })
    expect(wrapper.find('.custom-content').exists()).toBe(true)
  })
})

describe('Sidebar — active link auto-detection', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/')
  })

  it('auto-detects the active link from window.location.pathname when activeHref is not set', () => {
    window.history.pushState({}, '', '/components/select')
    const wrapper = mount(Sidebar, { props: { sections } })
    const active = wrapper.findAll('a').filter((l) => l.attributes('aria-current') === 'page')
    expect(active.length).toBe(1)
    expect(active[0].text()).toBe('Select')
  })

  it('activeHref prop overrides auto-detection', () => {
    window.history.pushState({}, '', '/components/select')
    const wrapper = mount(Sidebar, { props: { sections, activeHref: '/intro' } })
    const active = wrapper.findAll('a').filter((l) => l.attributes('aria-current') === 'page')
    expect(active.length).toBe(1)
    expect(active[0].text()).toBe('Introduction')
  })

  it('active link updates when the app navigates via history.pushState', async () => {
    window.history.pushState({}, '', '/intro')
    const wrapper = mount(Sidebar, { props: { sections } })
    expect(
      wrapper.findAll('a').filter((l) => l.attributes('aria-current') === 'page')[0].text(),
    ).toBe('Introduction')

    window.history.pushState({}, '', '/components/button')
    await nextTick()

    expect(
      wrapper.findAll('a').filter((l) => l.attributes('aria-current') === 'page')[0].text(),
    ).toBe('Button')
  })
})

describe('Sidebar — search', () => {
  it('renders a sticky search box when search is true', () => {
    const wrapper = mount(Sidebar, { props: { sections, search: true } })
    expect(wrapper.find('input[type="search"]').exists()).toBe(true)
  })

  it('typing in the search box filters items by label (case-insensitive)', async () => {
    const wrapper = mount(Sidebar, { props: { sections, search: true } })
    await wrapper.find('input[type="search"]').setValue('but')
    expect(wrapper.findAll('a').map((l) => l.text())).toEqual(['Button'])
  })

  it('hides a section entirely when none of its items match', async () => {
    const wrapper = mount(Sidebar, { props: { sections, search: true } })
    await wrapper.find('input[type="search"]').setValue('but')
    expect(wrapper.text()).not.toContain('Getting Started')
    expect(wrapper.text()).toContain('Components')
  })

  it('shows an empty state when no items match any section', async () => {
    const wrapper = mount(Sidebar, { props: { sections, search: true } })
    await wrapper.find('input[type="search"]').setValue('zzz-no-match')
    expect(wrapper.text()).toContain('No results found')
    expect(wrapper.findAll('a').length).toBe(0)
  })

  it('clearing the search restores all items', async () => {
    const wrapper = mount(Sidebar, { props: { sections, search: true } })
    const input = wrapper.find('input[type="search"]')
    await input.setValue('but')
    await input.setValue('')
    expect(wrapper.findAll('a').length).toBe(4)
  })

  it('a matching descendant keeps its whole branch (parent + all children) visible', async () => {
    const nestedSections: SidebarSectionData[] = [
      {
        label: 'Components',
        items: [{ label: 'Forms', items: [{ label: 'Button', href: '/button' }] }],
      },
    ]
    const wrapper = mount(Sidebar, { props: { sections: nestedSections, search: true } })
    await wrapper.find('input[type="search"]').setValue('but')
    expect(wrapper.text()).toContain('Forms')
    expect(wrapper.text()).toContain('Button')
  })
})
