import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { parseColor, colorToHex, colorToString, getChannelValue } from 'reka-ui'
import { useColorState } from '../useColorState'

describe('useColorState', () => {
  it('Test 1: initializes with parsed hex color', () => {
    const { color } = useColorState({ defaultValue: '#ff0000' })
    expect(colorToHex(color.value)).toBe('#ff0000')
  })

  it('Test 2: setChannel hue=120 on red produces green', () => {
    const { color, setChannel } = useColorState({ defaultValue: '#ff0000' })
    setChannel('hue', 120)
    expect(colorToHex(color.value)).toBe('#00ff00')
  })

  it('Test 3: setChannel lightness=0 on red produces black', () => {
    const { color, setChannel } = useColorState({ defaultValue: '#ff0000' })
    setChannel('lightness', 0)
    expect(colorToHex(color.value)).toBe('#000000')
  })

  it('Test 4: setChannel alpha=50 on red produces rgba(255, 0, 0, 0.5)', () => {
    const { color, setChannel } = useColorState({ defaultValue: '#ff0000' })
    setChannel('alpha', 50)
    expect(colorToString(color.value, 'rgb')).toMatch(/rgba\(255,\s*0,\s*0,\s*0\.5\)/)
  })

  it('Test 5: format=hsl makes toString() return hsl string', () => {
    const { toString } = useColorState({ defaultValue: '#ff0000', format: 'hsl' })
    expect(toString()).toMatch(/^hsl\(/)
  })

  it('Test 6: HSL->RGB->HSL round-trip preserves channels within ±1', () => {
    const hslColor = parseColor('hsl(210, 50%, 40%)')
    const { color } = useColorState({ defaultValue: hslColor })
    // Convert to RGB
    const rgbStr = colorToString(color.value, 'rgb')
    const { color: rgbColor } = useColorState({ defaultValue: parseColor(rgbStr) })
    // Back to HSL
    const hslStr = colorToString(rgbColor.value, 'hsl')
    const backColor = parseColor(hslStr)
    // Compare channels within ±1
    const origHue = getChannelValue(hslColor, 'hue')
    const backHue = getChannelValue(backColor, 'hue')
    const origSat = getChannelValue(hslColor, 'saturation')
    const backSat = getChannelValue(backColor, 'saturation')
    const origLight = getChannelValue(hslColor, 'lightness')
    const backLight = getChannelValue(backColor, 'lightness')
    expect(Math.abs(backHue - origHue)).toBeLessThanOrEqual(1)
    expect(Math.abs(backSat - origSat)).toBeLessThanOrEqual(1)
    expect(Math.abs(backLight - origLight)).toBeLessThanOrEqual(1)
  })

  it('Test 7: controlled mode updates when value prop changes', async () => {
    const valueRef = ref<string>('#ff0000')
    const { color } = useColorState({ get value() { return valueRef.value } })
    expect(colorToHex(color.value)).toBe('#ff0000')
    valueRef.value = '#00ff00'
    // Wait for the watcher to fire
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(colorToHex(color.value)).toBe('#00ff00')
  })

  it('Test 8: uncontrolled mode with defaultValue allows mutation', () => {
    const { color, setChannel } = useColorState({ defaultValue: '#00ff00' })
    expect(colorToHex(color.value)).toBe('#00ff00')
    setChannel('hue', 0)
    expect(colorToHex(color.value)).toBe('#ff0000')
  })

  it('Test 10: controlled mode updates when value is passed as an arrow-function getter', async () => {
    // Regression test: components call useColorState({ value: props.modelValue })
    // from their own setup(), i.e. a plain destructured value captured once —
    // never reactive. Consumers (ColorArea, ColorSlider, ColorField,
    // ColorInputGroup, ColorSwatchPicker, ColorPicker) must instead pass
    // `value: () => props.modelValue` for the internal watcher to see updates.
    const valueRef = ref<string>('#ff0000')
    const { color } = useColorState({ value: () => valueRef.value })
    expect(colorToHex(color.value)).toBe('#ff0000')
    valueRef.value = '#00ff00'
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(colorToHex(color.value)).toBe('#00ff00')
  })

  it('Test 9: onChange fires with serialized string on every setChannel call', () => {
    const onChange = vi.fn()
    const { setChannel } = useColorState({ defaultValue: '#ff0000', format: 'hex', onChange })
    setChannel('hue', 120)
    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith('#00ff00', expect.any(Object))
  })

  it('Test 11: skips re-parsing (and does not fire onExternalChange) when the incoming value is an echo of the current color', async () => {
    // Regression test for the real production bug behind "ColorArea dragging
    // changes the hue slider": a parent that round-trips through a string
    // v-model (ColorPickerInput -> ColorPicker's `modelValue` prop) re-emits
    // the same color as a freshly-serialized hex string on every change,
    // including ones that originated from this composable's own setChannel/
    // setChannels calls. Unconditionally reparsing that string discarded the
    // precise in-memory color and reconstructed it from a lossy 8-bit-RGB
    // round-trip, even though nothing about the color had actually changed.
    const valueRef = ref<string>('#3b82f6')
    const onExternalChange = vi.fn()
    const { color } = useColorState({ value: () => valueRef.value, onExternalChange })

    const before = color.value
    valueRef.value = colorToHex(color.value)
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(color.value).toBe(before)
    expect(onExternalChange).not.toHaveBeenCalled()

    // A genuinely different external value must still sync normally.
    valueRef.value = '#ff0000'
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(colorToHex(color.value)).toBe('#ff0000')
    expect(onExternalChange).toHaveBeenCalledOnce()
  })
})
