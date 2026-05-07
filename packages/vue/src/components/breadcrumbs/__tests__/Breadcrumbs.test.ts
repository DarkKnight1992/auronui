import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Breadcrumbs, BreadcrumbItem } from '../index'

function harness(template: string, props: Record<string, unknown> = {}) {
  return mount({
    components: { Breadcrumbs, BreadcrumbItem },
    props: ['maxItems'],
    template,
  }, { props })
}

describe('Breadcrumbs', () => {
  it('renders <nav aria-label="Breadcrumb">', () => {
    const w = harness(`
      <Breadcrumbs>
        <BreadcrumbItem href="/a">A</BreadcrumbItem>
        <BreadcrumbItem href="/a/b">B</BreadcrumbItem>
      </Breadcrumbs>
    `)
    const nav = w.find('nav')
    expect(nav.exists()).toBe(true)
    expect(nav.attributes('aria-label')).toBe('Breadcrumb')
  })

  it('renders <ol class="breadcrumbs">', () => {
    const w = harness(`
      <Breadcrumbs>
        <BreadcrumbItem href="/a">A</BreadcrumbItem>
      </Breadcrumbs>
    `)
    expect(w.find('ol.breadcrumbs').exists()).toBe(true)
  })

  it('last item has aria-current="page"', () => {
    const w = harness(`
      <Breadcrumbs>
        <BreadcrumbItem href="/a">A</BreadcrumbItem>
        <BreadcrumbItem href="/a/b">B</BreadcrumbItem>
        <BreadcrumbItem>C</BreadcrumbItem>
      </Breadcrumbs>
    `)
    const items = w.findAll('li.breadcrumbs__item')
    const last = items[items.length - 1]
    expect(last.attributes('aria-current')).toBe('page')
  })

  it('non-last items do NOT have aria-current', () => {
    const w = harness(`
      <Breadcrumbs>
        <BreadcrumbItem href="/a">A</BreadcrumbItem>
        <BreadcrumbItem href="/a/b">B</BreadcrumbItem>
        <BreadcrumbItem>C</BreadcrumbItem>
      </Breadcrumbs>
    `)
    const items = w.findAll('li.breadcrumbs__item')
    expect(items[0].attributes('aria-current')).toBeUndefined()
    expect(items[1].attributes('aria-current')).toBeUndefined()
  })

  it('separator span has aria-hidden="true"', () => {
    const w = harness(`
      <Breadcrumbs>
        <BreadcrumbItem href="/a">A</BreadcrumbItem>
        <BreadcrumbItem>B</BreadcrumbItem>
      </Breadcrumbs>
    `)
    const seps = w.findAll('span.breadcrumbs__separator')
    expect(seps.length).toBeGreaterThan(0)
    seps.forEach(s => expect(s.attributes('aria-hidden')).toBe('true'))
  })

  it('maxItems truncates: shows first + ellipsis + last (max-2)', () => {
    const w = harness(`
      <Breadcrumbs :max-items="maxItems">
        <BreadcrumbItem href="/1">1</BreadcrumbItem>
        <BreadcrumbItem href="/2">2</BreadcrumbItem>
        <BreadcrumbItem href="/3">3</BreadcrumbItem>
        <BreadcrumbItem href="/4">4</BreadcrumbItem>
        <BreadcrumbItem>5</BreadcrumbItem>
      </Breadcrumbs>
    `, { maxItems: 3 })
    const items = w.findAll('li.breadcrumbs__item')
    // Expected: 1, …, 5 (total 3)
    expect(items.length).toBe(3)
    expect(items[0].text()).toContain('1')
    expect(items[1].text()).toContain('…')
    expect(items[2].text()).toContain('5')
  })

  it('maxItems not set: renders all items', () => {
    const w = harness(`
      <Breadcrumbs>
        <BreadcrumbItem href="/1">1</BreadcrumbItem>
        <BreadcrumbItem href="/2">2</BreadcrumbItem>
        <BreadcrumbItem href="/3">3</BreadcrumbItem>
        <BreadcrumbItem>4</BreadcrumbItem>
      </Breadcrumbs>
    `)
    expect(w.findAll('li.breadcrumbs__item').length).toBe(4)
  })

  it('custom separator via #separator slot', () => {
    const w = harness(`
      <Breadcrumbs>
        <template #separator>&gt;</template>
        <BreadcrumbItem href="/a">A</BreadcrumbItem>
        <BreadcrumbItem>B</BreadcrumbItem>
      </Breadcrumbs>
    `)
    const seps = w.findAll('span.breadcrumbs__separator')
    expect(seps[0].text()).toContain('>')
  })
})
