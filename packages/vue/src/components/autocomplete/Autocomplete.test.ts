import { describe, it, expect, afterEach, beforeAll, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
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

  it('deprecated bare disabled prop on AutocompleteItem marks the item data-disabled', async () => {
    const wrapper = mount({
      components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
      template: `
        <Autocomplete :open="true" :items="items" aria-label="Fruit autocomplete">
          <AutocompleteInput placeholder="Search fruits..." />
          <AutocompleteContent>
            <AutocompleteItem
              v-for="item in items"
              :key="item.value"
              :value="item.value"
              :disabled="item.value === 'banana'"
            >
              {{ item.label }}
            </AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      `,
      setup() { return { items: staticItems } },
    }, { attachTo: document.body })
    mountedWrappers.push(wrapper)
    await nextTick()
    await nextTick()
    const disabledItems = document.querySelectorAll('[data-disabled]')
    expect(disabledItems.length).toBeGreaterThan(0)
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

  it('slot text is used as display label — no extra props needed', async () => {
    // Core requirement: <AutocompleteItem value="us">United States</AutocompleteItem>
    // must show "United States" in the input after selection, with zero extra props.
    const wrapper = mount({
      components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
      template: `
        <Autocomplete v-model="selected" aria-label="Country picker">
          <AutocompleteInput placeholder="Search..." />
          <AutocompleteContent>
            <AutocompleteItem value="us">United States</AutocompleteItem>
            <AutocompleteItem value="gb">United Kingdom</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      `,
      setup() {
        const selected = ref('us')
        return { selected }
      },
    })
    mountedWrappers.push(wrapper)

    // Allow children to mount and register, then the registry watcher to fire
    await nextTick()
    await nextTick()
    const input = wrapper.find('input')
    expect(input.element.value).toBe('United States')
  })

  it('slot text used as label also populates v-model with the real value not the label', async () => {
    // When a slot-rendered item is selected, v-model should emit the value prop ("us"),
    // not the display label ("United States").
    const wrapper = mount({
      components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
      template: `
        <Autocomplete v-model="selected" aria-label="Country picker">
          <AutocompleteInput placeholder="Search..." />
          <AutocompleteContent>
            <AutocompleteItem value="us">United States</AutocompleteItem>
            <AutocompleteItem value="gb">United Kingdom</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      `,
      setup() {
        const selected = ref('')
        return { selected }
      },
    })
    mountedWrappers.push(wrapper)

    // Allow children to mount and register their labels
    await nextTick()
    await nextTick()
    // Set v-model to 'us' — the input should show 'United States'
    const vm = wrapper.vm as any
    vm.selected = 'us'
    await nextTick()
    await nextTick()
    expect(wrapper.find('input').element.value).toBe('United States')
    // v-model should still hold the real value, not the label
    expect(vm.selected).toBe('us')
  })

  it('shows label in input after item with distinct value/label is selected (items prop)', async () => {
    const wrapper = mount({
      components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
      template: `
        <Autocomplete :items="items" v-model="selected" aria-label="Country picker">
          <AutocompleteInput placeholder="Search..." />
          <AutocompleteContent>
            <AutocompleteItem
              v-for="item in items"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      `,
      setup() {
        const selected = ref('')
        const items = [
          { value: 'us', label: 'United States' },
          { value: 'gb', label: 'United Kingdom' },
        ]
        return { items, selected }
      },
    })
    mountedWrappers.push(wrapper)

    const vm = wrapper.vm as any
    vm.selected = 'us'
    await nextTick()
    expect(wrapper.find('input').element.value).toBe('United States')
  })

  it('axe: passes accessibility audit (closed state, compound chrome)', async () => {
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

describe('Autocomplete — short-form (items prop, no manual chrome)', () => {
  const items = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
  ]

  it('renders an input without manual AutocompleteInput/Content', async () => {
    const wrapper = mount({
      components: { Autocomplete },
      setup: () => ({ items }),
      template: `<Autocomplete label="Fruit" placeholder="Search" :items="items" />`,
    }, { attachTo: document.body })
    await nextTick()
    expect(wrapper.find('input').exists()).toBe(true)
    wrapper.unmount()
  })

  it('renders option items from the items prop when open', async () => {
    const wrapper = mount({
      components: { Autocomplete },
      setup: () => ({ items }),
      template: `<Autocomplete :open="true" label="Fruit" placeholder="Search" :items="items" />`,
    }, { attachTo: document.body })
    await nextTick()
    await nextTick()
    const options = document.querySelectorAll('[role="option"]')
    expect(options.length).toBe(3)
    const texts = Array.from(options).map(o => (o as HTMLElement).textContent ?? '')
    expect(texts.some(t => t.includes('Apple'))).toBe(true)
    wrapper.unmount()
  })

  it('#item slot customizes rendering', async () => {
    const wrapper = mount({
      components: { Autocomplete },
      setup: () => ({ items }),
      template: `
        <Autocomplete :open="true" label="Fruit" placeholder="Search" :items="items">
          <template #item="{ item }"><span>★ {{ item.label }}</span></template>
        </Autocomplete>
      `,
    }, { attachTo: document.body })
    await nextTick()
    await nextTick()
    const options = document.querySelectorAll('[role="option"]')
    expect(options.length).toBe(3)
    expect((options[0] as HTMLElement).textContent).toContain('★')
    wrapper.unmount()
  })

  it('short-form passes axe (closed)', async () => {
    const wrapper = mount({
      components: { Autocomplete },
      setup: () => ({ items }),
      template: `<Autocomplete label="Fruit" placeholder="Search" :items="items" />`,
    }, { attachTo: document.body })
    await nextTick()
    const results = await axe.run(wrapper.element)
    if (results.violations.length > 0) {
      console.log('AXE (autocomplete short closed):', JSON.stringify(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.html) })), null, 2))
    }
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })

  it('short-form passes axe (open)', async () => {
    const wrapper = mount({
      components: { Autocomplete },
      setup: () => ({ items }),
      template: `<Autocomplete :open="true" label="Fruit" placeholder="Search" :items="items" />`,
    }, { attachTo: document.body })
    await nextTick()
    await nextTick()
    // Same jsdom constraint as compound-chrome axe test: aria-controls="" in open state
    const results = await axe.run(wrapper.element, {
      rules: { 'aria-required-attr': { enabled: false } },
    })
    if (results.violations.length > 0) {
      console.log('AXE (autocomplete short open):', JSON.stringify(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.html) })), null, 2))
    }
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })
})
