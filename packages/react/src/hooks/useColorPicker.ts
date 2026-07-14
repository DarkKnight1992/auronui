import { useCallback } from "react";
import type { Color, ColorFormat } from "react-stately";
import { useColorState } from "./useColorState";

export type { Color, ColorFormat };

export interface UseColorPickerOptions {
  /** Initial color value. Accepts hex strings (#ff0000), rgb/hsl/hsb strings, or a Color object. Defaults to black. */
  defaultValue?: string | Color;
  /** Output format for string serialization methods. Defaults to 'hex'. */
  format?: ColorFormat;
  /** Fires with the serialized color string whenever the color changes. */
  onChange?: (value: string, color: Color) => void;
}

export interface UseColorPickerReturn {
  /** The raw Color object. */
  color: Color;
  /** Set the color from a string (hex, rgb, hsl, hsb) or a Color object. */
  setColor: (value: string | Color) => void;
  /** Hue channel value (0–360). */
  hue: number;
  /** Saturation channel value (0–100). */
  saturation: number;
  /** Brightness channel value (0–100). */
  brightness: number;
  /** Alpha channel value (0–100). */
  alpha: number;
  /** Serialize the current color to a hex string (e.g. '#ff0000'). */
  toHex: () => string;
  /** Serialize the current color to an rgb/rgba string. */
  toRgb: () => string;
  /** Serialize the current color to an hsl/hsla string. */
  toHsl: () => string;
  /** Serialize the current color to an hsb/hsba string. */
  toHsb: () => string;
  /**
   * Pass as the `onValueChange` handler on the ColorPicker component.
   * Keeps `color` in sync when the component changes internally.
   */
  onColorChange: (value: string | Color) => void;
}

/**
 * High-level hook for controlling the ColorPicker component.
 *
 * Wraps `useColorState` with channel accessors and format conversion helpers.
 *
 * @example
 * ```tsx
 * const picker = useColorPicker({ defaultValue: '#3b82f6' })
 * console.log(picker.hue)        // 217
 * console.log(picker.saturation) // 91
 * console.log(picker.brightness) // 96
 * ```
 * ```tsx
 * <ColorPicker value={picker.color} onValueChange={picker.onColorChange} />
 * ```
 */
export function useColorPicker(options: UseColorPickerOptions = {}): UseColorPickerReturn {
  const state = useColorState({
    defaultValue: options.defaultValue,
    format: options.format ?? "hex",
    onChange: options.onChange,
  });

  const setColor = state.setColor;

  const hue = state.getChannel("hue");
  const saturation = state.getChannel("saturation");
  const brightness = state.getChannel("brightness");
  const alpha = state.getChannel("alpha");

  const toHex = useCallback((): string => state.toHex(), [state]);
  const toRgb = useCallback((): string => state.toString("rgb"), [state]);
  const toHsl = useCallback((): string => state.toString("hsl"), [state]);
  const toHsb = useCallback((): string => state.toString("hsb"), [state]);

  const onColorChange = useCallback(
    (value: string | Color): void => {
      setColor(value);
    },
    [setColor],
  );

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
  };
}
