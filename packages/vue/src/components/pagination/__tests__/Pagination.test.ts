import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref, nextTick } from 'vue'
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

/** Helper: build a full numeric pagination (5 pages, 10 per page, 50 total items) */
function makeNumeric(page = 1) {
  return defineComponent({
    components: { Pagination, PaginationContent, PaginationItem, PaginationPrev, PaginationNext },
    setup() { return { page: ref(page) } },
    template: `
      <Pagination v-model:page="page" :items-per-page="10" :total-items="50" :sibling-count="5">
        <PaginationContent v-slot="{ items }">
          <PaginationPrev />
          <template v-for="item in items" :key="item.type === 'page' ? item.value : 'ellipsis'">
            <PaginationItem v-if="item.type === 'page'" :value="item.value" />
          </template>
          <PaginationNext />
        </PaginationContent>
      </Pagination>
    `,
  })
}

describe('Pagination — numeric mode', () => {
  it('renders as a nav element', () => {
    const w = mount(Pagination, {
      props: { page: 1, itemsPerPage: 10, totalItems: 50 },
      attachTo: document.body,
    })
    wrappers.push(w)
    // Reka UI PaginationRoot renders as <nav>; find it in the rendered tree
    const nav = w.find('nav')
    expect(nav.exists()).toBe(true)
  })

  it('applies pagination base class', () => {
    const w = mount(Pagination, {
      props: { page: 1, itemsPerPage: 10, totalItems: 50 },
    })
    wrappers.push(w)
    const nav = w.find('nav')
    expect(nav.classes()).toContain('pagination')
  })

  it('applies size variant class', () => {
    const w = mount(Pagination, {
      props: { page: 1, itemsPerPage: 10, totalItems: 50, size: 'lg' },
    })
    wrappers.push(w)
    const nav = w.find('nav')
    expect(nav.classes()).toContain('pagination--lg')
  })

  it('renders 5 page items for 50 items / 10 per page', () => {
    const w = mount(makeNumeric(1), { attachTo: document.body })
    wrappers.push(w)
    const items = w.findAllComponents(PaginationItem)
    expect(items).toHaveLength(5)
  })

  it('emits update:page when page changes', async () => {
    const w = mount(Pagination, {
      props: { page: 1, itemsPerPage: 10, totalItems: 50 },
      attachTo: document.body,
    })
    wrappers.push(w)
    // Trigger page change via the component's handler directly
    const vm = w.vm as any
    vm.handlePageChange(3)
    await nextTick()
    expect(w.emitted('update:page')).toBeTruthy()
    expect(w.emitted('update:page')![0]).toEqual([3])
  })

  it('clamps page to [1, totalPages] on emit (T-08-01)', async () => {
    const w = mount(Pagination, {
      props: { page: 1, itemsPerPage: 10, totalItems: 50 },
      attachTo: document.body,
    })
    wrappers.push(w)
    const vm = w.vm as any
    // Below minimum
    vm.handlePageChange(0)
    await nextTick()
    expect(w.emitted('update:page')![0]).toEqual([1])
    // Above maximum (totalPages=5)
    vm.handlePageChange(100)
    await nextTick()
    expect(w.emitted('update:page')![1]).toEqual([5])
  })

  it('calculates totalPages = ceil(totalItems / itemsPerPage)', async () => {
    const w = mount(Pagination, {
      props: { page: 1, itemsPerPage: 7, totalItems: 50 },
    })
    wrappers.push(w)
    // totalPages should be Math.ceil(50/7) = 8
    const vm = w.vm as any
    expect(vm.totalPages).toBe(8)
  })

  it('totalPages is at least 1 when totalItems=0 (T-08-03)', () => {
    const w = mount(Pagination, {
      props: { page: 1, itemsPerPage: 10, totalItems: 0 },
    })
    wrappers.push(w)
    const vm = w.vm as any
    expect(vm.totalPages).toBe(1)
  })
})

describe('Pagination — PaginationContent', () => {
  it('renders pagination__content class', () => {
    const w = mount(
      defineComponent({
        components: { Pagination, PaginationContent },
        template: `
          <Pagination :page="1" :items-per-page="10" :total-items="50">
            <PaginationContent v-slot="{ items }">
              <span v-for="(item, i) in items" :key="i">{{ item.type }}</span>
            </PaginationContent>
          </Pagination>
        `,
      }),
      { attachTo: document.body }
    )
    wrappers.push(w)
    // Find the element with the pagination__content class in the rendered DOM
    const content = w.find('.pagination__content')
    expect(content.exists()).toBe(true)
  })
})

describe('Pagination — PaginationItem', () => {
  it('renders page number inside item', () => {
    const w = mount(
      defineComponent({
        components: { Pagination, PaginationContent, PaginationItem },
        template: `
          <Pagination :page="1" :items-per-page="10" :total-items="20">
            <PaginationContent v-slot="{ items }">
              <template v-for="item in items" :key="item.type === 'page' ? item.value : 'ellipsis'">
                <PaginationItem v-if="item.type === 'page'" :value="item.value" />
              </template>
            </PaginationContent>
          </Pagination>
        `,
      }),
      { attachTo: document.body }
    )
    wrappers.push(w)
    // Should render page 1 and page 2 buttons
    const buttons = w.findAll('button[data-type="page"]')
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  })

  it('active page has data-selected attribute', async () => {
    const w = mount(
      defineComponent({
        components: { Pagination, PaginationContent, PaginationItem },
        template: `
          <Pagination :page="2" :items-per-page="10" :total-items="50">
            <PaginationContent v-slot="{ items }">
              <template v-for="item in items" :key="item.type === 'page' ? item.value : 'ellipsis'">
                <PaginationItem v-if="item.type === 'page'" :value="item.value" />
              </template>
            </PaginationContent>
          </Pagination>
        `,
      }),
      { attachTo: document.body }
    )
    wrappers.push(w)
    await nextTick()
    const selected = w.find('[data-selected="true"]')
    expect(selected.exists()).toBe(true)
    // The selected button should be page 2
    expect(selected.attributes('aria-label')).toBe('Page 2')
  })

  it('renders aria-label for each page button', () => {
    const w = mount(
      defineComponent({
        components: { Pagination, PaginationContent, PaginationItem },
        template: `
          <Pagination :page="1" :items-per-page="10" :total-items="20">
            <PaginationContent v-slot="{ items }">
              <template v-for="item in items" :key="item.type === 'page' ? item.value : 'ellipsis'">
                <PaginationItem v-if="item.type === 'page'" :value="item.value" />
              </template>
            </PaginationContent>
          </Pagination>
        `,
      }),
      { attachTo: document.body }
    )
    wrappers.push(w)
    const btn = w.find('button[data-type="page"]')
    expect(btn.attributes('aria-label')).toMatch(/page/i)
  })
})

describe('Pagination — Prev/Next disabled states', () => {
  it('PaginationPrev is disabled on page 1 (T-08-04)', () => {
    const w = mount(
      defineComponent({
        components: { Pagination, PaginationPrev },
        template: `
          <Pagination :page="1" :items-per-page="10" :total-items="50">
            <PaginationPrev />
          </Pagination>
        `,
      }),
      { attachTo: document.body }
    )
    wrappers.push(w)
    const btn = w.find('button')
    expect(btn.attributes('disabled')).toBeDefined()
  })

  it('PaginationNext is disabled on last page (T-08-04)', () => {
    const w = mount(
      defineComponent({
        components: { Pagination, PaginationNext },
        template: `
          <Pagination :page="5" :items-per-page="10" :total-items="50">
            <PaginationNext />
          </Pagination>
        `,
      }),
      { attachTo: document.body }
    )
    wrappers.push(w)
    const btn = w.find('button')
    expect(btn.attributes('disabled')).toBeDefined()
  })

  it('PaginationPrev is enabled on page 2', () => {
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
    expect(btn.attributes('disabled')).toBeUndefined()
  })

  it('PaginationNext is enabled on page 4 of 5', () => {
    const w = mount(
      defineComponent({
        components: { Pagination, PaginationNext },
        template: `
          <Pagination :page="4" :items-per-page="10" :total-items="50">
            <PaginationNext />
          </Pagination>
        `,
      }),
      { attachTo: document.body }
    )
    wrappers.push(w)
    const btn = w.find('button')
    expect(btn.attributes('disabled')).toBeUndefined()
  })
})

describe('Pagination — First/Last buttons', () => {
  it('PaginationFirst has aria-label="Go to first page"', () => {
    const w = mount(
      defineComponent({
        components: { Pagination, PaginationFirst },
        template: `
          <Pagination :page="3" :items-per-page="10" :total-items="50">
            <PaginationFirst />
          </Pagination>
        `,
      }),
      { attachTo: document.body }
    )
    wrappers.push(w)
    const btn = w.find('button')
    expect(btn.attributes('aria-label')).toBe('Go to first page')
  })

  it('PaginationLast has aria-label="Go to last page"', () => {
    const w = mount(
      defineComponent({
        components: { Pagination, PaginationLast },
        template: `
          <Pagination :page="3" :items-per-page="10" :total-items="50">
            <PaginationLast />
          </Pagination>
        `,
      }),
      { attachTo: document.body }
    )
    wrappers.push(w)
    const btn = w.find('button')
    expect(btn.attributes('aria-label')).toBe('Go to last page')
  })

  it('PaginationFirst is disabled on page 1', () => {
    const w = mount(
      defineComponent({
        components: { Pagination, PaginationFirst },
        template: `
          <Pagination :page="1" :items-per-page="10" :total-items="50">
            <PaginationFirst />
          </Pagination>
        `,
      }),
      { attachTo: document.body }
    )
    wrappers.push(w)
    const btn = w.find('button')
    expect(btn.attributes('disabled')).toBeDefined()
  })
})

describe('Pagination — Ellipsis', () => {
  it('PaginationEllipsis has aria-hidden="true"', () => {
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
    // PaginationEllipsis renders aria-hidden on the outer element
    const el = w.find('[aria-hidden="true"]')
    expect(el.exists()).toBe(true)
  })
})

describe('Pagination — cursor mode', () => {
  it('renders a nav element in cursor mode', () => {
    const w = mount(Pagination, {
      props: {
        type: 'cursor',
        page: 1,
        itemsPerPage: 10,
        totalItems: 100,
        beforeCursor: null,
        afterCursor: 'cursor123',
      },
      attachTo: document.body,
    })
    wrappers.push(w)
    // cursor mode renders a plain <nav> element
    const nav = w.find('nav')
    expect(nav.exists()).toBe(true)
  })

  it('emits update:cursor when cursor changes', async () => {
    const w = mount(Pagination, {
      props: {
        type: 'cursor',
        page: 1,
        itemsPerPage: 10,
        totalItems: 100,
        beforeCursor: null,
        afterCursor: 'cursor123',
      },
      attachTo: document.body,
    })
    wrappers.push(w)
    const vm = w.vm as any
    vm.handleCursorChange('prev123', null)
    await nextTick()
    expect(w.emitted('update:cursor')).toBeTruthy()
    expect(w.emitted('update:cursor')![0]).toEqual(['prev123', null])
  })
})

describe('Pagination — disabled global state', () => {
  it('PaginationPrev respects global disabled prop', () => {
    const w = mount(
      defineComponent({
        components: { Pagination, PaginationPrev },
        template: `
          <Pagination :page="3" :items-per-page="10" :total-items="50" :disabled="true">
            <PaginationPrev />
          </Pagination>
        `,
      }),
      { attachTo: document.body }
    )
    wrappers.push(w)
    const btn = w.find('button')
    expect(btn.attributes('disabled')).toBeDefined()
  })
})
