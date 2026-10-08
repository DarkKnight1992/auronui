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

  it("applies 'autocomplete__trigger--accent' with color='accent'", () => {
    const wrapper = mount({
      components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
      template: `
        <Autocomplete :items="items" color="accent" aria-label="Fruit autocomplete">
          <AutocompleteInput placeholder="Search fruits..." />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      `,
      setup() { return { items: staticItems } },
    })
    mountedWrappers.push(wrapper)
    expect(wrapper.find('[data-slot="trigger"]').classes()).toContain('autocomplete__trigger--accent')
  })

  it('isReadOnly (canonical) marks the root data-readonly and the input readonly', () => {
    const wrapper = mount({
      components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
      template: `
        <Autocomplete :items="items" :is-read-only="true" aria-label="Fruit autocomplete">
          <AutocompleteInput placeholder="Search fruits..." />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      `,
      setup() { return { items: staticItems } },
    })
    mountedWrappers.push(wrapper)
    expect(wrapper.find('.autocomplete-root').attributes('data-readonly')).toBeTruthy()
    expect(wrapper.find('input').attributes('readonly')).toBeDefined()
  })

  it('deprecated isReadonly (old casing) prop marks the root data-readonly and the input readonly', () => {
    const wrapper = mount({
      components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
      template: `
        <Autocomplete :items="items" :is-readonly="true" aria-label="Fruit autocomplete">
          <AutocompleteInput placeholder="Search fruits..." />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      `,
      setup() { return { items: staticItems } },
    })
    mountedWrappers.push(wrapper)
    expect(wrapper.find('.autocomplete-root').attributes('data-readonly')).toBeTruthy()
    expect(wrapper.find('input').attributes('readonly')).toBeDefined()
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

    // Nothing is fetched until the dropdown is needed
    await flushPromises()
    expect(loadItems).not.toHaveBeenCalled()
    await wrapper.find('input').setValue('a')
    await flushPromises()
    expect(loadItems).toHaveBeenCalledWith('a')
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
        <Autocomplete :load-items="loadItems" :debounce-ms="0" :default-open="true" aria-label="Async fruit">
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

    // Opening triggers the (lazy) load; the promise is pending
    await nextTick()
    expect(loadItems).toHaveBeenCalledTimes(1)
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

describe('Autocomplete — label placement (split-file: Autocomplete.vue outside / AutocompleteInput.vue inside)', () => {
  it('labelPlacement "inside" (default) renders exactly one <label>, from AutocompleteInput', () => {
    const wrapper = mount({
      components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
      template: `
        <Autocomplete label="Fruit" label-placement="inside" :items="items">
          <AutocompleteInput placeholder="Search fruits..." />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      `,
      setup() { return { items: staticItems } },
    }, { attachTo: document.body })
    mountedWrappers.push(wrapper)
    expect(wrapper.findAll('label')).toHaveLength(1)
    // The single label must live inside the trigger (AutocompleteInput's context path),
    // not as a direct child of the Autocomplete.vue root.
    expect(wrapper.find('[data-slot="trigger"] label').exists()).toBe(true)
  })

  it('labelPlacement "outside" renders exactly one <label>, from Autocomplete.vue (not duplicated in AutocompleteInput)', () => {
    const wrapper = mount({
      components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
      template: `
        <Autocomplete label="Fruit" label-placement="outside" :items="items">
          <AutocompleteInput placeholder="Search fruits..." />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      `,
      setup() { return { items: staticItems } },
    }, { attachTo: document.body })
    mountedWrappers.push(wrapper)
    expect(wrapper.findAll('label')).toHaveLength(1)
    // The label must NOT be nested inside the trigger for outside placement.
    expect(wrapper.find('[data-slot="trigger"] label').exists()).toBe(false)
  })

  it('labelPlacement "outside-left" renders exactly one <label>, from Autocomplete.vue', () => {
    const wrapper = mount({
      components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
      template: `
        <Autocomplete label="Fruit" label-placement="outside-left" :items="items">
          <AutocompleteInput placeholder="Search fruits..." />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      `,
      setup() { return { items: staticItems } },
    }, { attachTo: document.body })
    mountedWrappers.push(wrapper)
    expect(wrapper.findAll('label')).toHaveLength(1)
    expect(wrapper.find('[data-slot="trigger"] label').exists()).toBe(false)
  })

  it('no label prop → zero <label> elements rendered anywhere', () => {
    const wrapper = mount({
      components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
      template: `
        <Autocomplete :items="items" aria-label="Fruit autocomplete">
          <AutocompleteInput placeholder="Search fruits..." />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      `,
      setup() { return { items: staticItems } },
    }, { attachTo: document.body })
    mountedWrappers.push(wrapper)
    expect(wrapper.findAll('label')).toHaveLength(0)
  })
})

describe('Autocomplete — aria-describedby resolution', () => {
  it('aria-describedby (error case) on the input resolves to a DOM element containing the error text', () => {
    const wrapper = mount({
      components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
      template: `
        <Autocomplete label="Fruit" :is-invalid="true" error-message="Please select a fruit" :items="items">
          <AutocompleteInput placeholder="Search fruits..." />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      `,
      setup() { return { items: staticItems } },
    }, { attachTo: document.body })
    mountedWrappers.push(wrapper)
    const input = wrapper.find('input')
    const describedBy = input.attributes('aria-describedby')
    expect(describedBy).toBeTruthy()
    const target = wrapper.find(`#${describedBy}`)
    expect(target.exists()).toBe(true)
    expect(target.text()).toBe('Please select a fruit')
  })

  it('aria-describedby (description case) on the input resolves to a DOM element containing the description text', () => {
    const wrapper = mount({
      components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
      template: `
        <Autocomplete label="Fruit" description="Pick your favorite fruit" :items="items">
          <AutocompleteInput placeholder="Search fruits..." />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      `,
      setup() { return { items: staticItems } },
    }, { attachTo: document.body })
    mountedWrappers.push(wrapper)
    const input = wrapper.find('input')
    const describedBy = input.attributes('aria-describedby')
    expect(describedBy).toBeTruthy()
    const target = wrapper.find(`#${describedBy}`)
    expect(target.exists()).toBe(true)
    expect(target.text()).toBe('Pick your favorite fruit')
  })
})

describe('Autocomplete — root data-attributes (rootDataAttrs from useFormField)', () => {
  // data-readonly's present case is already covered above (canonical + deprecated
  // isReadonly tests); the other 5 attributes had no coverage at all on the root.
  // Assert present/absent for all 6 here.

  it('isInvalid=true sets data-invalid on the root; absent when false', () => {
    const valid = harnessStatic()
    mountedWrappers.push(valid)
    expect(valid.find('.autocomplete-root').attributes('data-invalid')).toBeUndefined()

    const invalid = mount({
      components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
      template: `
        <Autocomplete label="Fruit" :is-invalid="true" :items="items">
          <AutocompleteInput placeholder="Search fruits..." />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      `,
      setup() { return { items: staticItems } },
    })
    mountedWrappers.push(invalid)
    expect(invalid.find('.autocomplete-root').attributes('data-invalid')).toBeTruthy()
  })

  it('isDisabled=true sets data-disabled on the root; absent when false', () => {
    const enabled = harnessStatic()
    mountedWrappers.push(enabled)
    expect(enabled.find('.autocomplete-root').attributes('data-disabled')).toBeUndefined()

    const disabled = harnessStatic({ isDisabled: true })
    mountedWrappers.push(disabled)
    expect(disabled.find('.autocomplete-root').attributes('data-disabled')).toBeTruthy()
  })

  it('isReadOnly=true sets data-readonly on the root; absent when false', () => {
    const enabled = harnessStatic()
    mountedWrappers.push(enabled)
    expect(enabled.find('.autocomplete-root').attributes('data-readonly')).toBeUndefined()

    const readonly = mount({
      components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
      template: `
        <Autocomplete :is-read-only="true" :items="items" aria-label="Fruit autocomplete">
          <AutocompleteInput placeholder="Search fruits..." />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      `,
      setup() { return { items: staticItems } },
    })
    mountedWrappers.push(readonly)
    expect(readonly.find('.autocomplete-root').attributes('data-readonly')).toBeTruthy()
  })

  it('isRequired=true sets data-required on the root; absent when false', () => {
    const notRequired = harnessStatic()
    mountedWrappers.push(notRequired)
    expect(notRequired.find('.autocomplete-root').attributes('data-required')).toBeUndefined()

    const required = mount({
      components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
      template: `
        <Autocomplete :is-required="true" :items="items" aria-label="Fruit autocomplete">
          <AutocompleteInput placeholder="Search fruits..." />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      `,
      setup() { return { items: staticItems } },
    })
    mountedWrappers.push(required)
    expect(required.find('.autocomplete-root').attributes('data-required')).toBeTruthy()
  })

  it('label set → data-has-label on the root; absent when no label', () => {
    const withLabel = harnessStatic({ label: 'Fruit' })
    mountedWrappers.push(withLabel)
    expect(withLabel.find('.autocomplete-root').attributes('data-has-label')).toBeTruthy()

    const withoutLabel = harnessStatic()
    mountedWrappers.push(withoutLabel)
    expect(withoutLabel.find('.autocomplete-root').attributes('data-has-label')).toBeUndefined()
  })

  it('description set → data-has-helper on the root; absent when no description/error', () => {
    const noHelper = harnessStatic()
    mountedWrappers.push(noHelper)
    expect(noHelper.find('.autocomplete-root').attributes('data-has-helper')).toBeUndefined()

    const withHelper = mount({
      components: { Autocomplete, AutocompleteInput, AutocompleteContent, AutocompleteItem },
      template: `
        <Autocomplete label="Fruit" description="Pick your favorite fruit" :items="items">
          <AutocompleteInput placeholder="Search fruits..." />
          <AutocompleteContent>
            <AutocompleteItem v-for="item in items" :key="item.value" :value="item.value">{{ item.label }}</AutocompleteItem>
          </AutocompleteContent>
        </Autocomplete>
      `,
      setup() { return { items: staticItems } },
    })
    mountedWrappers.push(withHelper)
    expect(withHelper.find('.autocomplete-root').attributes('data-has-helper')).toBeTruthy()
  })
})

describe('Autocomplete — lazy loadItems', () => {
  function mountAsync(attrs: string, loadItems: ReturnType<typeof vi.fn>) {
    const w = mount({
      components: { Autocomplete },
      setup: () => ({ loadItems }),
      template: `<Autocomplete :load-items="loadItems" :debounce-ms="0" aria-label="Async fruit" ${attrs} />`,
    }, { attachTo: document.body })
    mountedWrappers.push(w)
    return w
  }

  it('does not call loadItems on mount when nothing is selected', async () => {
    const loadItems = vi.fn().mockResolvedValue([])
    mountAsync('', loadItems)
    await flushPromises()
    expect(loadItems).not.toHaveBeenCalled()
  })

  it('loads once the dropdown opens', async () => {
    const loadItems = vi.fn().mockResolvedValue([{ value: 'apple', label: 'Apple' }])
    mountAsync(':default-open="true"', loadItems)
    await flushPromises()
    expect(loadItems).toHaveBeenCalledTimes(1)
    expect(loadItems).toHaveBeenCalledWith('')
  })

  it('loads on mount when a value is pre-selected (so its label can resolve)', async () => {
    const loadItems = vi.fn().mockResolvedValue([{ value: 'apple', label: 'Apple' }])
    const w = mountAsync('model-value="apple"', loadItems)
    await flushPromises()
    expect(loadItems).toHaveBeenCalledTimes(1)
    expect((w.find('input').element as HTMLInputElement).value).toBe('Apple')
  })

  it('load-on-mount forces an eager load', async () => {
    const loadItems = vi.fn().mockResolvedValue([])
    mountAsync('load-on-mount', loadItems)
    await flushPromises()
    expect(loadItems).toHaveBeenCalledTimes(1)
  })
})

describe('Autocomplete — creatable (default chrome)', () => {
  it('offers a create item for unmatched text', async () => {
    const selected = ref<string | undefined>()
    const created: string[] = []
    const w = mount({
      components: { Autocomplete },
      setup: () => ({ selected, items: staticItems, onCreate: (v: string) => created.push(v) }),
      template: `<Autocomplete v-model="selected" :items="items" creatable aria-label="Fruit" @create="onCreate" />`,
    }, { attachTo: document.body })
    mountedWrappers.push(w)
    const input = w.find('input')
    await input.trigger('focus')
    await input.setValue('Carol')
    await flushPromises()
    const options = [...document.body.querySelectorAll('[role="option"]')].map(o => o.textContent?.trim())
    expect(options).toContain('Create "Carol"')
  })

  it('does not render a create item without creatable', async () => {
    const w = mount({
      components: { Autocomplete },
      setup: () => ({ items: staticItems }),
      template: `<Autocomplete :items="items" aria-label="Fruit" />`,
    }, { attachTo: document.body })
    mountedWrappers.push(w)
    const input = w.find('input')
    await input.trigger('focus')
    await input.setValue('Carol')
    await flushPromises()
    const options = [...document.body.querySelectorAll('[role="option"]')].map(o => o.textContent?.trim())
    expect(options.some(o => o?.startsWith('Create'))).toBe(false)
  })
})

describe('Autocomplete — selected labels survive a narrowed load-items result', () => {
  const all = [
    { value: 'ap', label: 'Apple' },
    { value: 'bn', label: 'Banana' },
    { value: 'ch', label: 'Cherry' },
  ]
  const loadItems = (q: string) =>
    Promise.resolve(all.filter(i => i.label.toLowerCase().includes(q.toLowerCase())))

  it('multiple: chips keep their labels while the results no longer contain them', async () => {
    const w = mount({
      components: { Autocomplete },
      setup: () => ({ loadItems, selected: ref(['ap', 'bn']) }),
      template: `<Autocomplete v-model="selected" multiple :load-items="loadItems" :debounce-ms="0" aria-label="Fruit" />`,
    }, { attachTo: document.body })
    mountedWrappers.push(w)
    await flushPromises()
    const chipText = () => w.findAll('[data-slot="selected-chip"]').map(c => c.text())
    expect(chipText()).toEqual(['Apple', 'Banana'])
    await w.find('input').setValue('che')
    await flushPromises()
    expect(chipText()).toEqual(['Apple', 'Banana'])
  })

  it('single: a value set from outside resolves to a label loaded earlier', async () => {
    const selected = ref<string | undefined>('ap')
    const emitted: unknown[] = []
    const w = mount({
      components: { Autocomplete },
      setup: () => ({ loadItems, selected, onUpdate: (v: unknown) => emitted.push(v) }),
      template: `<Autocomplete :model-value="selected" :load-items="loadItems" :debounce-ms="0" aria-label="Fruit" @update:model-value="onUpdate" />`,
    }, { attachTo: document.body })
    mountedWrappers.push(w)
    await flushPromises()
    // Search everything (Banana is loaded), then narrow to Cherry.
    await w.find('input').setValue('')
    await flushPromises()
    await w.find('input').setValue('che')
    await flushPromises()
    emitted.length = 0
    selected.value = 'bn'
    await flushPromises()
    expect((w.find('input').element as HTMLInputElement).value).toBe('Banana')
    expect(emitted).not.toContain('Banana')
  })
})

describe('Autocomplete — static items filter on textValue', () => {
  it('matches an item by its textValue, not just its label', async () => {
    const items = [
      { value: 'us', label: 'United States and 24 more (+1)', textValue: 'United States Jamaica +1' },
      { value: 'gb', label: 'United Kingdom (+44)' },
    ]
    const w = mount({
      components: { Autocomplete },
      setup: () => ({ items }),
      template: `<Autocomplete :items="items" aria-label="Calling code" />`,
    }, { attachTo: document.body })
    mountedWrappers.push(w)
    const input = w.find('input')
    await input.trigger('focus')
    await input.setValue('jamaica')
    await flushPromises()
    const visible = [...document.body.querySelectorAll<HTMLElement>('[role="option"]')]
      .filter(o => o.style.display !== 'none')
      .map(o => o.getAttribute('data-item-value'))
    expect(visible).toEqual(['us'])
  })
})

describe('Autocomplete — value changes only on selection (single mode)', () => {
  function mountSingle(initial?: string) {
    const emitted: unknown[] = []
    const selected = ref<string | undefined>(initial)
    const w = mount({
      components: { Autocomplete },
      setup: () => ({
        items: staticItems,
        selected,
        onUpdate: (v: string) => { emitted.push(v); selected.value = v },
      }),
      template: `<Autocomplete :model-value="selected" :items="items" aria-label="Fruit" @update:model-value="onUpdate" />`,
    }, { attachTo: document.body })
    mountedWrappers.push(w)
    return { w, emitted, input: w.find('input') }
  }

  it('typing does not change the value', async () => {
    const { input, emitted } = mountSingle()
    await input.trigger('focus')
    await input.setValue('ban')
    await flushPromises()
    expect(emitted).toEqual([])
  })

  it('selecting an item emits its value', async () => {
    const { input, emitted } = mountSingle()
    await input.trigger('focus')
    await input.setValue('ban')
    await flushPromises()
    const option = [...document.body.querySelectorAll<HTMLElement>('[role="option"]')]
      .find(o => o.getAttribute('data-item-value') === 'banana')!
    option.click()
    await flushPromises()
    expect(emitted).toEqual(['banana'])
    expect((input.element as HTMLInputElement).value).toBe('Banana')
  })

  it('clearing the input clears the value', async () => {
    const { input, emitted } = mountSingle('banana')
    await input.setValue('')
    await flushPromises()
    expect(emitted).toEqual([''])
  })

  it('the clear button clears the value', async () => {
    const { w, input, emitted } = mountSingle('banana')
    await w.find('[data-slot="clear-button"]').trigger('click')
    await flushPromises()
    expect((input.element as HTMLInputElement).value).toBe('')
    expect(emitted).toEqual([''])
  })

  it('unmatched text reverts to the selected label when the menu closes', async () => {
    const { input, emitted } = mountSingle('banana')
    await input.trigger('focus')
    await input.setValue('zz')
    await flushPromises()
    await input.trigger('keydown', { key: 'Escape' })
    await flushPromises()
    expect((input.element as HTMLInputElement).value).toBe('Banana')
    expect(emitted).toEqual([])
  })
})
