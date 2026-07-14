import { useCallback, useState } from "react";

export interface UseSwatchPickerOptions {
  /** Initial selected color as a hex string (e.g. '#ff0000'). */
  defaultValue?: string;
  /** Fires when a swatch is selected with the new hex color. */
  onChange?: (hex: string) => void;
}

export interface UseSwatchPickerReturn {
  /** The currently selected color as a hex string. */
  selectedColor: string;
  /** True when a color is selected (non-empty). */
  hasSelection: boolean;
  /** Select a color by hex string. */
  setColor: (hex: string) => void;
  /** Clear the selection. */
  clearSelection: () => void;
  /** Returns true if the given hex string is the currently selected color. */
  isSelected: (hex: string) => boolean;
  /** Pass as the `onValueChange` handler on the ColorSwatchPicker component. */
  onColorChange: (hex: string) => void;
}

export function useSwatchPicker(options: UseSwatchPickerOptions = {}): UseSwatchPickerReturn {
  const [selectedColor, setSelectedColor] = useState(options.defaultValue ?? "");

  const hasSelection = selectedColor !== "";

  const setColor = useCallback(
    (hex: string): void => {
      setSelectedColor(hex);
      options.onChange?.(hex);
    },
    [options],
  );

  const clearSelection = useCallback((): void => setSelectedColor(""), []);

  const isSelected = useCallback((hex: string): boolean => selectedColor === hex, [selectedColor]);

  const onColorChange = useCallback(
    (hex: string): void => {
      setColor(hex);
    },
    [setColor],
  );

  return { selectedColor, hasSelection, setColor, clearSelection, isSelected, onColorChange };
}
