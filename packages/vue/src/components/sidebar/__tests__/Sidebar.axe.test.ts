import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import Sidebar from '../Sidebar.vue'
import type { SidebarSectionData } from '../Sidebar.types'

const sections: SidebarSectionData[] = [
  {
    label: 'Getting Started',
    items: [
      { label: 'Introduction', href: '/intro', icon: 'lucide:book' },
      { label: 'Installation', href: '/install' },
    ],
  },
  {
    label: 'Components',
    items: [
      { label: 'Button', href: '/components/button', badge: 'New' },
      { label: 'Select', href: '/components/select' },
    ],
  },
]

describe('Sidebar — axe audit', () => {
  const wrappers: ReturnType<typeof mount>[] = []
  afterEach(() => {
    wrappers.forEach((w) => w.unmount())
    wrappers.length = 0
  })

  it('passes axe with sections, icons, badges, and an active link', async () => {
    const wrapper = mount(Sidebar, {
      props: { sections, activeHref: '/components/button', ariaLabel: 'Docs navigation' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    const results = await axe.run(wrapper.element as HTMLElement)
    expect(results.violations).toEqual([])
  })

  it('passes axe with search enabled', async () => {
    const wrapper = mount(Sidebar, {
      props: { sections, search: true, ariaLabel: 'Docs navigation' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    const results = await axe.run(wrapper.element as HTMLElement)
    expect(results.violations).toEqual([])
  })

  it('passes axe with nested, collapsible children (both a group-label item with no href, and a navigable parent with a toggle sibling)', async () => {
    const nestedSections: SidebarSectionData[] = [
      {
        label: 'Components',
        items: [
          {
            label: 'Forms',
            items: [
              { label: 'Input', href: '/components/input' },
              { label: 'Select', href: '/components/select' },
            ],
          },
          {
            label: 'Layout',
            href: '/components/layout',
            items: [{ label: 'Grid', href: '/components/layout/grid' }],
          },
        ],
      },
    ]
    const wrapper = mount(Sidebar, {
      props: { sections: nestedSections, activeHref: '/components/select', ariaLabel: 'Docs navigation' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    const results = await axe.run(wrapper.element as HTMLElement)
    expect(results.violations).toEqual([])
  })
})
