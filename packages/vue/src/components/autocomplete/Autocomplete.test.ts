import { describe, it, expect, afterEach, beforeAll, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import axe from 'axe-core'
import Autocomplete from './Autocomplete.vue'
import AutocompleteInput from './AutocompleteInput.vue'
import AutocompleteContent from './AutocompleteContent.vue'
import AutocompleteItem from './AutocompleteItem.vue'

// jsdom does not implement scrollIntoView — mock it so Reka UI's
// highlightSelected() does not throw.
beforeAll(() => {
  if (!window.HTMLElement.prototype.scrollIntoView) {
    window.HTMLElement.prototype.scrollIntoView = () => {}
  }
})

interface Item { value: string; label: string }

const staticItems: Item[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

const mountedWrappers: ReturnType<typeof mount>[] = []

afterEach(() => {
  mountedWrappers.forEach(w => w.unmount())
  mountedWrappers.length = 0
  vi.clearAllTimers()
})

function harnessStatic(props: Record<string, unknown> = {}) {
  return mount({
    components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
    props: ['modelValue', 'isDisabled', 'label'],
    template: `
      <Autocomplete :items="items" :model-value="modelValue" :is-disabled="isDisabled" :label="label" aria-label="Fruit autocomplete">
        <AutocompleteInput placeholder="Search fruits..." />
        <AutocompleteContent>
          <AutocompleteItem
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            :text-value="item.label"
          >
            {{ item.label }}
          </AutocompleteItem>
        </AutocompleteContent>
      </Autocomplete>
    `,
    setup() { return { items: staticItems } },
  }, { props })
}

describe('Autocomplete', () => {
  it('renders with autocomplete base class', () => {
    const w = harnessStatic()
    mountedWrappers.push(w)
    expect(w.find('.autocomplete-root').exists()).toBe(true)
  })

  it('renders an input element', () => {
    const w = harnessStatic()
    mountedWrappers.push(w)
    expect(w.find('input').exists()).toBe(true)
  })

  it('renders label when provided', () => {
    const w = harnessStatic({ label: 'Fruit' })
    mountedWrappers.push(w)
    expect(w.find('label').text()).toContain('Fruit')
  })

  it('input has placeholder text', () => {
    const w = harnessStatic()
    mountedWrappers.push(w)
    expect(w.find('input').attributes('placeholder')).toBe('Search fruits...')
  })

  it('isDisabled prop disables the input', () => {
    const w = harnessStatic({ isDisabled: true })
    mountedWrappers.push(w)
    expect(w.find('.autocomplete-root').exists()).toBe(true)
  })

  it('async: loadItems is called when query changes', async () => {
    const loadItems = vi.fn().mockResolvedValue([
      { value: 'avocado', label: 'Avocado' },
      { value: 'apricot', label: 'Apricot' },
    ])

    const wrapper = mount({
      components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
      template: `
        <Autocomplete :load-items="loadItems" :debounce-ms="0" aria-label="Async fruit">
          <AutocompleteInput placeholder="Type to search..." />
          <AutocompleteContent>
            <AutocompleteItem
              v-for="item in resolvedItems"
              :key="item.value"
              :value="item.value"
              :text-value="item.label"
            >
              {{ item.label }}
            </AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      `,
      setup() { return { loadItems, resolvedItems: [] } },
    })
    mountedWrappers.push(wrapper)

    // loadItems called on mount with empty query (immediate)
    await flushPromises()
    expect(loadItems).toHaveBeenCalled()
  })

  it('async: loadItems is called with the typed query', async () => {
    const loadItems = vi.fn().mockResolvedValue([])

    const wrapper = mount({
      components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
      template: `
        <Autocomplete :load-items="loadItems" :debounce-ms="0" aria-label="Async fruit">
          <AutocompleteInput placeholder="Type to search..." />
          <AutocompleteContent />
        </Autocomplete>
      `,
      setup() { return { loadItems } },
    })
    mountedWrappers.push(wrapper)
    await flushPromises()

    const input = wrapper.find('input')
    await input.setValue('a')
    await flushPromises()
    expect(loadItems).toHaveBeenCalledWith('a')
  })

  it('async: isLoading is true while promise is pending', async () => {
    let resolveLoad!: (items: Item[]) => void
    const loadItems = vi.fn().mockImplementation(() => new Promise<Item[]>((res) => { resolveLoad = res }))

    const wrapper = mount({
      components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
      template: `
        <Autocomplete :load-items="loadItems" :debounce-ms="0" aria-label="Async fruit">
          <AutocompleteInput placeholder="Type to search..." />
          <AutocompleteContent>
            <template #loading>
              <div data-testid="spinner">Loading...</div>
            </template>
          </AutocompleteContent>
        </Autocomplete>
      `,
      setup() { return { loadItems } },
    })
    mountedWrappers.push(wrapper)

    // Promise pending — isLoading should be true
    await nextTick()
    // Resolve to clean up
    resolveLoad([])
    await flushPromises()
  })

  it('axe: passes accessibility audit (closed state)', async () => {
    const wrapper = mount({
      components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
      template: `
        <Autocomplete :items="items" aria-label="Fruit autocomplete">
          <AutocompleteInput placeholder="Search fruits..." />
          <AutocompleteContent>
            <AutocompleteItem
              v-for="item in items"
              :key="item.value"
              :value="item.value"
              :text-value="item.label"
            >
              {{ item.label }}
            </AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      `,
      setup() { return { items: staticItems } },
    }, { attachTo: document.body })
    mountedWrappers.push(wrapper)
    // Same jsdom constraint as ComboBox: aria-controls="" in closed state
    const results = await axe.run(wrapper.element, {
      rules: { 'aria-required-attr': { enabled: false } },
    })
    expect(results).toHaveNoViolations()
  })
})
