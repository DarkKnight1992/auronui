import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import Cascader from '../Cascader.vue'

interface Place {
  value: string
  label: string
  children?: Place[]
}

const items: Place[] = [
  {
    value: 'ca',
    label: 'California',
    children: [
      { value: 'sf', label: 'San Francisco' },
      { value: 'la', label: 'Los Angeles' },
    ],
  },
  {
    value: 'ny',
    label: 'New York',
    children: [
      { value: 'nyc', label: 'New York City' },
      { value: 'buf', label: 'Buffalo' },
    ],
  },
  { value: 'tx', label: 'Texas' },
]

function mountCascader(props: Record<string, unknown> = {}) {
  return mount(Cascader, {
    props: {
      items,
      getKey: (i: Record<string, any>) => i.value,
      getChildren: (i: Record<string, any>) => i.children,
      ...props,
    },
    attachTo: document.body,
  })
}

describe('Cascader', () => {
  it('renders a closed trigger showing the placeholder when nothing is selected', () => {
    const wrapper = mountCascader({ placeholder: 'Choose a location' })
    expect(wrapper.find('[data-slot="cascader-trigger-value"]').text()).toBe('Choose a location')
    expect(wrapper.find('[data-slot="cascader-trigger-value"]').attributes('data-placeholder')).toBe('true')
  })

  it('clicking the trigger opens the panel with the root column', async () => {
    const wrapper = mountCascader()
    await wrapper.find('[data-slot="cascader-trigger"]').trigger('click')
    await nextTick()
    const columns = document.querySelectorAll('[data-slot="cascader-column"]')
    expect(columns.length).toBe(1)
    expect(document.body.textContent).toContain('California')
    expect(document.body.textContent).toContain('Texas')
    wrapper.unmount()
  })

  it('clicking a non-leaf item reveals a second column with its children, without closing', async () => {
    const wrapper = mountCascader()
    await wrapper.find('[data-slot="cascader-trigger"]').trigger('click')
    await nextTick()
    const california = Array.from(document.querySelectorAll('[data-slot="cascader-item"]'))
      .find(el => el.textContent?.includes('California'))!
    await california.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(document.querySelectorAll('[data-slot="cascader-column"]').length).toBe(2)
    expect(document.body.textContent).toContain('San Francisco')
    wrapper.unmount()
  })

  it('clicking a leaf item commits the full path to modelValue and closes the panel', async () => {
    const wrapper = mount(
      defineComponent({
        components: { Cascader },
        setup() {
          return { items }
        },
        data() {
          return { modelValue: [] as string[] }
        },
        template: '<Cascader v-model="modelValue" :items="items" :get-key="(i) => i.value" :get-children="(i) => i.children" />',
      }),
      { attachTo: document.body },
    )
    await wrapper.find('[data-slot="cascader-trigger"]').trigger('click')
    await nextTick()
    const california = Array.from(document.querySelectorAll('[data-slot="cascader-item"]'))
      .find(el => el.textContent?.includes('California'))!
    await california.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    const sf = Array.from(document.querySelectorAll('[data-slot="cascader-item"]'))
      .find(el => el.textContent?.includes('San Francisco'))!
    await sf.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect((wrapper.vm as unknown as { modelValue: string[] }).modelValue).toEqual(['ca', 'sf'])
    wrapper.unmount()
  })

  it('a leaf-only top-level item (no children) commits immediately on click', async () => {
    const wrapper = mount(
      defineComponent({
        components: { Cascader },
        setup() {
          return { items }
        },
        data() {
          return { modelValue: [] as string[] }
        },
        template: '<Cascader v-model="modelValue" :items="items" :get-key="(i) => i.value" :get-children="(i) => i.children" />',
      }),
      { attachTo: document.body },
    )
    await wrapper.find('[data-slot="cascader-trigger"]').trigger('click')
    await nextTick()
    const texas = Array.from(document.querySelectorAll('[data-slot="cascader-item"]'))
      .find(el => el.textContent?.includes('Texas'))!
    await texas.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect((wrapper.vm as unknown as { modelValue: string[] }).modelValue).toEqual(['tx'])
    wrapper.unmount()
  })

  it('an initial modelValue renders the display label as the joined path', () => {
    const wrapper = mountCascader({ modelValue: ['ca', 'sf'] })
    expect(wrapper.find('[data-slot="cascader-trigger-value"]').text()).toBe('California / San Francisco')
  })

  it('a custom separator joins the display path', () => {
    const wrapper = mountCascader({ modelValue: ['ca', 'sf'], separator: ' > ' })
    expect(wrapper.find('[data-slot="cascader-trigger-value"]').text()).toBe('California > San Francisco')
  })

  it('reopening with an existing modelValue shows the correct column depth and active items', async () => {
    const wrapper = mountCascader({ modelValue: ['ny', 'buf'] })
    await wrapper.find('[data-slot="cascader-trigger"]').trigger('click')
    await nextTick()
    expect(document.querySelectorAll('[data-slot="cascader-column"]').length).toBe(2)
    const activeItems = document.querySelectorAll('[data-slot="cascader-item"][data-active="true"]')
    const activeTexts = Array.from(activeItems).map(el => el.textContent)
    expect(activeTexts).toEqual(['New York', 'Buffalo'])
    wrapper.unmount()
  })

  it('ArrowRight on a non-leaf item moves into its children column', async () => {
    const wrapper = mountCascader()
    await wrapper.find('[data-slot="cascader-trigger"]').trigger('click')
    await nextTick()
    const california = Array.from(document.querySelectorAll('[data-slot="cascader-item"]'))
      .find(el => el.textContent?.includes('California'))! as HTMLElement
    california.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await nextTick()
    expect(document.querySelectorAll('[data-slot="cascader-column"]').length).toBe(2)
    wrapper.unmount()
  })

  it('isDisabled: true disables the trigger', () => {
    const wrapper = mountCascader({ isDisabled: true })
    expect(wrapper.find('[data-slot="cascader-trigger"]').attributes('disabled')).toBeDefined()
  })

  it('renders a label and pairs it with the trigger via for/id', () => {
    const wrapper = mountCascader({ label: 'Location' })
    const label = wrapper.find('label')
    expect(label.text()).toContain('Location')
    expect(label.attributes('for')).toBe(wrapper.find('[data-slot="cascader-trigger"]').attributes('id'))
  })

  it('errorMessage renders and is referenced by aria-describedby when isInvalid', () => {
    const wrapper = mountCascader({ isInvalid: true, errorMessage: 'Please choose a location' })
    const describedBy = wrapper.find('[data-slot="cascader-trigger"]').attributes('aria-describedby')
    expect(describedBy).toBeTruthy()
    expect(wrapper.find(`#${describedBy}`).text()).toBe('Please choose a location')
  })

  it('defaults to the flat variant and default color on the trigger', () => {
    const wrapper = mountCascader()
    const trigger = wrapper.find('[data-slot="cascader-trigger"]')
    expect(trigger.classes()).toContain('cascader__trigger--flat')
    expect(trigger.classes()).toContain('cascader__trigger--default')
  })

  it('variant prop applies the matching trigger modifier class', () => {
    const wrapper = mountCascader({ variant: 'bordered' })
    expect(wrapper.find('[data-slot="cascader-trigger"]').classes()).toContain('cascader__trigger--bordered')
  })

  it('color prop applies the matching trigger modifier class', () => {
    const wrapper = mountCascader({ color: 'primary' })
    expect(wrapper.find('[data-slot="cascader-trigger"]').classes()).toContain('cascader__trigger--primary')
  })

  it('accent color prop applies the matching trigger modifier class', () => {
    const wrapper = mountCascader({ color: 'accent' })
    expect(wrapper.find('[data-slot="cascader-trigger"]').classes()).toContain('cascader__trigger--accent')
  })
})
