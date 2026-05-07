import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref, nextTick } from 'vue'
import Checkbox from '../Checkbox.vue'
import CheckboxGroup from '../CheckboxGroup.vue'

describe('CheckboxGroup', () => {
  it('renders a div with role="group"', () => {
    const wrapper = mount(CheckboxGroup, {
      props: { label: 'My group' },
      slots: { default: '' },
    })
    expect(wrapper.attributes('role')).toBe('group')
  })

  it('renders label when label prop provided', () => {
    const wrapper = mount(CheckboxGroup, {
      props: { label: 'Choose options' },
      slots: { default: '' },
    })
    expect(wrapper.text()).toContain('Choose options')
  })

  it('renders description when description prop provided', () => {
    const wrapper = mount(CheckboxGroup, {
      props: { label: 'Options', description: 'Select all that apply' },
      slots: { default: '' },
    })
    expect(wrapper.text()).toContain('Select all that apply')
  })

  it('applies data-orientation attribute', () => {
    const wrapper = mount(CheckboxGroup, {
      props: { label: 'Group', orientation: 'horizontal' },
      slots: { default: '' },
    })
    expect(wrapper.attributes('data-orientation')).toBe('horizontal')
  })

  it('v-model controls selected values reactively', async () => {
    const selected = ref<string[]>(['a'])
    const Wrapper = defineComponent({
      components: { Checkbox, CheckboxGroup },
      setup() { return { selected } },
      template: `
        <CheckboxGroup v-model="selected" label="Group">
          <Checkbox value="a" aria-label="A" />
          <Checkbox value="b" aria-label="B" />
        </CheckboxGroup>
      `,
    })
    const wrapper = mount(Wrapper)
    const [cbA, cbB] = wrapper.findAllComponents(Checkbox)
    expect(cbA!.find('[data-state]').attributes('data-state')).toBe('checked')
    expect(cbB!.find('[data-state]').attributes('data-state')).toBe('unchecked')

    selected.value = ['a', 'b']
    await nextTick()
    expect(cbB!.find('[data-state]').attributes('data-state')).toBe('checked')
  })

  it('uncontrolled mode works via defaultValue', () => {
    const Wrapper = defineComponent({
      components: { Checkbox, CheckboxGroup },
      template: `
        <CheckboxGroup :defaultValue="['c']" label="Group">
          <Checkbox value="c" aria-label="C" />
          <Checkbox value="d" aria-label="D" />
        </CheckboxGroup>
      `,
    })
    const wrapper = mount(Wrapper)
    const [cbC, cbD] = wrapper.findAllComponents(Checkbox)
    expect(cbC!.find('[data-state]').attributes('data-state')).toBe('checked')
    expect(cbD!.find('[data-state]').attributes('data-state')).toBe('unchecked')
  })
})
