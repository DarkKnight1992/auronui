import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, defineComponent, nextTick } from 'vue'
import Button from '../Button.vue'
import ButtonGroup from '../ButtonGroup.vue'

describe('Button', () => {
  it('renders as <button> element by default', () => {
    const wrapper = mount(Button, { slots: { default: 'Click' } })
    expect(wrapper.element.tagName.toLowerCase()).toBe('button')
  })

  it('applies variant class', () => {
    const wrapper = mount(Button, { props: { variant: 'success' }, slots: { default: 'OK' } })
    expect(wrapper.classes()).toContain('button--success')
  })

  it('applies size class', () => {
    const wrapper = mount(Button, { props: { size: 'lg' }, slots: { default: 'OK' } })
    expect(wrapper.classes()).toContain('button--lg')
  })

  it('sets data-disabled and disabled when disabled=true', () => {
    const wrapper = mount(Button, { props: { disabled: true }, slots: { default: 'OK' } })
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.attributes('data-disabled')).toBeDefined()
  })

  it('does NOT set data-disabled when disabled=false', () => {
    const wrapper = mount(Button, { props: { disabled: false }, slots: { default: 'OK' } })
    expect(wrapper.attributes('data-disabled')).toBeUndefined()
  })

  it('sets data-loading and renders Spinner when isLoading=true', () => {
    const wrapper = mount(Button, { props: { isLoading: true }, slots: { default: 'Wait' } })
    expect(wrapper.attributes('data-loading')).toBeDefined()
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.findComponent({ name: 'Spinner' }).exists()).toBe(true)
  })

  it('does NOT render Spinner when isLoading=false', () => {
    const wrapper = mount(Button, { props: { isLoading: false }, slots: { default: 'OK' } })
    expect(wrapper.findComponent({ name: 'Spinner' }).exists()).toBe(false)
  })

  it('uses group variant when child variant is unset', () => {
    const Wrapper = defineComponent({
      components: { ButtonGroup, Button },
      template: '<ButtonGroup variant="warning"><Button>Test</Button></ButtonGroup>',
    })
    const wrapper = mount(Wrapper)
    const btn = wrapper.findComponent(Button)
    expect(btn.classes()).toContain('button--warning')
  })

  it('group disabled=true wins over child disabled=false (D-13)', async () => {
    const disabled = ref(false)
    const Wrapper = defineComponent({
      components: { ButtonGroup, Button },
      setup() { return { disabled } },
      template: '<ButtonGroup :disabled="disabled"><Button :disabled="false">Test</Button></ButtonGroup>',
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    const btn = wrapper.findComponent(Button)
    expect(btn.attributes('disabled')).toBeUndefined()

    disabled.value = true
    await nextTick()

    expect(btn.attributes('disabled')).toBeDefined()
    wrapper.unmount()
  })

  it('renders startContent and endContent named slots', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Label',
        startContent: '<svg aria-hidden="true" />',
        endContent: '<svg aria-hidden="true" />',
      },
    })
    expect(wrapper.html()).toContain('button__start-content')
    expect(wrapper.html()).toContain('button__end-content')
  })
})
