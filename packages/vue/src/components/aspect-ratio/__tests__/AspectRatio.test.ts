import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AspectRatio from '../AspectRatio.vue'

describe('AspectRatio', () => {
  it('Test 1: default ratio=1 applies padding-bottom: 100% to the wrapper element', () => {
    const wrapper = mount(AspectRatio, {
      slots: { default: 'Content' },
    })
    const outerWrapper = wrapper.find('[data-reka-aspect-ratio-wrapper]')
    expect(outerWrapper.exists()).toBe(true)
    expect(outerWrapper.attributes('style')).toContain('padding-bottom: 100%')
  })

  it('Test 2: custom ratio prop applies the correct padding-bottom percentage', () => {
    const wrapper = mount(AspectRatio, {
      props: { ratio: 16 / 9 },
      slots: { default: 'Content' },
    })
    const outerWrapper = wrapper.find('[data-reka-aspect-ratio-wrapper]')
    expect(outerWrapper.attributes('style')).toContain('padding-bottom: 56.25%')
  })

  it('Test 3: renders data-slot="aspect-ratio" on the root content element', () => {
    const wrapper = mount(AspectRatio, {
      slots: { default: 'Content' },
    })
    const root = wrapper.find('[data-slot="aspect-ratio"]')
    expect(root.exists()).toBe(true)
  })

  it('Test 4: default slot content renders inside the root element', () => {
    const wrapper = mount(AspectRatio, {
      slots: { default: '<span class="probe">hello</span>' },
    })
    const root = wrapper.find('[data-slot="aspect-ratio"]')
    expect(root.find('.probe').exists()).toBe(true)
    expect(root.text()).toBe('hello')
  })

  it('Test 5: custom class prop merges onto the root element alongside the base variant class', () => {
    const wrapper = mount(AspectRatio, {
      props: { class: 'my-custom' },
      slots: { default: 'Content' },
    })
    const root = wrapper.find('[data-slot="aspect-ratio"]')
    expect(root.classes()).toContain('aspect-ratio')
    expect(root.classes()).toContain('my-custom')
  })

  it('Test 6: classNames.base override merges onto the root element', () => {
    const wrapper = mount(AspectRatio, {
      props: { classNames: { base: 'base-override' } },
      slots: { default: 'Content' },
    })
    const root = wrapper.find('[data-slot="aspect-ratio"]')
    expect(root.classes()).toContain('base-override')
  })

  it('Test 7: as="span" renders a span for the root element instead of a div', () => {
    const wrapper = mount(AspectRatio, {
      props: { as: 'span' },
      slots: { default: 'Content' },
    })
    const root = wrapper.find('[data-slot="aspect-ratio"]')
    expect(root.element.tagName).toBe('SPAN')
  })

  it('Test 8: asChild renders the slotted child directly, merging attrs onto it with no extra wrapper div', () => {
    const wrapper = mount(AspectRatio, {
      props: { asChild: true },
      slots: { default: '<a href="#">link</a>' },
    })
    const outerWrapper = wrapper.find('[data-reka-aspect-ratio-wrapper]')
    const root = outerWrapper.find('[data-slot="aspect-ratio"]')
    expect(root.element.tagName).toBe('A')
    expect(root.attributes('href')).toBe('#')
    expect(outerWrapper.element.children.length).toBe(1)
    expect(outerWrapper.element.children[0]).toBe(root.element)
  })
})
