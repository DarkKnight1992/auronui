/**
 * ToggleButtonGroup — dedicated group-level tests.
 *
 * The selection-mode (single/multiple) tests are co-located in ToggleButton.test.ts
 * under the "ToggleButtonGroup — selection modes" describe block since they exercise
 * both components together. This file focuses on group-level props that are independent
 * of selection mode.
 */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, defineComponent, nextTick } from 'vue'
import ToggleButton from '../ToggleButton.vue'
import ToggleButtonGroup from '../ToggleButtonGroup.vue'

describe('ToggleButtonGroup', () => {
  it('renders role="group"', () => {
    const wrapper = mount(ToggleButtonGroup, {
      slots: { default: '<button aria-label="x">X</button>' },
    })
    expect(wrapper.attributes('role')).toBe('group')
  })

  it('propagates variant to child ToggleButtons', () => {
    const Wrapper = defineComponent({
      components: { ToggleButton, ToggleButtonGroup },
      template: `
        <ToggleButtonGroup variant="ghost">
          <ToggleButton value="a" aria-label="A">A</ToggleButton>
        </ToggleButtonGroup>
      `,
    })
    const wrapper = mount(Wrapper)
    expect(wrapper.find('button').classes()).toContain('toggle-button--ghost')
  })

  it('child explicit variant overrides group variant', () => {
    const Wrapper = defineComponent({
      components: { ToggleButton, ToggleButtonGroup },
      template: `
        <ToggleButtonGroup variant="ghost">
          <ToggleButton value="a" variant="default" aria-label="A">A</ToggleButton>
        </ToggleButtonGroup>
      `,
    })
    const wrapper = mount(Wrapper)
    const btn = wrapper.find('button')
    expect(btn.classes()).toContain('toggle-button--default')
    expect(btn.classes()).not.toContain('toggle-button--ghost')
  })

  it('group disabled=true wins over child disabled=false (D-02)', async () => {
    const Wrapper = defineComponent({
      components: { ToggleButton, ToggleButtonGroup },
      template: `
        <ToggleButtonGroup :disabled="true">
          <ToggleButton value="a" :disabled="false" aria-label="A">A</ToggleButton>
        </ToggleButtonGroup>
      `,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    wrapper.unmount()
  })

  it('reactive group disabled toggles children', async () => {
    const disabled = ref(false)
    const Wrapper = defineComponent({
      components: { ToggleButton, ToggleButtonGroup },
      setup() { return { disabled } },
      template: `
        <ToggleButtonGroup :disabled="disabled">
          <ToggleButton value="a" aria-label="A">A</ToggleButton>
          <ToggleButton value="b" aria-label="B">B</ToggleButton>
        </ToggleButtonGroup>
      `,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    const buttons = wrapper.findAll('button')

    buttons.forEach(btn => expect(btn.attributes('disabled')).toBeUndefined())

    disabled.value = true
    await nextTick()

    buttons.forEach(btn => expect(btn.attributes('disabled')).toBeDefined())

    wrapper.unmount()
  })

  it('emits update:modelValue when child is toggled (single mode)', async () => {
    const selected = ref('')
    const Wrapper = defineComponent({
      components: { ToggleButton, ToggleButtonGroup },
      setup() { return { selected } },
      template: `
        <ToggleButtonGroup selectionMode="single" v-model="selected">
          <ToggleButton value="x" aria-label="X">X</ToggleButton>
        </ToggleButtonGroup>
      `,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })

    await wrapper.find('button').trigger('click')
    await nextTick()

    expect(selected.value).toBe('x')

    wrapper.unmount()
  })

  it('emits update:modelValue when child is toggled (multiple mode)', async () => {
    const selected = ref<string[]>([])
    const Wrapper = defineComponent({
      components: { ToggleButton, ToggleButtonGroup },
      setup() { return { selected } },
      template: `
        <ToggleButtonGroup selectionMode="multiple" v-model="selected">
          <ToggleButton value="x" aria-label="X">X</ToggleButton>
          <ToggleButton value="y" aria-label="Y">Y</ToggleButton>
        </ToggleButtonGroup>
      `,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    const buttons = wrapper.findAll('button')

    await buttons[0].trigger('click')
    await nextTick()
    expect(selected.value).toContain('x')

    await buttons[1].trigger('click')
    await nextTick()
    expect(selected.value).toContain('x')
    expect(selected.value).toContain('y')

    wrapper.unmount()
  })
})
