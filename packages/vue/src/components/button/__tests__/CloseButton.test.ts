import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, defineComponent, nextTick } from 'vue'
import CloseButton from '../CloseButton.vue'
import ButtonGroup from '../ButtonGroup.vue'

describe('CloseButton', () => {
  it('renders as <button> element', () => {
    const wrapper = mount(CloseButton)
    expect(wrapper.element.tagName.toLowerCase()).toBe('button')
  })

  it('has button--icon-only class (isIconOnly=true)', () => {
    const wrapper = mount(CloseButton)
    expect(wrapper.classes()).toContain('button--icon-only')
  })

  it('has button--ghost class (variant="ghost" default)', () => {
    const wrapper = mount(CloseButton)
    expect(wrapper.classes()).toContain('button--ghost')
  })

  it('has default aria-label="Close" (D-17)', () => {
    const wrapper = mount(CloseButton)
    expect(wrapper.attributes('aria-label')).toBe('Close')
  })

  it('aria-label is overridable via ariaLabel prop (D-17)', () => {
    const wrapper = mount(CloseButton, { props: { ariaLabel: 'Dismiss notification' } })
    expect(wrapper.attributes('aria-label')).toBe('Dismiss notification')
  })

  it('renders SVG X glyph with aria-hidden (D-16)', () => {
    const wrapper = mount(CloseButton)
    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    expect(svg.attributes('aria-hidden')).toBe('true')
  })

  it('SVG has two <line> elements forming an X cross', () => {
    const wrapper = mount(CloseButton)
    const lines = wrapper.findAll('line')
    expect(lines.length).toBe(2)
  })

  it('size prop forwarded to Button (size="sm")', () => {
    const wrapper = mount(CloseButton, { props: { size: 'sm' } })
    expect(wrapper.classes()).toContain('button--sm')
  })

  it('size prop forwarded to Button (size="lg")', () => {
    const wrapper = mount(CloseButton, { props: { size: 'lg' } })
    expect(wrapper.classes()).toContain('button--lg')
  })

  it('disabled prop forwarded to Button', () => {
    const wrapper = mount(CloseButton, { props: { disabled: true } })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('inherits group disabled from ButtonGroup (via Button)', async () => {
    const disabled = ref(false)
    const Wrapper = defineComponent({
      components: { ButtonGroup, CloseButton },
      setup() { return { disabled } },
      template: '<ButtonGroup :disabled="disabled"><CloseButton /></ButtonGroup>',
    })
    const wrapper = mount(Wrapper, { attachTo: document.body })
    const closeBtn = wrapper.findComponent(CloseButton)

    expect(closeBtn.attributes('disabled')).toBeUndefined()

    disabled.value = true
    await nextTick()

    expect(closeBtn.attributes('disabled')).toBeDefined()
    wrapper.unmount()
  })
})
