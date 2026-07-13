import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import Transfer from '../Transfer.vue'

// Values are deliberately multi-character. A single-character value (e.g.
// 'a') would mask a real bug class: if a selection handler ever regresses
// to emitting a bare string instead of an array, spreading a 1-char string
// ([...'a']) still produces ['a'] — indistinguishable from a correct
// single-item array. Multi-character values ([...'alice'] -> ['a','l',...])
// make that regression fail loudly instead of silently passing.
const items = [
  { value: 'alice', label: 'Alice' },
  { value: 'bob', label: 'Bob' },
  { value: 'carol', label: 'Carol' },
]

function mountTransfer(props: Record<string, unknown> = {}) {
  return mount(
    defineComponent({
      components: { Transfer },
      props: Object.keys(props),
      template: '<Transfer v-bind="$props" :items="items" />',
      data() {
        return { items }
      },
    }),
    { props },
  )
}

describe('Transfer', () => {
  it('renders all items in the source panel when modelValue is empty', () => {
    const wrapper = mountTransfer({ modelValue: [] })
    const sourceBody = wrapper.find('[data-slot="transfer-source-body"]')
    expect(sourceBody.text()).toContain('Alice')
    expect(sourceBody.text()).toContain('Bob')
    expect(sourceBody.text()).toContain('Carol')
    expect(wrapper.find('[data-slot="transfer-target-body"]').text()).toBe('')
  })

  it('renders items whose value is in modelValue in the target panel, not the source panel', () => {
    const wrapper = mountTransfer({ modelValue: ['bob'] })
    expect(wrapper.find('[data-slot="transfer-target-body"]').text()).toContain('Bob')
    expect(wrapper.find('[data-slot="transfer-source-body"]').text()).not.toContain('Bob')
    expect(wrapper.find('[data-slot="transfer-source-body"]').text()).toContain('Alice')
  })

  it('checking a source item, then clicking move-right, moves just that item into modelValue as a real array', async () => {
    const wrapper = mount(
      defineComponent({
        components: { Transfer },
        setup() {
          return { items }
        },
        data() {
          return { modelValue: [] as string[] }
        },
        template: '<Transfer v-model="modelValue" :items="items" />',
      }),
      { attachTo: document.body },
    )
    const sourceOption = wrapper.find('[data-slot="transfer-source-body"] [role="option"]')
    await sourceOption.trigger('click')
    const moveRight = wrapper.find('[data-slot="transfer-move-right"]')
    expect(moveRight.attributes('disabled')).toBeUndefined()
    await moveRight.trigger('click')
    expect((wrapper.vm as unknown as { modelValue: string[] }).modelValue).toEqual(['alice'])
    wrapper.unmount()
  })

  it('checking a target item, then clicking move-left, moves just that item out of modelValue', async () => {
    const wrapper = mount(
      defineComponent({
        components: { Transfer },
        setup() {
          return { items }
        },
        data() {
          return { modelValue: ['alice', 'bob', 'carol'] as string[] }
        },
        template: '<Transfer v-model="modelValue" :items="items" />',
      }),
      { attachTo: document.body },
    )
    const targetOption = wrapper.find('[data-slot="transfer-target-body"] [role="option"]')
    await targetOption.trigger('click')
    const moveLeft = wrapper.find('[data-slot="transfer-move-left"]')
    expect(moveLeft.attributes('disabled')).toBeUndefined()
    await moveLeft.trigger('click')
    const remaining = (wrapper.vm as unknown as { modelValue: string[] }).modelValue
    expect(remaining).toHaveLength(2)
    expect(remaining).not.toContain('alice')
    wrapper.unmount()
  })

  it('move-right and move-left buttons are disabled until items are checked in the respective panel', () => {
    const wrapper = mountTransfer({ modelValue: ['bob'] })
    expect(wrapper.find('[data-slot="transfer-move-right"]').attributes('disabled')).toBeDefined()
    expect(wrapper.find('[data-slot="transfer-move-left"]').attributes('disabled')).toBeDefined()
  })

  it('clicking move-all-right moves every non-disabled source item to modelValue', async () => {
    let modelValue: string[] = []
    const wrapper = mount(
      defineComponent({
        components: { Transfer },
        setup() {
          return { items }
        },
        data() {
          return { modelValue }
        },
        template: '<Transfer v-model="modelValue" :items="items" />',
      }),
    )
    await wrapper.find('[data-slot="transfer-move-all-right"]').trigger('click')
    modelValue = (wrapper.vm as unknown as { modelValue: string[] }).modelValue
    expect(modelValue.sort()).toEqual(['alice', 'bob', 'carol'])
  })

  it('clicking move-all-left empties modelValue back to the source panel', async () => {
    const wrapper = mount(
      defineComponent({
        components: { Transfer },
        setup() {
          return { items }
        },
        data() {
          return { modelValue: ['alice', 'bob', 'carol'] }
        },
        template: '<Transfer v-model="modelValue" :items="items" />',
      }),
    )
    await wrapper.find('[data-slot="transfer-move-all-left"]').trigger('click')
    expect((wrapper.vm as unknown as { modelValue: string[] }).modelValue).toEqual([])
  })

  it('move-all-right is disabled once the source panel is empty', () => {
    const wrapper = mountTransfer({ modelValue: ['alice', 'bob', 'carol'] })
    expect(wrapper.find('[data-slot="transfer-move-all-right"]').attributes('disabled')).toBeDefined()
  })

  it('move-all-left is disabled once the target panel is empty', () => {
    const wrapper = mountTransfer({ modelValue: [] })
    expect(wrapper.find('[data-slot="transfer-move-all-left"]').attributes('disabled')).toBeDefined()
  })

  it('renders panel titles when provided', () => {
    const wrapper = mountTransfer({ titles: ['Available', 'Selected'] })
    expect(wrapper.find('[data-slot="transfer-source-header"]').text()).toBe('Available')
    expect(wrapper.find('[data-slot="transfer-target-header"]').text()).toBe('Selected')
  })

  it('renders no panel header elements when titles are not provided', () => {
    const wrapper = mountTransfer()
    expect(wrapper.find('[data-slot="transfer-source-header"]').exists()).toBe(false)
    expect(wrapper.find('[data-slot="transfer-target-header"]').exists()).toBe(false)
  })

  it('isSearchable: true renders a search field in each panel', () => {
    const wrapper = mountTransfer({ isSearchable: true })
    expect(wrapper.findAll('input[type="search"]')).toHaveLength(2)
  })

  it('isSearchable: false renders no search fields', () => {
    const wrapper = mountTransfer({ isSearchable: false })
    expect(wrapper.findAll('input[type="search"]')).toHaveLength(0)
  })

  it('isDisabled: true applies the disabled modifier class and disables all move buttons', () => {
    const wrapper = mountTransfer({ isDisabled: true, modelValue: ['alice'] })
    expect(wrapper.find('[data-slot="transfer"]').classes()).toContain('transfer--disabled')
    expect(wrapper.find('[data-slot="transfer-move-right"]').attributes('disabled')).toBeDefined()
    expect(wrapper.find('[data-slot="transfer-move-left"]').attributes('disabled')).toBeDefined()
  })

  it('passing class="custom" merges with base classes on the root', () => {
    const wrapper = mountTransfer({ class: 'custom-class' })
    expect(wrapper.find('[data-slot="transfer"]').classes()).toContain('custom-class')
    expect(wrapper.find('[data-slot="transfer"]').classes()).toContain('transfer')
  })

  // ─── Drag-and-drop ────────────────────────────────────────────────────
  // Additional way to move a single item; the checkbox+button controls
  // above remain the primary, always-present, keyboard-operable path.

  function fakeDataTransfer() {
    return { effectAllowed: '', dropEffect: '', setData: () => {} }
  }

  it('dragging a source item and dropping it on the target panel moves it', async () => {
    const wrapper = mount(
      defineComponent({
        components: { Transfer },
        setup() {
          return { items }
        },
        data() {
          return { modelValue: [] as string[] }
        },
        template: '<Transfer v-model="modelValue" :items="items" />',
      }),
      { attachTo: document.body },
    )
    const sourceOption = wrapper.find('[data-slot="transfer-source-body"] [role="option"]')
    await sourceOption.trigger('dragstart', { dataTransfer: fakeDataTransfer() })
    await wrapper.find('[data-slot="transfer-target-body"]').trigger('drop', { dataTransfer: fakeDataTransfer() })
    expect((wrapper.vm as unknown as { modelValue: string[] }).modelValue).toEqual(['alice'])
    wrapper.unmount()
  })

  it('dragging a target item and dropping it on the source panel moves it back', async () => {
    const wrapper = mount(
      defineComponent({
        components: { Transfer },
        setup() {
          return { items }
        },
        data() {
          return { modelValue: ['alice', 'bob', 'carol'] as string[] }
        },
        template: '<Transfer v-model="modelValue" :items="items" />',
      }),
      { attachTo: document.body },
    )
    const targetOption = wrapper.find('[data-slot="transfer-target-body"] [role="option"]')
    await targetOption.trigger('dragstart', { dataTransfer: fakeDataTransfer() })
    await wrapper.find('[data-slot="transfer-source-body"]').trigger('drop', { dataTransfer: fakeDataTransfer() })
    const remaining = (wrapper.vm as unknown as { modelValue: string[] }).modelValue
    expect(remaining).toHaveLength(2)
    expect(remaining).not.toContain('alice')
    wrapper.unmount()
  })

  it('dropping on the same panel the drag started from is a no-op', async () => {
    const wrapper = mount(
      defineComponent({
        components: { Transfer },
        setup() {
          return { items }
        },
        data() {
          return { modelValue: [] as string[] }
        },
        template: '<Transfer v-model="modelValue" :items="items" />',
      }),
      { attachTo: document.body },
    )
    const sourceOption = wrapper.find('[data-slot="transfer-source-body"] [role="option"]')
    await sourceOption.trigger('dragstart', { dataTransfer: fakeDataTransfer() })
    await wrapper.find('[data-slot="transfer-source-body"]').trigger('drop', { dataTransfer: fakeDataTransfer() })
    expect((wrapper.vm as unknown as { modelValue: string[] }).modelValue).toEqual([])
    wrapper.unmount()
  })

  it('dragend without a drop clears drag state without moving anything', async () => {
    const wrapper = mount(
      defineComponent({
        components: { Transfer },
        setup() {
          return { items }
        },
        data() {
          return { modelValue: [] as string[] }
        },
        template: '<Transfer v-model="modelValue" :items="items" />',
      }),
      { attachTo: document.body },
    )
    const sourceOption = wrapper.find('[data-slot="transfer-source-body"] [role="option"]')
    await sourceOption.trigger('dragstart', { dataTransfer: fakeDataTransfer() })
    await sourceOption.trigger('dragend')
    await wrapper.find('[data-slot="transfer-target-body"]').trigger('drop', { dataTransfer: fakeDataTransfer() })
    expect((wrapper.vm as unknown as { modelValue: string[] }).modelValue).toEqual([])
    wrapper.unmount()
  })

  it('a disabled item is not draggable', () => {
    const withDisabled = [...items, { value: 'dave', label: 'Dave', isDisabled: true }]
    const wrapper = mount(
      defineComponent({
        components: { Transfer },
        setup() {
          return { withDisabled }
        },
        template: '<Transfer :items="withDisabled" />',
      }),
    )
    const options = wrapper.findAll('[role="option"]')
    const daveOption = options.find(o => o.text() === 'Dave')!
    expect(daveOption.attributes('draggable')).toBe('false')
  })

  it('isDisabled: true on Transfer makes no item draggable', () => {
    const wrapper = mountTransfer({ isDisabled: true })
    const options = wrapper.findAll('[role="option"]')
    options.forEach((o) => {
      expect(o.attributes('draggable')).toBe('false')
    })
  })

  it('a non-disabled item is draggable', () => {
    const wrapper = mountTransfer()
    const options = wrapper.findAll('[role="option"]')
    expect(options[0]!.attributes('draggable')).toBe('true')
  })
})
