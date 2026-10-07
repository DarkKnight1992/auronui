import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Link from '../Link.vue'
import BreadcrumbItem from '../../breadcrumbs/BreadcrumbItem.vue'
import Breadcrumbs from '../../breadcrumbs/Breadcrumbs.vue'
import ToolbarLink from '../../toolbar/ToolbarLink.vue'
import Toolbar from '../../toolbar/Toolbar.vue'
import Sidebar from '../../sidebar/Sidebar.vue'

// Vue (unlike React 19) renders a `javascript:` href as-is, so an app passing
// user-supplied URLs through these components would ship a script URL.
describe('link components refuse script URLs', () => {
  it('Link', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const w = mount(Link, { props: { href: 'javascript:alert(1)' }, slots: { default: 'x' } })
    expect(w.html()).not.toContain('javascript:')
    const ok = mount(Link, { props: { href: '/safe' }, slots: { default: 'x' } })
    expect(ok.find('a').attributes('href')).toBe('/safe')
  })

  it('Breadcrumbs items and BreadcrumbItem', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const w = mount(Breadcrumbs, { props: { items: [{ label: 'A', href: 'javascript:alert(1)' }, { label: 'B' }] } })
    expect(w.html()).not.toContain('javascript:')
    const w2 = mount({ components: { Breadcrumbs, BreadcrumbItem }, template: '<Breadcrumbs><BreadcrumbItem href="javascript:alert(1)">A</BreadcrumbItem><BreadcrumbItem>B</BreadcrumbItem></Breadcrumbs>' })
    expect(w2.html()).not.toContain('javascript:')
  })

  it('ToolbarLink', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const w = mount({ components: { Toolbar, ToolbarLink }, template: '<Toolbar aria-label="t"><ToolbarLink href="javascript:alert(1)">A</ToolbarLink></Toolbar>' })
    expect(w.html()).not.toContain('javascript:')
  })

  it('Sidebar items', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const w = mount(Sidebar, { props: { ariaLabel: 'Nav', sections: [{ label: 'S', items: [{ label: 'A', href: 'javascript:alert(1)' }] }] } })
    expect(w.html()).not.toContain('javascript:')
  })
})
