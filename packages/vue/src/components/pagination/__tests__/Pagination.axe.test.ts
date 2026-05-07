import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import axe from 'axe-core'
import Pagination from '../Pagination.vue'
import PaginationContent from '../PaginationContent.vue'
import PaginationItem from '../PaginationItem.vue'
import PaginationPrev from '../PaginationPrev.vue'
import PaginationNext from '../PaginationNext.vue'
import PaginationFirst from '../PaginationFirst.vue'
import PaginationLast from '../PaginationLast.vue'
import PaginationEllipsis from '../PaginationEllipsis.vue'

const wrappers: ReturnType<typeof mount>[] = []
afterEach(() => {
  wrappers.forEach(w => w.unmount())
  wrappers.length = 0
})

/** Helper: build a full numeric pagination for axe testing */
function mountNumeric(page: number, totalItems: number, itemsPerPage = 10) {
  const w = mount(
    defineComponent({
      components: {
        Pagination,
        PaginationContent,
        PaginationItem,
        PaginationPrev,
        PaginationNext,
        PaginationFirst,
        PaginationLast,
        PaginationEllipsis,
      },
      template: `
        <Pagination :page="${page}" :items-per-page="${itemsPerPage}" :total-items="${totalItems}" :show-edges="true" :sibling-count="2">
          <PaginationContent v-slot="{ items }">
            <PaginationFirst />
            <PaginationPrev />
            <template v-for="item in items" :key="item.type === 'page' ? item.value : ('ellipsis-' + item.value)">
              <PaginationItem v-if="item.type === 'page'" :value="item.value" />
              <PaginationEllipsis v-else />
            </template>
            <PaginationNext />
            <PaginationLast />
          </PaginationContent>
        </Pagination>
      `,
    }),
    { attachTo: document.body }
  )
  wrappers.push(w)
  return w
}

describe('Pagination axe audit — numeric mode', () => {
  it('passes axe on page 1 of 5 (Prev/First disabled)', async () => {
    const w = mountNumeric(1, 50)
    const results = await axe.run(w.element as HTMLElement)
    expect(results.violations).toEqual([])
  })

  it('passes axe on middle page (all nav buttons enabled)', async () => {
    const w = mountNumeric(3, 50)
    const results = await axe.run(w.element as HTMLElement)
    expect(results.violations).toEqual([])
  })

  it('passes axe on last page of 5 (Next/Last disabled)', async () => {
    const w = mountNumeric(5, 50)
    const results = await axe.run(w.element as HTMLElement)
    expect(results.violations).toEqual([])
  })

  it('passes axe with ellipsis (10 pages, page 5)', async () => {
    const w = mountNumeric(5, 100)
    const results = await axe.run(w.element as HTMLElement)
    expect(results.violations).toEqual([])
  })

  it('passes axe with size=sm', async () => {
    const w = mount(
      defineComponent({
        components: { Pagination, PaginationContent, PaginationItem, PaginationPrev, PaginationNext },
        template: `
          <Pagination :page="1" :items-per-page="10" :total-items="30" size="sm">
            <PaginationContent v-slot="{ items }">
              <PaginationPrev />
              <template v-for="item in items" :key="item.type === 'page' ? item.value : 'ellipsis'">
                <PaginationItem v-if="item.type === 'page'" :value="item.value" />
              </template>
              <PaginationNext />
            </PaginationContent>
          </Pagination>
        `,
      }),
      { attachTo: document.body }
    )
    wrappers.push(w)
    const results = await axe.run(w.element as HTMLElement)
    expect(results.violations).toEqual([])
  })

  it('passes axe with size=lg', async () => {
    const w = mount(
      defineComponent({
        components: { Pagination, PaginationContent, PaginationItem, PaginationPrev, PaginationNext },
        template: `
          <Pagination :page="2" :items-per-page="10" :total-items="30" size="lg">
            <PaginationContent v-slot="{ items }">
              <PaginationPrev />
              <template v-for="item in items" :key="item.type === 'page' ? item.value : 'ellipsis'">
                <PaginationItem v-if="item.type === 'page'" :value="item.value" />
              </template>
              <PaginationNext />
            </PaginationContent>
          </Pagination>
        `,
      }),
      { attachTo: document.body }
    )
    wrappers.push(w)
    const results = await axe.run(w.element as HTMLElement)
    expect(results.violations).toEqual([])
  })
})

describe('Pagination axe audit — cursor mode', () => {
  it('passes axe in cursor mode with both cursors present', async () => {
    const w = mount(
      defineComponent({
        components: { Pagination, PaginationContent },
        template: `
          <Pagination
            type="cursor"
            :page="2"
            :items-per-page="10"
            :total-items="100"
            before-cursor="cursor_before"
            after-cursor="cursor_after"
          >
            <PaginationContent />
          </Pagination>
        `,
      }),
      { attachTo: document.body }
    )
    wrappers.push(w)
    const results = await axe.run(w.element as HTMLElement)
    expect(results.violations).toEqual([])
  })

  it('passes axe in cursor mode on first page (no before cursor)', async () => {
    const w = mount(
      defineComponent({
        components: { Pagination, PaginationContent },
        template: `
          <Pagination
            type="cursor"
            :page="1"
            :items-per-page="10"
            :total-items="100"
            :before-cursor="null"
            after-cursor="cursor_after"
          >
            <PaginationContent />
          </Pagination>
        `,
      }),
      { attachTo: document.body }
    )
    wrappers.push(w)
    const results = await axe.run(w.element as HTMLElement)
    expect(results.violations).toEqual([])
  })
})

describe('Pagination axe audit — aria attributes', () => {
  it('PaginationPrev has aria-label="Previous page"', async () => {
    const w = mount(
      defineComponent({
        components: { Pagination, PaginationPrev },
        template: `
          <Pagination :page="2" :items-per-page="10" :total-items="50">
            <PaginationPrev />
          </Pagination>
        `,
      }),
      { attachTo: document.body }
    )
    wrappers.push(w)
    const btn = w.find('button')
    expect(btn.attributes('aria-label')).toBe('Previous page')
  })

  it('PaginationNext has aria-label="Next page"', async () => {
    const w = mount(
      defineComponent({
        components: { Pagination, PaginationNext },
        template: `
          <Pagination :page="1" :items-per-page="10" :total-items="50">
            <PaginationNext />
          </Pagination>
        `,
      }),
      { attachTo: document.body }
    )
    wrappers.push(w)
    const btn = w.find('button')
    expect(btn.attributes('aria-label')).toBe('Next page')
  })

  it('PaginationEllipsis has aria-hidden="true"', async () => {
    const w = mount(
      defineComponent({
        components: { Pagination, PaginationEllipsis },
        template: `
          <Pagination :page="1" :items-per-page="10" :total-items="50">
            <PaginationEllipsis />
          </Pagination>
        `,
      }),
      { attachTo: document.body }
    )
    wrappers.push(w)
    // PaginationEllipsis wraps Reka UI PaginationEllipsis which renders a span
    const el = w.findComponent(PaginationEllipsis).element
    expect(el.getAttribute('aria-hidden')).toBe('true')
  })
})
