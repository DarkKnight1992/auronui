import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ColorPickerInput from '../ColorPickerInput.vue'

// Polyfill ResizeObserver for jsdom (Reka UI's Popover uses it internally)
beforeEach(() => {
  ;(globalThis as any).ResizeObserver = function ResizeObserver(
    _callback: ResizeObserverCallback
  ) {
    return {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }
  }
})

describe('ColorPickerInput', () => {
  const wrappers: ReturnType<typeof mount>[] = []

  afterEach(() => {
    wrappers.forEach(w => w.unmount())
    wrappers.length = 0
    document.body.innerHTML = ''
  })

  it('Test 1: renders a hex input and a swatch trigger button', async () => {
    const wrapper = mount(ColorPickerInput, {
      props: { defaultValue: '#ff0000' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('Test 2: swatch trigger button opens the popover (content portals into the DOM when open)', async () => {
    // jsdom cannot open Reka UI popovers via real pointer events — use the
    // controlled `open` prop, same approach DatePicker's own tests use.
    const wrapper = mount(ColorPickerInput, {
      props: { defaultValue: '#ff0000', open: true },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const dialogOrPanel = document.body.querySelector('.color-picker')
    expect(dialogOrPanel).not.toBeNull()
  })

  it('Test 3: dropdown is not in the DOM when closed', async () => {
    const wrapper = mount(ColorPickerInput, {
      props: { defaultValue: '#ff0000', open: false },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const panel = document.body.querySelector('.color-picker')
    expect(panel).toBeNull()
  })

  it('Test 4: typing a new hex value in the trigger field updates the swatch color', async () => {
    const wrapper = mount(ColorPickerInput, {
      props: { defaultValue: '#ff0000' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const input = wrapper.find('input')
    await input.setValue('#00ff00')
    await input.trigger('blur')
    await new Promise(r => setTimeout(r, 50))
    const swatch = wrapper.find('[role="img"]')
    expect(swatch.exists()).toBe(true)
    // aria-label falls back to the current hex value when no explicit label is given
    expect(swatch.attributes('aria-label')?.toLowerCase()).toBe('#00ff00')
  })

  it('Test 5: dropdown ColorPicker and trigger field share the same value (open=true)', async () => {
    const wrapper = mount(ColorPickerInput, {
      props: { defaultValue: '#ff0000', open: true },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    // The trigger field's own input and the dropdown ColorPicker's hex field
    // input should both reflect the same starting value.
    const inputs = document.body.querySelectorAll('input')
    expect(inputs.length).toBeGreaterThanOrEqual(2)
    const values = Array.from(inputs).map(el => (el as HTMLInputElement).value.toLowerCase())
    expect(new Set(values).size).toBe(1)
  })

  it('Test 6: isDisabled disables the trigger field input and the swatch button', async () => {
    const wrapper = mount(ColorPickerInput, {
      props: { defaultValue: '#ff0000', isDisabled: true },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    expect(wrapper.find('input').attributes('disabled')).not.toBeUndefined()
    expect(wrapper.find('button').attributes('disabled')).not.toBeUndefined()
  })

  it('Test 7: controlled open emits update:open', async () => {
    const wrapper = mount(ColorPickerInput, {
      props: { defaultValue: '#ff0000', open: true },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const dialogOrPanel = document.body.querySelector('.color-picker')
    expect(dialogOrPanel).not.toBeNull()
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
    document.body.querySelector('[role="dialog"]')?.dispatchEvent(escapeEvent)
    await nextTick()
    const emitted = wrapper.emitted('update:open')
    expect(emitted).not.toBeUndefined()
  })

  it('Test 8: label prop renders on the trigger field', async () => {
    const wrapper = mount(ColorPickerInput, {
      props: { defaultValue: '#ff0000', label: 'Accent color' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    expect(wrapper.text()).toContain('Accent color')
  })

  it('Test 10: clicking the swatch trigger opens the popover in uncontrolled mode (no `open` prop passed)', async () => {
    // Regression test: `props.open` (a Boolean-typed prop) is silently
    // defaulted to `false` by Vue when absent unless an explicit
    // `default: undefined` is set — without that, `effectiveOpen`'s
    // `props.open ?? isOpen.value` fallback never reaches `isOpen`, and
    // clicking the trigger silently does nothing.
    const wrapper = mount(ColorPickerInput, {
      props: { defaultValue: '#ff0000' },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    expect(document.body.querySelector('.color-picker')).toBeNull()
    await wrapper.find('button').trigger('click')
    await nextTick()
    expect(document.body.querySelector('.color-picker')).not.toBeNull()
  })

  it('Test 11: editing the dropdown ColorPicker syncs the trigger field\'s displayed value', async () => {
    // Regression test: useColorState's internal `value` watcher used to watch
    // a plain destructured property (`{ value: props.modelValue }`) captured
    // once at call time — never reactive — so ColorField's own local state
    // (used when there's no ColorPickerContext, exactly this component's
    // wiring) never picked up changes coming back from the dropdown.
    const wrapper = mount(ColorPickerInput, {
      props: { defaultValue: '#ff0000', open: true },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()
    const inputs = document.body.querySelectorAll('input')
    const dropdownInput = inputs[1] as HTMLInputElement
    dropdownInput.value = '#00ff00'
    dropdownInput.dispatchEvent(new Event('input', { bubbles: true }))
    dropdownInput.dispatchEvent(new Event('blur', { bubbles: true }))
    await nextTick()
    await new Promise(r => setTimeout(r, 20))
    const triggerInput = document.body.querySelectorAll('input')[0] as HTMLInputElement
    expect(triggerInput.value.toLowerCase()).toBe('#00ff00')
  })

  it('Test 9: component mounts without errors', async () => {
    let mountError: Error | null = null
    try {
      const wrapper = mount(ColorPickerInput, {
        props: { label: 'SSR test' },
        attachTo: document.body,
      })
      wrappers.push(wrapper)
      await nextTick()
      expect(wrapper.html()).toContain('color-picker-input')
    } catch (e: any) {
      mountError = e
    }
    expect(mountError).toBeNull()
  })

  it('Test 12: ColorArea dragging through white/black never changes the hue slider, even through the real ColorPickerInput <-> ColorPicker v-model round-trip', async () => {
    // End-to-end regression test for the actual production bug: ColorArea
    // writes a color change into ColorPicker's internal state, which emits a
    // serialized hex string up to ColorPickerInput; ColorPickerInput re-emits
    // that string back down as a new `modelValue` prop to ColorPicker. Before
    // the fix, ColorPicker's useColorState unconditionally reparsed any
    // incoming modelValue — even this redundant echo of its own last emit —
    // discarding the precise in-memory color and reconstructing it from a
    // lossy hex round-trip. A unit test against ColorArea alone (with a bare
    // mock context) never exercises this loop, so it can't catch this: only
    // a real ColorPickerInput mount does.
    const wrapper = mount(ColorPickerInput, {
      props: { defaultValue: '#3b82f6', open: true },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    const colorAreaRoot = wrapper.findComponent({ name: 'ColorAreaRoot' })
    expect(colorAreaRoot.exists()).toBe(true)

    // Drag to the white corner (saturation 0), then back to a fully
    // saturated corner — the exact sequence that reproduced the bug live.
    const { parseColor } = await import('reka-ui')
    await colorAreaRoot.vm.$emit('update:color', parseColor('hsb(0, 0%, 100%)'))
    await nextTick()
    await colorAreaRoot.vm.$emit('update:color', parseColor('hsb(0, 100%, 100%)'))
    await nextTick()

    const triggerInput = document.body.querySelectorAll('input')[0] as HTMLInputElement
    // Must stay in the blue family (hue ~217°), never jump to red (#ff0000-ish).
    expect(triggerInput.value.toLowerCase()).not.toMatch(/^#ff[01][01]/)
  })

  it('Test 13: typing a new hex value in the dropdown, then dragging ColorArea, does not revert to the previous hue', async () => {
    // Regression test: ColorField's hex input writes via
    // pickerCtx.setChannels([red, green, blue, alpha]) — no explicit hue
    // channel. ColorPicker's rememberedHue must resync from that write (the
    // color IS a fully new one), not silently stay pointed at the color that
    // was current before the hex edit. Otherwise the next ColorArea drag
    // reasserts the stale (pre-edit) hue and visibly corrupts the color back
    // to it, even though the hex edit had already taken effect correctly.
    const wrapper = mount(ColorPickerInput, {
      props: { defaultValue: '#3b82f6', open: true }, // starts blue
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    await nextTick()

    // Type a gold/sand hex value into the dropdown's own "Hex color" field.
    const dropdownInput = document.body.querySelectorAll('input')[1] as HTMLInputElement
    dropdownInput.value = '#c9a84c'
    dropdownInput.dispatchEvent(new Event('input', { bubbles: true }))
    dropdownInput.dispatchEvent(new Event('blur', { bubbles: true }))
    await nextTick()
    await new Promise(r => setTimeout(r, 20))

    const triggerInput = document.body.querySelectorAll('input')[0] as HTMLInputElement
    expect(triggerInput.value.toLowerCase()).toBe('#c9a84c')

    // Now drag within ColorArea (saturation/brightness only — must never
    // reintroduce the old blue hue).
    const { parseColor, setChannelValues, getChannelValue } = await import('reka-ui')
    const gold = parseColor('#c9a84c')
    const dragged = setChannelValues(gold, [
      { channel: 'saturation', value: getChannelValue(gold, 'saturation') - 5 },
      { channel: 'brightness', value: getChannelValue(gold, 'brightness') },
    ])
    const colorAreaRoot = wrapper.findComponent({ name: 'ColorAreaRoot' })
    await colorAreaRoot.vm.$emit('update:color', dragged)
    await nextTick()

    // Must stay in the gold family (hue ~40°), never revert toward the
    // original blue (hue ~217°).
    const finalHue = Math.round(getChannelValue(parseColor(triggerInput.value), 'hue'))
    expect(finalHue).toBeGreaterThan(20)
    expect(finalHue).toBeLessThan(70)
  })
})
