import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import { Breadcrumbs, BreadcrumbItem } from '../index'

describe('Breadcrumbs axe', () => {
  const wrappers: ReturnType<typeof mount>[] = []
  afterEach(() => { wrappers.forEach(w => w.unmount()); wrappers.length = 0 })

  it('default breadcrumbs pass axe', async () => {
    const w = mount({
      components: { Breadcrumbs, BreadcrumbItem },
      template: `
        <Breadcrumbs>
          <BreadcrumbItem href="/home">Home</BreadcrumbItem>
          <BreadcrumbItem href="/home/products">Products</BreadcrumbItem>
          <BreadcrumbItem>Detail</BreadcrumbItem>
        </Breadcrumbs>
      `,
    }, { attachTo: document.body })
    wrappers.push(w)
    const r = await axe.run(w.element as HTMLElement)
    expect(r.violations).toEqual([])
  })

  it('truncated breadcrumbs pass axe', async () => {
    const w = mount({
      components: { Breadcrumbs, BreadcrumbItem },
      template: `
        <Breadcrumbs :max-items="3">
          <BreadcrumbItem href="/1">One</BreadcrumbItem>
          <BreadcrumbItem href="/2">Two</BreadcrumbItem>
          <BreadcrumbItem href="/3">Three</BreadcrumbItem>
          <BreadcrumbItem>Four</BreadcrumbItem>
        </Breadcrumbs>
      `,
    }, { attachTo: document.body })
    wrappers.push(w)
    const r = await axe.run(w.element as HTMLElement)
    expect(r.violations).toEqual([])
  })
})
