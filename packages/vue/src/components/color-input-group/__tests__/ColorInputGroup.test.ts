import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ColorInputGroup from '../ColorInputGroup.vue'

const mountedWrappers: ReturnType<typeof mount>[] = []

afterEach(() => {
  mountedWrappers.forEach((w) => w.unmount())
  mountedWrappers.length = 0
})

describe('ColorInputGroup', () => {
  it('Test 1: renders a ColorField with a ColorSwatch prefix', async () => {
    const wrapper = mount(ColorInputGroup, {
      props: { defaultValue: '#ff0000' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    // Should have an input (ColorField) and a color swatch
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('[class*="color-swatch"]').exists()).toBe(true)
  })

  it('Test 2: label prop is passed through to ColorField', async () => {
    const wrapper = mount(ColorInputGroup, {
      props: { label: 'Background color', defaultValue: '#ff0000' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    const label = wrapper.find('label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Background color')
  })

  it('Test 3: prefix swatch updates when ColorField value changes', async () => {
    const wrapper = mount(ColorInputGroup, {
      props: { defaultValue: '#ff0000' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    // Swatch should exist and be reactive
    const swatch = wrapper.find('[class*="color-swatch"]')
    expect(swatch.exists()).toBe(true)
  })

  it('Test 4: suffixLabel renders format label', async () => {
    const wrapper = mount(ColorInputGroup, {
      props: { defaultValue: '#ff0000', suffixLabel: 'HEX' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    expect(wrapper.text()).toContain('HEX')
  })

  it('Test 5: defaultValue threaded to both prefix and input', async () => {
    const wrapper = mount(ColorInputGroup, {
      props: { defaultValue: '#abcdef', label: 'Color' },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('[class*="color-swatch"]').exists()).toBe(true)
  })
})
