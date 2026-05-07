import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref, nextTick } from 'vue'
import Checkbox from '../Checkbox.vue'
import CheckboxGroup from '../CheckboxGroup.vue'

describe('Checkbox (standalone)', () => {
  it('Test 1: renders data-state="checked" when modelValue=true', () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: true, 'aria-label': 'Accept' },
    })
    const root = wrapper.find('[data-state]')
    expect(root.attributes('data-state')).toBe('checked')
  })

  it('Test 2: renders data-state="unchecked" when modelValue=false', () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: false, 'aria-label': 'Accept' },
    })
    const root = wrapper.find('[data-state]')
    expect(root.attributes('data-state')).toBe('unchecked')
  })

  it('Test 3: renders data-state="indeterminate" when isIndeterminate=true', () => {
    const wrapper = mount(Checkbox, {
      props: { isIndeterminate: true, 'aria-label': 'Select all' },
    })
    const root = wrapper.find('[data-state]')
    expect(root.attributes('data-state')).toBe('indeterminate')
  })

  it('Test 4: clicking Checkbox toggles v-model boolean (standalone)', async () => {
    const modelValue = ref(false)
    const Wrapper = defineComponent({
      components: { Checkbox },
      setup() { return { modelValue } },
      template: '<Checkbox v-model="modelValue" aria-label="Accept" />',
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    const root = wrapper.find('[data-state]')
    await root.trigger('click')
    await nextTick()
    expect(modelValue.value).toBe(true)
    wrapper.unmount()
  })
})

describe('CheckboxGroup', () => {
  it('Test 5: CheckboxGroup with v-model=["a","b"] marks value="a" and value="b" as checked', () => {
    const Wrapper = defineComponent({
      components: { Checkbox, CheckboxGroup },
      template: `
        <CheckboxGroup :modelValue="['a', 'b']" label="Group">
          <Checkbox value="a" aria-label="A" />
          <Checkbox value="b" aria-label="B" />
          <Checkbox value="c" aria-label="C" />
        </CheckboxGroup>
      `,
    })
    const wrapper = mount(Wrapper)
    const checkboxes = wrapper.findAllComponents(Checkbox)
    const [cbA, cbB, cbC] = checkboxes
    expect(cbA!.find('[data-state]').attributes('data-state')).toBe('checked')
    expect(cbB!.find('[data-state]').attributes('data-state')).toBe('checked')
    expect(cbC!.find('[data-state]').attributes('data-state')).toBe('unchecked')
  })

  it('Test 6: clicking child Checkbox in group adds value to group v-model', async () => {
    const selected = ref<string[]>([])
    const Wrapper = defineComponent({
      components: { Checkbox, CheckboxGroup },
      setup() { return { selected } },
      template: `
        <CheckboxGroup v-model="selected" label="Group">
          <Checkbox value="x" aria-label="X" />
        </CheckboxGroup>
      `,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    const root = wrapper.find('[data-state]')
    await root.trigger('click')
    await nextTick()
    expect(selected.value).toContain('x')
    wrapper.unmount()
  })

  it('Test 7: CheckboxGroup with disabled=true disables all children reactively (group disabled wins)', async () => {
    const disabled = ref(false)
    const Wrapper = defineComponent({
      components: { Checkbox, CheckboxGroup },
      setup() { return { disabled } },
      template: `
        <CheckboxGroup :disabled="disabled" label="Group">
          <Checkbox value="a" aria-label="A" />
          <Checkbox value="b" aria-label="B" />
        </CheckboxGroup>
      `,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    const checkboxes = wrapper.findAllComponents(Checkbox)

    // Initially enabled
    checkboxes.forEach(cb => {
      expect(cb.find('[data-state]').attributes('data-disabled')).toBeUndefined()
    })

    disabled.value = true
    await nextTick()

    // All disabled
    checkboxes.forEach(cb => {
      const dataDisabled = cb.find('[data-state]').attributes('data-disabled')
      expect(dataDisabled).toBeDefined()
    })

    wrapper.unmount()
  })

  it('Test 8: Child Checkbox with own disabled=true is disabled even when group is not', () => {
    const Wrapper = defineComponent({
      components: { Checkbox, CheckboxGroup },
      template: `
        <CheckboxGroup label="Group">
          <Checkbox value="a" aria-label="A" :disabled="true" />
          <Checkbox value="b" aria-label="B" />
        </CheckboxGroup>
      `,
    })
    const wrapper = mount(Wrapper)
    const [cbA, cbB] = wrapper.findAllComponents(Checkbox)
    expect(cbA!.find('[data-state]').attributes('data-disabled')).toBeDefined()
    expect(cbB!.find('[data-state]').attributes('data-disabled')).toBeUndefined()
  })

  it('Test 9: Child Checkbox variant prop overrides group variant (child wins for non-disabled props)', () => {
    const Wrapper = defineComponent({
      components: { Checkbox, CheckboxGroup },
      template: `
        <CheckboxGroup variant="secondary" label="Group">
          <Checkbox value="a" aria-label="A" variant="primary" />
          <Checkbox value="b" aria-label="B" />
        </CheckboxGroup>
      `,
    })
    const wrapper = mount(Wrapper)
    // Query buttons directly — findAllComponents().classes() is unreliable with inheritAttrs:false
    const buttons = wrapper.findAll('button[role="checkbox"]')
    const [btnA, btnB] = buttons
    // cbA has explicit primary variant — should have checkbox--primary class
    expect(btnA!.classes().join(' ')).toContain('checkbox--primary')
    // cbB inherits secondary from group
    expect(btnB!.classes().join(' ')).toContain('checkbox--secondary')
  })
})
