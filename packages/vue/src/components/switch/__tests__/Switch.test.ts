import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref, nextTick } from 'vue'
import Switch from '../Switch.vue'
import SwitchGroup from '../SwitchGroup.vue'

describe('Switch (standalone)', () => {
  it('Test 1: renders data-state="checked" when modelValue=true', () => {
    const wrapper = mount(Switch, {
      props: { modelValue: true, 'aria-label': 'Enable notifications' },
    })
    const root = wrapper.find('[data-state]')
    expect(root.attributes('data-state')).toBe('checked')
  })

  it('Test 2: clicking standalone Switch toggles v-model boolean', async () => {
    const modelValue = ref(false)
    const Wrapper = defineComponent({
      components: { Switch },
      setup() { return { modelValue } },
      template: '<Switch v-model="modelValue" aria-label="Enable" />',
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    const root = wrapper.find('[data-state]')
    await root.trigger('click')
    await nextTick()
    expect(modelValue.value).toBe(true)
    wrapper.unmount()
  })

  it('Test 6: Child Switch with own disabled=true is disabled', () => {
    const wrapper = mount(Switch, {
      props: { disabled: true, 'aria-label': 'Disabled switch' },
    })
    const root = wrapper.find('[data-state]')
    expect(root.attributes('data-disabled')).toBeDefined()
  })
})

describe('SwitchGroup', () => {
  it('Test 3: SwitchGroup with v-model=["a"] marks child with value="a" as checked', () => {
    const Wrapper = defineComponent({
      components: { Switch, SwitchGroup },
      template: `
        <SwitchGroup :modelValue="['a']" label="Options">
          <Switch value="a" aria-label="A" />
          <Switch value="b" aria-label="B" />
        </SwitchGroup>
      `,
    })
    const wrapper = mount(Wrapper)
    const switches = wrapper.findAllComponents(Switch)
    const [swA, swB] = switches
    expect(swA!.find('[data-state]').attributes('data-state')).toBe('checked')
    expect(swB!.find('[data-state]').attributes('data-state')).toBe('unchecked')
  })

  it('Test 4: clicking child Switch in group adds/removes value from group v-model', async () => {
    const selected = ref<string[]>([])
    const Wrapper = defineComponent({
      components: { Switch, SwitchGroup },
      setup() { return { selected } },
      template: `
        <SwitchGroup v-model="selected" label="Options">
          <Switch value="x" aria-label="X" />
        </SwitchGroup>
      `,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    const root = wrapper.find('[data-state]')
    await root.trigger('click')
    await nextTick()
    expect(selected.value).toContain('x')
    wrapper.unmount()
  })

  it('Test 5: SwitchGroup disabled=true disables all children reactively', async () => {
    const disabled = ref(false)
    const Wrapper = defineComponent({
      components: { Switch, SwitchGroup },
      setup() { return { disabled } },
      template: `
        <SwitchGroup :disabled="disabled" label="Options">
          <Switch value="a" aria-label="A" />
          <Switch value="b" aria-label="B" />
        </SwitchGroup>
      `,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    const switches = wrapper.findAllComponents(Switch)

    // Initially enabled
    switches.forEach(sw => {
      expect(sw.find('[data-state]').attributes('data-disabled')).toBeUndefined()
    })

    disabled.value = true
    await nextTick()

    // All disabled
    switches.forEach(sw => {
      const dataDisabled = sw.find('[data-state]').attributes('data-disabled')
      expect(dataDisabled).toBeDefined()
    })

    wrapper.unmount()
  })

  it('Test 7: Child size prop overrides group size', () => {
    const Wrapper = defineComponent({
      components: { Switch, SwitchGroup },
      template: `
        <SwitchGroup size="lg" label="Options">
          <Switch value="a" aria-label="A" size="sm" />
          <Switch value="b" aria-label="B" />
        </SwitchGroup>
      `,
    })
    const wrapper = mount(Wrapper)
    const buttons = wrapper.findAll('button[role="switch"]')
    const [btnA, btnB] = buttons
    // btnA has explicit sm size — should have switch--sm class
    expect(btnA!.classes().join(' ')).toContain('switch--sm')
    // btnB inherits lg from group
    expect(btnB!.classes().join(' ')).toContain('switch--lg')
  })
})
