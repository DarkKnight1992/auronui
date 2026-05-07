import { ref, watch, type Ref } from 'vue'
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
   *  ref syncs to this value whenever it changes. */
  value?: string | Color
  /** Uncontrolled initial value. Only applied when `value` is not provided. */
  defaultValue?: string | Color
  /** Output format for toString() and the onChange callback. Defaults to 'hex'. */
  format?: ColorFormat
  /** Fires with the serialized color string whenever the color changes. */
  onChange?: (value: string, color: Color) => void
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
  const initial = props.value !== undefined
    ? toColor(props.value)
    : props.defaultValue !== undefined
      ? toColor(props.defaultValue)
      : parseColor('#000000')

  const color = ref<Color>(initial)

  // Controlled mode: sync when props.value changes externally.
  watch(
    () => props.value,
    (next) => {
      if (next !== undefined) {
        color.value = toColor(next)
      }
    },
  )

  function getChannel(channel: ColorChannel): number {
    return getChannelValue(color.value, channel)
  }

  function _emit(): void {
    const serialized = colorToString(color.value, props.format ?? 'hex')
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
    return colorToString(color.value, format ?? props.format ?? 'hex')
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
