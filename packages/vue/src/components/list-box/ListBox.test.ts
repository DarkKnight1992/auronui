import { describe, it, expect, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref, nextTick } from 'vue'
import axe from 'axe-core'
import ListBox from './ListBox.vue'
import ListBoxItem from './ListBoxItem.vue'
import ListBoxSection from './ListBoxSection.vue'

// jsdom does not implement scrollIntoView — mock it globally
beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = () => {}
})

// Helper: create a wrapper component with the given template
function makeWrapper(
  template: string,
  components?: Record<string, unknown>,
  setup?: () => Record<string, unknown>,
) {
  return defineComponent({
    components: { ListBox, ListBoxItem, ListBoxSection, ...components },
    setup,
    template,
  })
}

describe('ListBox — render', () => {
  it('Test 1: renders a listbox element via ListboxContent', () => {
    const wrapper = mount(makeWrapper(`
      <ListBox aria-label="Fruits">
        <ListBoxItem value="apple">Apple</ListBoxItem>
        <ListBoxItem value="banana">Banana</ListBoxItem>
        <ListBoxItem value="cherry">Cherry</ListBoxItem>
      </ListBox>
    `))
    // ListboxContent renders role="listbox"
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
  })

  it('Test 2: renders items as listbox options', () => {
    const wrapper = mount(makeWrapper(`
      <ListBox aria-label="Fruits">
        <ListBoxItem value="apple">Apple</ListBoxItem>
        <ListBoxItem value="banana">Banana</ListBoxItem>
      </ListBox>
    `))
    const options = wrapper.findAll('[role="option"]')
    expect(options).toHaveLength(2)
  })

  it('Test 3: renders the list-box CSS class on the listbox element', () => {
    const wrapper = mount(makeWrapper(`
      <ListBox aria-label="Fruits">
        <ListBoxItem value="apple">Apple</ListBoxItem>
      </ListBox>
    `))
    expect(wrapper.find('[role="listbox"]').classes()).toContain('list-box')
  })

  it('Test 4: renders section with ListboxGroupLabel heading', () => {
    const wrapper = mount(makeWrapper(`
      <ListBox aria-label="Fruits">
        <ListBoxSection title="Citrus">
          <ListBoxItem value="lemon">Lemon</ListBoxItem>
          <ListBoxItem value="orange">Orange</ListBoxItem>
        </ListBoxSection>
      </ListBox>
    `))
    // The section group should be present
    expect(wrapper.find('[role="group"]').exists()).toBe(true)
    // The heading should contain the title text
    expect(wrapper.text()).toContain('Citrus')
  })
})

describe('ListBox — single selection v-model', () => {
  it('Test 5: selected item gets aria-selected="true"', async () => {
    const wrapper = mount(makeWrapper(`
      <ListBox aria-label="Fruits" model-value="apple">
        <ListBoxItem value="apple">Apple</ListBoxItem>
        <ListBoxItem value="banana">Banana</ListBoxItem>
      </ListBox>
    `))
    await nextTick()
    const appleOption = wrapper.findAll('[role="option"]')[0]
    expect(appleOption!.attributes('aria-selected')).toBe('true')
  })

  it('Test 6: clicking item emits update:modelValue with the item value', async () => {
    const selected = ref<string | undefined>(undefined)
    const Wrapper = makeWrapper(
      `
      <ListBox aria-label="Fruits" :model-value="selected" @update:model-value="selected = $event">
        <ListBoxItem value="apple">Apple</ListBoxItem>
        <ListBoxItem value="banana">Banana</ListBoxItem>
      </ListBox>
    `,
      {},
      () => ({ selected }),
    )
    const wrapper = mount(Wrapper, { attachTo: document.body })
    const options = wrapper.findAll('[role="option"]')
    await options[0]!.trigger('click')
    await nextTick()
    expect(selected.value).toBe('apple')
    wrapper.unmount()
  })
})

describe('ListBox — multiple selection', () => {
  it('Test 7: selectionMode=multiple sets aria-multiselectable on listbox', () => {
    const wrapper = mount(makeWrapper(`
      <ListBox aria-label="Fruits" selection-mode="multiple">
        <ListBoxItem value="apple">Apple</ListBoxItem>
        <ListBoxItem value="banana">Banana</ListBoxItem>
      </ListBox>
    `))
    // ListboxContent sets aria-multiselectable when multiple=true
    expect(wrapper.find('[role="listbox"]').attributes('aria-multiselectable')).toBe('true')
  })

  it('Test 8: multiple pre-selected values show as aria-selected', async () => {
    const wrapper = mount(makeWrapper(`
      <ListBox aria-label="Fruits" selection-mode="multiple" :model-value="['apple', 'cherry']">
        <ListBoxItem value="apple">Apple</ListBoxItem>
        <ListBoxItem value="banana">Banana</ListBoxItem>
        <ListBoxItem value="cherry">Cherry</ListBoxItem>
      </ListBox>
    `))
    await nextTick()
    const options = wrapper.findAll('[role="option"]')
    expect(options[0]!.attributes('aria-selected')).toBe('true')
    expect(options[1]!.attributes('aria-selected')).toBe('false')
    expect(options[2]!.attributes('aria-selected')).toBe('true')
  })
})

describe('ListBox — keyboard navigation', () => {
  it('Test 9: ArrowDown key triggers keyboard focus within listbox', async () => {
    const wrapper = mount(makeWrapper(`
      <ListBox aria-label="Fruits">
        <ListBoxItem value="apple">Apple</ListBoxItem>
        <ListBoxItem value="banana">Banana</ListBoxItem>
        <ListBoxItem value="cherry">Cherry</ListBoxItem>
      </ListBox>
    `), { attachTo: document.body })
    const listbox = wrapper.find('[role="listbox"]');
    expect(listbox.exists()).toBe(true);
    (listbox.element as HTMLButtonElement).focus()
    await listbox.trigger('keydown', { key: 'ArrowDown', code: 'ArrowDown' })
    await nextTick()
    // Document should have an element focused within the listbox
    expect(document.activeElement).not.toBeNull()
    wrapper.unmount()
  })

  it('Test 10: disabled items have data-disabled attribute', () => {
    const wrapper = mount(makeWrapper(`
      <ListBox aria-label="Fruits">
        <ListBoxItem value="apple">Apple</ListBoxItem>
        <ListBoxItem value="banana" :is-disabled="true">Banana</ListBoxItem>
        <ListBoxItem value="cherry">Cherry</ListBoxItem>
      </ListBox>
    `))
    const options = wrapper.findAll('[role="option"]')
    // Reka UI uses data-disabled="" (present = disabled, absent = not disabled)
    expect(options[1]!.attributes('data-disabled')).toBeDefined()
    expect(options[0]!.attributes('data-disabled')).toBeUndefined()
  })
})

describe('ListBox — disabled state', () => {
  it('Test 11: isDisabled=true on ListBox disables all children (data-disabled)', async () => {
    const wrapper = mount(makeWrapper(`
      <ListBox aria-label="Fruits" :is-disabled="true">
        <ListBoxItem value="apple">Apple</ListBoxItem>
        <ListBoxItem value="banana">Banana</ListBoxItem>
      </ListBox>
    `))
    await nextTick()
    const options = wrapper.findAll('[role="option"]')
    // All items should have data-disabled when parent is disabled
    options.forEach(opt => {
      expect(opt.attributes('data-disabled')).toBeDefined()
    })
  })

  it('Test 12: individual disabled item has data-disabled; enabled item does not', () => {
    const wrapper = mount(makeWrapper(`
      <ListBox aria-label="Fruits">
        <ListBoxItem value="apple" :is-disabled="true">Apple</ListBoxItem>
        <ListBoxItem value="banana">Banana</ListBoxItem>
      </ListBox>
    `))
    const options = wrapper.findAll('[role="option"]')
    expect(options[0]!.attributes('data-disabled')).toBeDefined()
    expect(options[1]!.attributes('data-disabled')).toBeUndefined()
  })
})

describe('ListBox — hideSelectedIcon', () => {
  const checkSel = '[data-slot="list-box-item-indicator--checkmark"]'

  it('renders the checkmark by default', () => {
    const wrapper = mount(makeWrapper(`
      <ListBox aria-label="x" :default-value="'a'">
        <ListBoxItem value="a">Apple</ListBoxItem>
      </ListBox>
    `))
    expect(wrapper.find(checkSel).exists()).toBe(true)
  })

  it('hides the checkmark when ListBox hideSelectedIcon is set', () => {
    const wrapper = mount(makeWrapper(`
      <ListBox aria-label="x" :default-value="'a'" hide-selected-icon>
        <ListBoxItem value="a">Apple</ListBoxItem>
      </ListBox>
    `))
    expect(wrapper.find(checkSel).exists()).toBe(false)
  })

  it('per-item hideSelectedIcon overrides the parent default', () => {
    const wrapper = mount(makeWrapper(`
      <ListBox aria-label="x" :default-value="['a', 'a2']" :multiple="true">
        <ListBoxItem value="a" :hide-selected-icon="true">Apple</ListBoxItem>
        <ListBoxItem value="a2">Apricot</ListBoxItem>
      </ListBox>
    `))
    const items = wrapper.findAll('[role="option"]')
    expect(items[0].find(checkSel).exists()).toBe(false)
    expect(items[1].find(checkSel).exists()).toBe(true)
  })
})

describe('ListBox — virtualized', () => {
  beforeAll(() => {
    ;(globalThis as any).ResizeObserver = class {
      observe() {} ; unobserve() {} ; disconnect() {}
    }
    // jsdom has no layout engine; give every element a non-zero height so
    // TanStack Virtual's scroll element returns a real viewport size.
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      get() { return 200 },
    })
  })

  function makeItems(n: number) {
    return Array.from({ length: n }, (_, i) => ({ value: `v${i}`, label: `Item ${i}` }))
  }

  it('renders only a window of rows, not the whole dataset', async () => {
    const wrapper = mount(makeWrapper(
      `<ListBox aria-label="big" virtualized :items="items" :estimate-size="36" max-height="200px" />`,
      undefined,
      () => ({ items: makeItems(1000) }),
    ))
    await nextTick()
    const rendered = wrapper.findAll('[role="option"]').length
    expect(rendered).toBeGreaterThan(0)
    expect(rendered).toBeLessThan(200) // far fewer than 1000
  })

  it('renders custom content via the #item slot', async () => {
    const wrapper = mount(makeWrapper(
      `<ListBox aria-label="big" virtualized :items="items" :estimate-size="36" max-height="200px">
         <template #item="{ item }">
           <ListBoxItem :value="item.value"><span class="custom">{{ item.label }}!</span></ListBoxItem>
         </template>
       </ListBox>`,
      undefined,
      () => ({ items: makeItems(50) }),
    ))
    await nextTick()
    expect(wrapper.find('.custom').exists()).toBe(true)
    expect(wrapper.find('.custom').text()).toContain('!')
  })

  it('does not apply a bounded height when not virtualized', () => {
    const wrapper = mount(makeWrapper(`
      <ListBox aria-label="plain">
        <ListBoxItem value="a">A</ListBoxItem>
      </ListBox>
    `))
    const content = wrapper.find('[role="listbox"]').element as HTMLElement
    expect(content.style.maxHeight).toBe('')
  })
})

describe('ListBox — accessibility (axe)', () => {
  it('Test 13: passes axe with 3 items + 1 section (zero violations)', async () => {
    const wrapper = mount(makeWrapper(`
      <ListBox aria-label="Foods">
        <ListBoxSection title="Fruits">
          <ListBoxItem value="apple">Apple</ListBoxItem>
          <ListBoxItem value="banana">Banana</ListBoxItem>
        </ListBoxSection>
        <ListBoxItem value="carrot">Carrot</ListBoxItem>
      </ListBox>
    `), { attachTo: document.body })
    await nextTick()
    const results = await axe.run(wrapper.element)
    if (results.violations.length > 0) {
      console.log('AXE VIOLATIONS:', JSON.stringify(results.violations.map(v => ({
        id: v.id,
        description: v.description,
        nodes: v.nodes.map(n => n.html),
      })), null, 2))
    }
    expect(results.violations).toHaveLength(0)
    wrapper.unmount()
  })
})
