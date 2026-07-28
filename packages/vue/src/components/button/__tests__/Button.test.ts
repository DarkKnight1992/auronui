import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, defineComponent, nextTick } from 'vue'
import Button from '../Button.vue'
import ButtonGroup from '../ButtonGroup.vue'
import { _clearWarnedCache } from '../../../utils/warnDeprecated'

describe('Button', () => {
  beforeEach(() => {
    _clearWarnedCache()
  })

  it('renders as <button> element by default', () => {
    const wrapper = mount(Button, { slots: { default: 'Click' } })
    expect(wrapper.element.tagName.toLowerCase()).toBe('button')
  })

  it('defaults type="button" so it never submits an ancestor form', () => {
    const wrapper = mount(Button, { slots: { default: 'Click' } })
    expect(wrapper.attributes('type')).toBe('button')
  })

  it('an explicit type attr overrides the type="button" default', () => {
    const wrapper = mount(Button, { attrs: { type: 'submit' }, slots: { default: 'Save' } })
    expect(wrapper.attributes('type')).toBe('submit')
  })

  it('does not force a type attr when rendered as a non-button element', () => {
    const wrapper = mount(Button, { props: { as: 'a' }, slots: { default: 'Click' } })
    expect(wrapper.attributes('type')).toBeUndefined()
  })

  it('applies variant class', () => {
    const wrapper = mount(Button, { props: { variant: 'soft' }, slots: { default: 'OK' } })
    expect(wrapper.classes()).toContain('button--soft')
  })

  it('applies color class', () => {
    const wrapper = mount(Button, { props: { color: 'danger' }, slots: { default: 'OK' } })
    expect(wrapper.classes()).toContain('button--color-danger')
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
      template: '<ButtonGroup variant="ghost"><Button>Test</Button></ButtonGroup>',
    })
    const wrapper = mount(Wrapper)
    const btn = wrapper.findComponent(Button)
    expect(btn.classes()).toContain('button--ghost')
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

  it("applies 'button--bordered' with variant='bordered'", () => {
    const wrapper = mount(Button, { props: { variant: 'bordered' }, slots: { default: 'OK' } })
    expect(wrapper.classes()).toContain('button--bordered')
  })

  it("applies 'button--bordered' with deprecated variant='outline' (backward compat)", () => {
    const wrapper = mount(Button, { props: { variant: 'outline' as any }, slots: { default: 'OK' } })
    expect(wrapper.classes()).toContain('button--bordered')
    expect(wrapper.classes()).not.toContain('button--outline')
  })

  it("emits a deprecation warning when variant='outline' is used", () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mount(Button, { props: { variant: 'outline' as any }, slots: { default: 'OK' } })
    expect(warn).toHaveBeenCalledWith(
      '[AuronUI] Button: variant="outline" is deprecated, use variant="bordered" instead.'
    )
    warn.mockRestore()
  })
})
