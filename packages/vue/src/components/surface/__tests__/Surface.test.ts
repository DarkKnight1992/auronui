import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import { describe, it, expect } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import Surface from '../Surface.vue'
import { useSurfaceInject } from '../surface.context'

// Child component to test context injection
const ContextConsumer = defineComponent({
  setup() {
    const ctx = useSurfaceInject({ variant: ref('default') as any })
    return { variantFromCtx: ctx.variant }
  },
  template: '<div data-testid="ctx-variant">{{ variantFromCtx }}</div>',
})

describe('Surface', () => {
  it('renders as <div> by default', () => {
    const wrapper = mount(Surface)
    expect(wrapper.element.tagName.toLowerCase()).toBe('div')
  })

  it('renders as <section> when as="section"', () => {
    const wrapper = mount(Surface, { props: { as: 'section' } })
    expect(wrapper.element.tagName.toLowerCase()).toBe('section')
  })

  it('applies "surface surface--default" with default variant', () => {
    const wrapper = mount(Surface)
    expect(wrapper.classes()).toContain('surface')
    expect(wrapper.classes()).toContain('surface--default')
  })

  it('applies "surface surface--secondary" with variant="secondary"', () => {
    const wrapper = mount(Surface, { props: { variant: 'secondary' } })
    expect(wrapper.classes()).toContain('surface')
    expect(wrapper.classes()).toContain('surface--secondary')
  })

  it('applies "surface surface--tertiary" with variant="tertiary"', () => {
    const wrapper = mount(Surface, { props: { variant: 'tertiary' } })
    expect(wrapper.classes()).toContain('surface')
    expect(wrapper.classes()).toContain('surface--tertiary')
  })

  it('applies "surface surface--transparent" with variant="transparent"', () => {
    const wrapper = mount(Surface, { props: { variant: 'transparent' } })
    expect(wrapper.classes()).toContain('surface')
    expect(wrapper.classes()).toContain('surface--transparent')
  })

  it('provides SurfaceContext so child components can inject variant', () => {
    const wrapper = mount(Surface, {
      props: { variant: 'secondary' },
      slots: { default: ContextConsumer },
    })
    const consumer = wrapper.findComponent(ContextConsumer)
    expect(consumer.text()).toBe('secondary')
  })

  it('child injecting SurfaceContext receives the current variant value', () => {
    const wrapper = mount(Surface, {
      props: { variant: 'tertiary' },
      slots: { default: ContextConsumer },
    })
    const consumer = wrapper.findComponent(ContextConsumer)
    expect(consumer.text()).toBe('tertiary')
  })

  it('when variant prop changes reactively, child injecting context reflects the new value', async () => {
    const variant = ref<'default' | 'secondary' | 'tertiary' | 'transparent'>('default')
    const ParentWrapper = defineComponent({
      components: { Surface, ContextConsumer },
      setup() { return { variant } },
      template: '<Surface :variant="variant"><ContextConsumer /></Surface>',
    })
    const wrapper = mount(ParentWrapper)
    expect(wrapper.findComponent(ContextConsumer).text()).toBe('default')

    variant.value = 'secondary'
    await nextTick()
    expect(wrapper.findComponent(ContextConsumer).text()).toBe('secondary')
  })

  it('merges consumer class prop with TVA classes', () => {
    const wrapper = mount(Surface, { props: { class: 'my-custom-class' } })
    expect(wrapper.classes()).toContain('surface')
    expect(wrapper.classes()).toContain('my-custom-class')
  })

  it('passes axe audit with zero violations', async () => {
    const wrapper = mount(Surface, { attachTo: document.body })
    const results = await axe.run(wrapper.element)
    expect(results).toHaveNoViolations()
    wrapper.unmount()
  })
})
