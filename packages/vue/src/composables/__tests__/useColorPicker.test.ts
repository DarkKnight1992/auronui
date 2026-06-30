import { describe, it, expect, vi } from 'vitest'
import { useColorPicker } from '../useColorPicker'

describe('useColorPicker', () => {
  it('defaults to black', () => {
    const { toHex } = useColorPicker()
    expect(toHex()).toBe('#000000')
  })

  it('respects defaultValue as hex string', () => {
    const { toHex } = useColorPicker({ defaultValue: '#ff0000' })
    expect(toHex()).toBe('#ff0000')
  })

  it('setColor from hex string updates the color', () => {
    const { toHex, setColor } = useColorPicker()
    setColor('#00ff00')
    expect(toHex()).toBe('#00ff00')
  })

  it('hue is a computed number', () => {
    const { hue } = useColorPicker({ defaultValue: '#ff0000' })
    expect(typeof hue.value).toBe('number')
    expect(hue.value).toBeGreaterThanOrEqual(0)
    expect(hue.value).toBeLessThanOrEqual(360)
  })

  it('saturation is a computed number in 0–100', () => {
    const { saturation } = useColorPicker({ defaultValue: '#ff0000' })
    expect(saturation.value).toBeGreaterThanOrEqual(0)
    expect(saturation.value).toBeLessThanOrEqual(100)
  })

  it('brightness is a computed number in 0–100', () => {
    const { brightness } = useColorPicker({ defaultValue: '#ff0000' })
    expect(brightness.value).toBeGreaterThanOrEqual(0)
    expect(brightness.value).toBeLessThanOrEqual(100)
  })

  it('alpha is a computed number in 0–100', () => {
    const { alpha } = useColorPicker({ defaultValue: '#ff0000' })
    expect(alpha.value).toBeGreaterThanOrEqual(0)
    expect(alpha.value).toBeLessThanOrEqual(100)
  })

  it('toRgb returns an rgb string', () => {
    const { toRgb } = useColorPicker({ defaultValue: '#ff0000' })
    expect(toRgb()).toMatch(/^rgb/)
  })

  it('toHsl returns an hsl string', () => {
    const { toHsl } = useColorPicker({ defaultValue: '#ff0000' })
    expect(toHsl()).toMatch(/^hsl/)
  })

  it('toHsb returns an hsb string', () => {
    const { toHsb } = useColorPicker({ defaultValue: '#ff0000' })
    expect(toHsb()).toMatch(/^hsb/)
  })

  it('onChange fires when setColor is called', () => {
    const onChange = vi.fn()
    const { setColor } = useColorPicker({ onChange })
    setColor('#0000ff')
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('onColorChange updates the color', () => {
    const { toHex, onColorChange } = useColorPicker()
    onColorChange('#ffffff')
    expect(toHex()).toBe('#ffffff')
  })

  it('color ref is the raw Color object', () => {
    const { color } = useColorPicker({ defaultValue: '#ff0000' })
    expect(color.value).toBeDefined()
    expect(typeof color.value).toBe('object')
  })

  it('hue updates reactively after setColor', () => {
    const { hue, setColor } = useColorPicker({ defaultValue: '#ff0000' })
    const redHue = hue.value
    setColor('#0000ff')
    expect(hue.value).not.toBe(redHue)
  })
})
