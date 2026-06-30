import { computed, type Ref, type ComputedRef } from 'vue'
import { parseColor, colorToRgb, colorToHsl, colorToHsb, type Color, type ColorFormat } from 'reka-ui'
import { useColorState } from './useColorState'

export type { ColorFormat }
export type { Color }

export interface UseColorPickerOptions {
  /** Initial color value. Accepts hex strings (#ff0000), rgb/hsl/hsb strings, or a Color object. Defaults to black. */
  defaultValue?: string | Color
  /** Output format for string serialization methods. Defaults to 'hex'. */
  format?: ColorFormat
  /** Fires with the serialized color string whenever the color changes. */
  onChange?: (value: string, color: Color) => void
}

export interface UseColorPickerReturn {
  /** The raw reactive Color object. */
  color: Ref<Color>
  /** Set the color from a string (hex, rgb, hsl, hsb) or a Color object. */
  setColor: (value: string | Color) => void
  /** Computed hue channel value (0–360). */
  hue: ComputedRef<number>
  /** Computed saturation channel value (0–100). */
  saturation: ComputedRef<number>
  /** Computed brightness channel value (0–100). */
  brightness: ComputedRef<number>
  /** Computed alpha channel value (0–100). */
  alpha: ComputedRef<number>
  /** Serialize the current color to a hex string (e.g. '#ff0000'). */
  toHex: () => string
  /** Serialize the current color to an rgb/rgba string. */
  toRgb: () => string
  /** Serialize the current color to an hsl/hsla string. */
  toHsl: () => string
  /** Serialize the current color to an hsb/hsba string. */
  toHsb: () => string
  /**
   * Pass as `@update:model-value` handler on the ColorPicker component.
   * Keeps `color` in sync when the component changes internally.
   */
  onColorChange: (value: string | Color) => void
}

/**
 * High-level composable for controlling the ColorPicker component.
 *
 * Wraps `useColorState` with computed channel accessors and format conversion helpers.
 *
 * @example
 * ```ts
 * const picker = useColorPicker({ defaultValue: '#3b82f6' })
 * console.log(picker.hue.value)        // 217
 * console.log(picker.saturation.value) // 91
 * console.log(picker.brightness.value) // 96
 * ```
 * ```html
 * <ColorPicker v-model="picker.color" />
 * ```
 */
export function useColorPicker(options: UseColorPickerOptions = {}): UseColorPickerReturn {
  const state = useColorState({
    defaultValue: options.defaultValue,
    format: options.format ?? 'hex',
    onChange: options.onChange,
  })

  function setColor(value: string | Color): void {
    const parsed = typeof value === 'string' ? parseColor(value) : value
    state.color.value = parsed
    options.onChange?.(state.toString(), parsed)
  }

  const hue = computed(() => state.getChannel('hue'))
  const saturation = computed(() => state.getChannel('saturation'))
  const brightness = computed(() => state.getChannel('brightness'))
  const alpha = computed(() => state.getChannel('alpha'))

  function toHex(): string {
    return state.toHex()
  }

  function toRgb(): string {
    return colorToRgb(state.color.value).toString()
  }

  function toHsl(): string {
    return colorToHsl(state.color.value).toString()
  }

  function toHsb(): string {
    return colorToHsb(state.color.value).toString()
  }

  function onColorChange(value: string | Color): void {
    setColor(value)
  }

  return {
    color: state.color,
    setColor,
    hue,
    saturation,
    brightness,
    alpha,
    toHex,
    toRgb,
    toHsl,
    toHsb,
    onColorChange,
  }
}
