import { useCallback, useState } from "react";

export type SliderValue = number | number[];

export interface UseSliderOptions {
  /** Initial value. Use a number for a single thumb, number[] for range mode. Defaults to `min`. */
  defaultValue?: SliderValue;
  /** Minimum allowed value. Defaults to 0. */
  min?: number;
  /** Maximum allowed value. Defaults to 100. */
  max?: number;
  /** Step increment. Defaults to 1. */
  step?: number;
}

export interface UseSliderReturn {
  /** Current slider value. Number in single mode, number[] in range mode. */
  value: SliderValue;
  /** Minimum value. */
  min: number;
  /** Maximum value. */
  max: number;
  /** Step increment. */
  step: number;
  /** Set the slider value directly. */
  setValue: (value: SliderValue) => void;
  /** Clamp a value (or array of values) to [min, max]. */
  clamp: (value: SliderValue) => SliderValue;
  /**
   * Pass as the `onValueChange` handler on the Slider component.
   * Keeps `value` in sync when the component changes internally.
   */
  onValueChange: (value: SliderValue) => void;
}

/**
 * Manages value state for the Slider component.
 *
 * @example
 * ```tsx
 * // Single thumb
 * const slider = useSlider({ defaultValue: 40, min: 0, max: 100 })
 *
 * // Range (two thumbs)
 * const range = useSlider({ defaultValue: [20, 80], min: 0, max: 100 })
 * ```
 * ```tsx
 * <Slider value={slider.value} min={slider.min} max={slider.max} onValueChange={slider.onValueChange} />
 * ```
 */
export function useSlider(options: UseSliderOptions = {}): UseSliderReturn {
  const min = options.min ?? 0;
  const max = options.max ?? 100;
  const step = options.step ?? 1;

  const [value, setValueState] = useState<SliderValue>(options.defaultValue ?? min);

  const clamp = useCallback(
    (v: SliderValue): SliderValue => {
      if (Array.isArray(v)) return v.map((n) => Math.min(Math.max(n, min), max));
      return Math.min(Math.max(v, min), max);
    },
    [min, max],
  );

  const setValue = useCallback((v: SliderValue): void => setValueState(v), []);
  const onValueChange = useCallback((v: SliderValue): void => setValueState(v), []);

  return { value, min, max, step, setValue, clamp, onValueChange };
}
