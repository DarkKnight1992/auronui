import { ref, watch, toValue, type Ref, type MaybeRefOrGetter } from 'vue'
import {
  parseColor,
  colorToHex,
  colorToString,
  getChannelValue,
  setChannelValue,
  setChannelValues,
  type Color,
  type ColorChannel,
  type ColorFormat,
} from 'reka-ui'

export type { ColorFormat }

export interface UseColorStateProps {
  /** Controlled Color value or string (hex/hsl/rgb). When provided, the internal
   *  ref syncs to this value whenever it changes. Pass a getter (`() => props.modelValue`)
   *  rather than a bare value if the caller's prop can change after this composable is
   *  called — a bare value is captured once and never re-read. */
  value?: MaybeRefOrGetter<string | Color | undefined>
  /** Uncontrolled initial value. Only applied when `value` is not provided. */
  defaultValue?: MaybeRefOrGetter<string | Color | undefined>
  /** Output format for toString() and the onChange callback. Defaults to 'hex'. */
  format?: MaybeRefOrGetter<ColorFormat | undefined>
  /** Fires with the serialized color string whenever the color changes. */
  onChange?: (value: string, color: Color) => void
  /** Fires only when `value` changes to a genuinely different color from an
   *  external source (not an echo of this composable's own last emit round-
   *  tripping back through a parent's v-model). Lets callers distinguish a
   *  real external change (e.g. the app setting a new controlled value) from
   *  a redundant re-sync, without guessing from timing. */
  onExternalChange?: (color: Color) => void
}

export interface UseColorStateReturn {
  /** Reactive Color ref. */
  color: Ref<Color>
  /** Read a channel value from the current color. */
  getChannel: (channel: ColorChannel) => number
  /** Set a single channel value and fire onChange. */
  setChannel: (channel: ColorChannel, value: number) => void
  /** Set multiple channel values in one batched update and fire onChange once.
   *  Accepts the Array<{channel, value}> form required by Reka UI's setChannelValues. */
  setChannels: (values: Array<{ channel: ColorChannel; value: number }>) => void
  /** Serialize the current color to a string. Uses `format` prop by default. */
  toString: (format?: ColorFormat) => string
  /** Get the current color as a hex string (e.g. '#ff0000'). */
  toHex: () => string
}

function toColor(value: string | Color): Color {
  if (typeof value === 'string') {
    return parseColor(value)
  }
  return value
}

export function useColorState(props: UseColorStateProps = {}): UseColorStateReturn {
  const initialValue = toValue(props.value)
  const initialDefault = toValue(props.defaultValue)
  const initial = initialValue !== undefined
    ? toColor(initialValue)
    : initialDefault !== undefined
      ? toColor(initialDefault)
      : parseColor('#000000')

  const color = ref<Color>(initial)

  // Controlled mode: sync when props.value changes externally.
  //
  // Skips the sync when the incoming value is just an echo of this ref's own
  // last emit — e.g. a parent component that round-trips through a string
  // v-model (ColorPickerInput -> ColorPicker's `modelValue` prop) re-emits
  // the same color as a freshly-serialized hex string on every change,
  // including changes that originated from THIS composable's own setChannel/
  // setChannels calls. Unconditionally reparsing that string would discard
  // this ref's precise internal representation (e.g. full-precision HSB from
  // a ColorArea drag) and reconstruct it from a lossy 8-bit-RGB round-trip —
  // even though nothing about the color actually changed. Comparing
  // serialized hex first and skipping the reassignment when it's unchanged
  // keeps the existing, precise value intact.
  watch(
    () => toValue(props.value),
    (next) => {
      if (next === undefined) return
      const nextColor = toColor(next)
      if (colorToHex(nextColor) === colorToHex(color.value)) return
      color.value = nextColor
      props.onExternalChange?.(nextColor)
    },
  )

  function getChannel(channel: ColorChannel): number {
    return getChannelValue(color.value, channel)
  }

  function _emit(): void {
    const serialized = colorToString(color.value, toValue(props.format) ?? 'hex')
    props.onChange?.(serialized, color.value)
  }

  function setChannel(channel: ColorChannel, value: number): void {
    color.value = setChannelValue(color.value, channel, value)
    _emit()
  }

  function setChannels(values: Array<{ channel: ColorChannel; value: number }>): void {
    color.value = setChannelValues(color.value, values)
    _emit()
  }

  function toString(format?: ColorFormat): string {
    return colorToString(color.value, format ?? toValue(props.format) ?? 'hex')
  }

  function toHex(): string {
    return colorToHex(color.value)
  }

  return {
    color,
    getChannel,
    setChannel,
    setChannels,
    toString,
    toHex,
  }
}
