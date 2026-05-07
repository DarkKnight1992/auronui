import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref, nextTick } from 'vue'
import Switch from '../Switch.vue'
import SwitchGroup from '../SwitchGroup.vue'

describe('SwitchGroup', () => {
  it('renders a div with role="group"', () => {
    const wrapper = mount(SwitchGroup, {
      props: { label: 'My group' },
      slots: { default: '' },
    })
    expect(wrapper.attributes('role')).toBe('group')
  })

  it('renders label when label prop provided', () => {
    const wrapper = mount(SwitchGroup, {
      props: { label: 'Toggle options' },
      slots: { default: '' },
    })
    expect(wrapper.text()).toContain('Toggle options')
  })

  it('renders description when description prop provided', () => {
    const wrapper = mount(SwitchGroup, {
      props: { label: 'Options', description: 'Manage your preferences' },
      slots: { default: '' },
    })
    expect(wrapper.text()).toContain('Manage your preferences')
  })

  it('applies data-orientation attribute', () => {
    const wrapper = mount(SwitchGroup, {
      props: { label: 'Group', orientation: 'horizontal' },
      slots: { default: '' },
    })
    expect(wrapper.attributes('data-orientation')).toBe('horizontal')
  })

  it('v-model controls selected values reactively', async () => {
    const selected = ref<string[]>(['a'])
    const Wrapper = defineComponent({
      components: { Switch, SwitchGroup },
      setup() { return { selected } },
      template: `
        <SwitchGroup v-model="selected" label="Group">
          <Switch value="a" aria-label="A" />
          <Switch value="b" aria-label="B" />
        </SwitchGroup>
      `,
    })
    const wrapper = mount(Wrapper)
    const [swA, swB] = wrapper.findAllComponents(Switch)
    expect(swA!.find('[data-state]').attributes('data-state')).toBe('checked')
    expect(swB!.find('[data-state]').attributes('data-state')).toBe('unchecked')

    selected.value = ['a', 'b']
    await nextTick()
    expect(swB!.find('[data-state]').attributes('data-state')).toBe('checked')
  })

  it('uncontrolled mode works via defaultValue', () => {
    const Wrapper = defineComponent({
      components: { Switch, SwitchGroup },
      template: `
        <SwitchGroup :defaultValue="['c']" label="Group">
          <Switch value="c" aria-label="C" />
          <Switch value="d" aria-label="D" />
        </SwitchGroup>
      `,
    })
    const wrapper = mount(Wrapper)
    const [swC, swD] = wrapper.findAllComponents(Switch)
    expect(swC!.find('[data-state]').attributes('data-state')).toBe('checked')
    expect(swD!.find('[data-state]').attributes('data-state')).toBe('unchecked')
  })
})
