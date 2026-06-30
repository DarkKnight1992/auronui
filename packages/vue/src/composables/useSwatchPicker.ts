import { ref, computed, readonly, type Ref, type ComputedRef } from 'vue'

export interface UseSwatchPickerOptions {
  /** Initial selected color as a hex string (e.g. '#ff0000'). */
  defaultValue?: string
  /** Fires when a swatch is selected with the new hex color. */
  onChange?: (hex: string) => void
}

export interface UseSwatchPickerReturn {
  /** The currently selected color as a hex string. */
  selectedColor: Readonly<Ref<string>>
  /** True when a color is selected (non-empty). */
  hasSelection: ComputedRef<boolean>
  /** Select a color by hex string. */
  setColor: (hex: string) => void
  /** Clear the selection. */
  clearSelection: () => void
  /** Returns true if the given hex string is the currently selected color. */
  isSelected: (hex: string) => boolean
  /** Pass as `@update:model-value` on the ColorSwatchPicker component. */
  onColorChange: (hex: string) => void
}

export function useSwatchPicker(options: UseSwatchPickerOptions = {}): UseSwatchPickerReturn {
  const _selectedColor = ref(options.defaultValue ?? '')

  const hasSelection = computed(() => _selectedColor.value !== '')

  function setColor(hex: string): void {
    _selectedColor.value = hex
    options.onChange?.(hex)
  }

  function clearSelection(): void {
    _selectedColor.value = ''
  }

  function isSelected(hex: string): boolean {
    return _selectedColor.value === hex
  }

  function onColorChange(hex: string): void {
    setColor(hex)
  }

  return {
    selectedColor: readonly(_selectedColor),
    hasSelection,
    setColor,
    clearSelection,
    isSelected,
    onColorChange,
  }
}
