import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, defineComponent, nextTick } from 'vue'
import Button from '../Button.vue'
import ButtonGroup from '../ButtonGroup.vue'

describe('ButtonGroup', () => {
  it('renders a div with button-group class', () => {
    const wrapper = mount(ButtonGroup, {
      slots: { default: '<button>A</button>' },
    })
    expect(wrapper.element.tagName.toLowerCase()).toBe('div')
    expect(wrapper.classes()).toContain('button-group')
  })

  it('applies orientation class (horizontal)', () => {
    const wrapper = mount(ButtonGroup, {
      props: { orientation: 'horizontal' },
      slots: { default: '<button>A</button>' },
    })
    expect(wrapper.classes()).toContain('button-group--horizontal')
    expect(wrapper.attributes('data-orientation')).toBe('horizontal')
  })

  it('applies orientation class (vertical)', () => {
    const wrapper = mount(ButtonGroup, {
      props: { orientation: 'vertical' },
      slots: { default: '<button>A</button>' },
    })
    expect(wrapper.classes()).toContain('button-group--vertical')
    expect(wrapper.attributes('data-orientation')).toBe('vertical')
  })

  it('propagates variant to child Buttons', () => {
    const Wrapper = defineComponent({
      components: { ButtonGroup, Button },
      template: '<ButtonGroup variant="success"><Button id="btn">A</Button></ButtonGroup>',
    })
    const wrapper = mount(Wrapper)
    const btn = wrapper.findComponent(Button)
    expect(btn.classes()).toContain('button--success')
  })

  it('child explicit variant overrides group variant (D-13)', () => {
    const Wrapper = defineComponent({
      components: { ButtonGroup, Button },
      template: '<ButtonGroup variant="success"><Button variant="danger">A</Button></ButtonGroup>',
    })
    const wrapper = mount(Wrapper)
    const btn = wrapper.findComponent(Button)
    expect(btn.classes()).toContain('button--danger')
    expect(btn.classes()).not.toContain('button--success')
  })

  it('reactive group disabled=true disables all children (D-22)', async () => {
    const disabled = ref(false)
    const Wrapper = defineComponent({
      components: { ButtonGroup, Button },
      setup() { return { disabled } },
      template: `
        <ButtonGroup :disabled="disabled">
          <Button>A</Button>
          <Button>B</Button>
          <Button>C</Button>
        </ButtonGroup>
      `,
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    const buttons = wrapper.findAllComponents(Button)

    // Initially all enabled
    buttons.forEach(btn => {
      expect(btn.attributes('disabled')).toBeUndefined()
    })

    // Toggle group disabled
    disabled.value = true
    await nextTick()

    // All buttons must be disabled now
    buttons.forEach(btn => {
      expect(btn.attributes('disabled')).toBeDefined()
    })

    // Toggle back
    disabled.value = false
    await nextTick()

    buttons.forEach(btn => {
      expect(btn.attributes('disabled')).toBeUndefined()
    })

    wrapper.unmount()
  })

  it('group disabled wins over child disabled=false (D-13)', async () => {
    const Wrapper = defineComponent({
      components: { ButtonGroup, Button },
      template: '<ButtonGroup :disabled="true"><Button :disabled="false">A</Button></ButtonGroup>',
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    const btn = wrapper.findComponent(Button)
    expect(btn.attributes('disabled')).toBeDefined()
    wrapper.unmount()
  })

  it('renders role="group" for accessibility', () => {
    const wrapper = mount(ButtonGroup, {
      slots: { default: '<button>A</button>' },
    })
    expect(wrapper.attributes('role')).toBe('group')
  })

  it('applies fullWidth class', () => {
    const wrapper = mount(ButtonGroup, {
      props: { fullWidth: true },
      slots: { default: '<button>A</button>' },
    })
    expect(wrapper.classes()).toContain('button-group--full-width')
  })
})
