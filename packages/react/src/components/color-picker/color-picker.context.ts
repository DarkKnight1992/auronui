import { createContext, useContext } from "react";
import type { Color, ColorChannel, ColorFormat } from "../../hooks";

/**
 * Optional context shared by the color-picker family (ColorArea, ColorSlider,
 * ColorSwatch, ColorSwatchPicker, ColorField, ColorInputGroup). When a
 * component is rendered inside <ColorPicker>, it reads/writes color state
 * through this context instead of managing its own local useColorState —
 * mirroring the Vue package's `inject(ColorPickerContextKey, null)` pattern.
 *
 * Deliberately a plain React context (not `createStrictContext`, which
 * throws when no provider is present) — every consumer of this context must
 * work standalone (outside <ColorPicker>) by falling back to local state.
 */
export interface ColorPickerContextValue {
  /** Current color. */
  color: Color;
  /** Set a single channel value. */
  setChannel: (channel: ColorChannel, value: number) => void;
  /** Set multiple channel values in one batched update. */
  setChannels: (values: Array<{ channel: ColorChannel; value: number }>) => void;
  /** Output format for string serialization. */
  format: ColorFormat;
}

export const ColorPickerContext = createContext<ColorPickerContextValue | null>(null);

export function useColorPickerContext(): ColorPickerContextValue | null {
  return useContext(ColorPickerContext);
}
