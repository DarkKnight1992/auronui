import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref, nextTick } from 'vue'
import Radio from '../Radio.vue'
import RadioGroup from '../RadioGroup.vue'

describe('RadioGroup + Radio', () => {
  it('Test 1: RadioGroup with modelValue="a" renders child value="a" as checked (data-state="checked")', () => {
    const Wrapper = defineComponent({
      components: { Radio, RadioGroup },
      template: `
        <RadioGroup modelValue="a" label="Group">
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      `,
    })
    const wrapper = mount(Wrapper)
    const radios = wrapper.findAllComponents(Radio)
    expect(radios[0]!.find('[role="radio"]').attributes('data-state')).toBe('checked')
    expect(radios[1]!.find('[role="radio"]').attributes('data-state')).toBe('unchecked')
  })

  it('Test 2: Clicking a different child updates v-model to that child\'s value', async () => {
    const selected = ref('a')
    const Wrapper = defineComponent({
      components: { Radio, RadioGroup },
      setup() { return { selected } },
      template: `
        <RadioGroup v-model="selected" label="Group">
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      `,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    const radios = wrapper.findAllComponents(Radio)
    await radios[1]!.find('[role="radio"]').trigger('click')
    await nextTick()
    expect(selected.value).toBe('b')
    wrapper.unmount()
  })

  it('Test 3: Only one child can be checked at a time (native radio semantics)', () => {
    const Wrapper = defineComponent({
      components: { Radio, RadioGroup },
      template: `
        <RadioGroup modelValue="b" label="Group">
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
          <Radio value="c">Option C</Radio>
        </RadioGroup>
      `,
    })
    const wrapper = mount(Wrapper)
    const radios = wrapper.findAllComponents(Radio)
    const checkedCount = radios.filter(
      r => r.find('[role="radio"]').attributes('data-state') === 'checked'
    ).length
    expect(checkedCount).toBe(1)
    expect(radios[1]!.find('[role="radio"]').attributes('data-state')).toBe('checked')
  })

  it('Test 4: RadioGroup disabled=true disables all children reactively', async () => {
    const groupDisabled = ref(false)
    const Wrapper = defineComponent({
      components: { Radio, RadioGroup },
      setup() { return { groupDisabled } },
      template: `
        <RadioGroup :disabled="groupDisabled" label="Group">
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      `,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    const radios = wrapper.findAllComponents(Radio)

    // Initially enabled
    radios.forEach(r => {
      expect(r.find('[role="radio"]').attributes('data-disabled')).toBeUndefined()
    })

    groupDisabled.value = true
    await nextTick()

    // All disabled
    radios.forEach(r => {
      expect(r.find('[role="radio"]').attributes('data-disabled')).toBeDefined()
    })

    wrapper.unmount()
  })

  it('Test 5: Child Radio with own disabled=true is disabled even when group is not', () => {
    const Wrapper = defineComponent({
      components: { Radio, RadioGroup },
      template: `
        <RadioGroup label="Group">
          <Radio value="a" :disabled="true">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      `,
    })
    const wrapper = mount(Wrapper)
    const radios = wrapper.findAllComponents(Radio)
    expect(radios[0]!.find('[role="radio"]').attributes('data-disabled')).toBeDefined()
    expect(radios[1]!.find('[role="radio"]').attributes('data-disabled')).toBeUndefined()
  })

  it('Test 6: Child Radio variant prop overrides group variant (data-variant reflects child value)', () => {
    const Wrapper = defineComponent({
      components: { Radio, RadioGroup },
      template: `
        <RadioGroup variant="secondary" label="Group">
          <Radio value="a" variant="primary">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      `,
    })
    const wrapper = mount(Wrapper)
    const radios = wrapper.findAllComponents(Radio)
    expect(radios[0]!.find('[role="radio"]').attributes('data-variant')).toBe('primary')
    expect(radios[1]!.find('[role="radio"]').attributes('data-variant')).toBe('secondary')
  })

  it('Test 7: RadioGroupRoot renders with role="radiogroup" enabling native arrow-key navigation (Reka UI built-in)', () => {
    // Reka UI's RadioGroupRoot provides built-in arrow-key navigation via WAI-ARIA roving tabindex.
    // jsdom cannot fully simulate Reka's focus management, but we verify the structural contract:
    // - RadioGroupRoot renders role="radiogroup" (required for arrow-key semantics)
    // - Each RadioGroupItem renders role="radio" with tabindex managed by Reka
    // Full arrow-key interaction is covered by axe (aria wiring) + Storybook manual testing.
    const Wrapper = defineComponent({
      components: { Radio, RadioGroup },
      template: `
        <RadioGroup label="Group">
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      `,
    })
    const wrapper = mount(Wrapper)
    expect(wrapper.find('[role="radiogroup"]').exists()).toBe(true)
    const radios = wrapper.findAll('[role="radio"]')
    expect(radios.length).toBe(2)
    // Reka manages tabindex for roving tabindex pattern — each item has a tabindex attribute
    radios.forEach(r => {
      expect(r.attributes('tabindex')).toBeDefined()
    })
    wrapper.unmount()
  })
})
