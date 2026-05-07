import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref, nextTick } from 'vue'
import Radio from '../Radio.vue'
import RadioGroup from '../RadioGroup.vue'

describe('RadioGroup', () => {
  it('renders with role="radiogroup" via Reka UI RadioGroupRoot', () => {
    const wrapper = mount(RadioGroup, {
      props: { label: 'My group' },
      slots: { default: '' },
    })
    expect(wrapper.attributes('role')).toBe('radiogroup')
  })

  it('renders label when label prop provided', () => {
    const wrapper = mount(RadioGroup, {
      props: { label: 'Choose an option' },
      slots: { default: '' },
    })
    expect(wrapper.text()).toContain('Choose an option')
  })

  it('renders description when description prop provided', () => {
    const wrapper = mount(RadioGroup, {
      props: { label: 'Options', description: 'Pick one option below' },
      slots: { default: '' },
    })
    expect(wrapper.text()).toContain('Pick one option below')
  })

  it('applies data-orientation attribute', () => {
    const wrapper = mount(RadioGroup, {
      props: { label: 'Group', orientation: 'horizontal' },
      slots: { default: '' },
    })
    expect(wrapper.attributes('data-orientation')).toBe('horizontal')
  })

  it('v-model controls selected value reactively', async () => {
    const selected = ref('a')
    const Wrapper = defineComponent({
      components: { Radio, RadioGroup },
      setup() { return { selected } },
      template: `
        <RadioGroup v-model="selected" label="Group">
          <Radio value="a" aria-label="Option A" />
          <Radio value="b" aria-label="Option B" />
        </RadioGroup>
      `,
    })
    const wrapper = mount(Wrapper)
    const radios = wrapper.findAllComponents(Radio)
    expect(radios[0]!.find('[role="radio"]').attributes('data-state')).toBe('checked')
    expect(radios[1]!.find('[role="radio"]').attributes('data-state')).toBe('unchecked')

    selected.value = 'b'
    await nextTick()
    expect(radios[1]!.find('[role="radio"]').attributes('data-state')).toBe('checked')
    expect(radios[0]!.find('[role="radio"]').attributes('data-state')).toBe('unchecked')
  })

  it('uncontrolled mode works via defaultValue', () => {
    const Wrapper = defineComponent({
      components: { Radio, RadioGroup },
      template: `
        <RadioGroup defaultValue="b" label="Group">
          <Radio value="a" aria-label="Option A" />
          <Radio value="b" aria-label="Option B" />
        </RadioGroup>
      `,
    })
    const wrapper = mount(Wrapper)
    const radios = wrapper.findAllComponents(Radio)
    expect(radios[0]!.find('[role="radio"]').attributes('data-state')).toBe('unchecked')
    expect(radios[1]!.find('[role="radio"]').attributes('data-state')).toBe('checked')
  })
})
