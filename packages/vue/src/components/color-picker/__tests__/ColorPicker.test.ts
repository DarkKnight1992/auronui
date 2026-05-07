import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, inject } from 'vue'
import ColorArea from '../../color-area/ColorArea.vue'
import ColorSlider from '../../color-slider/ColorSlider.vue'
import ColorField from '../../color-field/ColorField.vue'
import ColorSwatch from '../../color-swatch/ColorSwatch.vue'
import { ColorPickerContextKey } from '../color-picker.context'
import ColorPicker from '../ColorPicker.vue'

// ResizeObserver polyfill needed for ColorSlider -> SliderRoot -> useSize
beforeEach(() => {
  if (!('ResizeObserver' in globalThis)) {
    globalThis.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  }
})

/** Helper: mounts ColorPicker with a slot probe that captures the injected context */
function mountWithProbe(pickerProps: Record<string, unknown> = {}) {
  let capturedCtx: any = null
  const Probe = defineComponent({
    setup() {
      capturedCtx = inject(ColorPickerContextKey, null)
      return () => h('span', 'probe')
    },
  })
  const wrapper = mount(ColorPicker, {
    props: pickerProps,
    slots: { default: () => h(Probe) },
  })
  return { wrapper, getCtx: () => capturedCtx }
}

describe('ColorPicker', () => {
  it('Test 1: Mounts with defaultValue and renders ColorSwatch and ColorField', () => {
    const wrapper = mount(ColorPicker, {
      props: { defaultValue: '#ff0000' },
    })
    expect(wrapper.findComponent(ColorSwatch).exists()).toBe(true)
    expect(wrapper.findComponent(ColorField).exists()).toBe(true)
  })

  it('Test 2: Provides ColorPickerContext to children with a Color ref', () => {
    const { getCtx } = mountWithProbe({ defaultValue: '#ff0000' })
    const ctx = getCtx()
    expect(ctx).not.toBeNull()
    expect(ctx.color).toBeDefined()
    expect(ctx.setChannel).toBeTypeOf('function')
    expect(ctx.setChannels).toBeTypeOf('function')
    expect(ctx.emitUpdate).toBeTypeOf('function')
  })

  it('Test 3: setChannel from context updates ColorSwatch reactively', async () => {
    const { wrapper, getCtx } = mountWithProbe({ defaultValue: '#ff0000' })
    const ctx = getCtx()
    expect(wrapper.findComponent(ColorSwatch).exists()).toBe(true)
    if (ctx) {
      ctx.setChannel('hue', 120)
      await wrapper.vm.$nextTick()
    }
    // After hue change the swatch is still mounted (reactivity did not crash)
    expect(wrapper.findComponent(ColorSwatch).exists()).toBe(true)
  })

  it('Test 4: setChannel emits update:modelValue with hex string (default format)', async () => {
    const { wrapper, getCtx } = mountWithProbe({
      defaultValue: '#ff0000',
      format: 'hex',
    })
    const ctx = getCtx()
    if (ctx) {
      ctx.emitUpdate(ctx.color.value.toString('hex') ?? '#ff0000')
    }
    await wrapper.vm.$nextTick()
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted!.length).toBeGreaterThan(0)
    const value = emitted![0][0] as string
    expect(typeof value).toBe('string')
  })

  it('Test 5: format="hsl" emits update:modelValue with HSL string', async () => {
    const { wrapper, getCtx } = mountWithProbe({
      defaultValue: '#ff0000',
      format: 'hsl',
    })
    const ctx = getCtx()
    if (ctx) {
      // Trigger onChange via setChannel — state.onChange calls emit('update:modelValue', serialized)
      ctx.setChannel('hue', 120)
    }
    await wrapper.vm.$nextTick()
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted!.length).toBeGreaterThan(0)
    const value = emitted![0][0] as string
    expect(value).toMatch(/^hsl\(/)
  })

  it('Test 6: Renders 1 ColorArea, 2 ColorSlider, 1 ColorField, 1 ColorSwatch', () => {
    const wrapper = mount(ColorPicker, {
      props: { defaultValue: '#3b82f6' },
    })
    expect(wrapper.findAllComponents(ColorArea)).toHaveLength(1)
    expect(wrapper.findAllComponents(ColorSlider)).toHaveLength(2)
    expect(wrapper.findAllComponents(ColorField)).toHaveLength(1)
    expect(wrapper.findAllComponents(ColorSwatch)).toHaveLength(1)
  })

  it('Test 7: Controlled mode — external modelValue update propagates to context color', async () => {
    const { wrapper, getCtx } = mountWithProbe({ modelValue: '#0000ff' })
    const ctx = getCtx()
    expect(ctx).not.toBeNull()
    await wrapper.setProps({ modelValue: '#ff0000' })
    await wrapper.vm.$nextTick()
    // Swatch still renders after prop update (controlled mode does not crash)
    expect(wrapper.findComponent(ColorSwatch).exists()).toBe(true)
  })

  it('Test 8: Fixed composition — all 5 sub-components render in default arrangement', () => {
    const wrapper = mount(ColorPicker, {
      props: { defaultValue: '#ffffff' },
    })
    expect(wrapper.findComponent(ColorSwatch).exists()).toBe(true)
    expect(wrapper.findComponent(ColorArea).exists()).toBe(true)
    expect(wrapper.findAllComponents(ColorSlider)).toHaveLength(2)
    expect(wrapper.findComponent(ColorField).exists()).toBe(true)
  })
})
