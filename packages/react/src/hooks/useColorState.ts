import { useCallback, useEffect, useState } from "react";
import { parseColor } from "react-stately";
import type { Color, ColorChannel, ColorFormat } from "react-stately";

export type { Color, ColorChannel, ColorFormat };

export interface UseColorStateProps {
  /** Controlled Color value or string (hex/hsl/rgb). When provided, the internal
   *  state syncs to this value whenever it changes. */
  value?: string | Color;
  /** Uncontrolled initial value. Only applied when `value` is not provided. */
  defaultValue?: string | Color;
  /** Output format for toString() and the onChange callback. Defaults to 'hex'. */
  format?: ColorFormat;
  /** Fires with the serialized color string whenever the color changes. */
  onChange?: (value: string, color: Color) => void;
}

export interface UseColorStateReturn {
  /** Current Color value. */
  color: Color;
  /** Replace the entire color (string or Color object) and fire onChange. */
  setColor: (value: string | Color) => void;
  /** Read a channel value from the current color. */
  getChannel: (channel: ColorChannel) => number;
  /** Set a single channel value and fire onChange. */
  setChannel: (channel: ColorChannel, value: number) => void;
  /** Set multiple channel values in one batched update and fire onChange once. */
  setChannels: (values: Array<{ channel: ColorChannel; value: number }>) => void;
  /** Serialize the current color to a string. Uses `format` prop by default. */
  toString: (format?: ColorFormat) => string;
  /** Get the current color as a hex string (e.g. '#ff0000'). */
  toHex: () => string;
}

function toColor(value: string | Color): Color {
  return typeof value === "string" ? parseColor(value) : value;
}

/**
 * Maps a color channel to the color-space format that supports it, for
 * channels that aren't available on every format (e.g. `hue` only exists
 * once a color has been converted to `hsl`/`hsla`/`hsb`/`hsba`).
 */
function formatForChannel(channel: ColorChannel): ColorFormat {
  switch (channel) {
    case "hue":
    case "saturation":
    case "lightness":
      return "hsl";
    case "brightness":
      return "hsb";
    default:
      return "rgb";
  }
}

function readChannel(color: Color, channel: ColorChannel): number {
  try {
    return color.getChannelValue(channel);
  } catch {
    return color.toFormat(formatForChannel(channel)).getChannelValue(channel);
  }
}

function writeChannel(color: Color, channel: ColorChannel, value: number): Color {
  try {
    color.getChannelValue(channel);
    return color.withChannelValue(channel, value);
  } catch {
    return color.toFormat(formatForChannel(channel)).withChannelValue(channel, value);
  }
}

export function useColorState(props: UseColorStateProps = {}): UseColorStateReturn {
  const { value, defaultValue, format = "hex", onChange } = props;

  const [color, setColor] = useState<Color>(() =>
    value !== undefined
      ? toColor(value)
      : defaultValue !== undefined
        ? toColor(defaultValue)
        : parseColor("#000000"),
  );

  // Controlled mode: sync when `value` changes externally.
  useEffect(() => {
    if (value !== undefined) {
      setColor(toColor(value));
    }
  }, [value]);

  const getChannel = useCallback((channel: ColorChannel): number => readChannel(color, channel), [color]);

  const emit = useCallback(
    (next: Color): void => {
      onChange?.(next.toString(format), next);
    },
    [format, onChange],
  );

  const setColorValue = useCallback(
    (next: string | Color): void => {
      const parsed = toColor(next);
      setColor(parsed);
      emit(parsed);
    },
    [emit],
  );

  const setChannel = useCallback(
    (channel: ColorChannel, channelValue: number): void => {
      setColor((prev) => {
        const next = writeChannel(prev, channel, channelValue);
        emit(next);
        return next;
      });
    },
    [emit],
  );

  const setChannels = useCallback(
    (values: Array<{ channel: ColorChannel; value: number }>): void => {
      setColor((prev) => {
        const next = values.reduce((acc, { channel, value: v }) => writeChannel(acc, channel, v), prev);
        emit(next);
        return next;
      });
    },
    [emit],
  );

  const toStringFormatted = useCallback(
    (fmt?: ColorFormat): string => color.toString(fmt ?? format),
    [color, format],
  );

  const toHex = useCallback((): string => color.toString("hex"), [color]);

  return { color, setColor: setColorValue, getChannel, setChannel, setChannels, toString: toStringFormatted, toHex };
}
