import { ref, type Ref } from 'vue'

export interface UseRadioGroupOptions {
  /** Initial selected value. */
  defaultValue?: string
}

export interface UseRadioGroupReturn {
  /** Reactive selected radio value. */
  value: Ref<string | undefined>
  /** Set the selected value. */
  setValue: (value: string) => void
  /** Clear the selection. */
  clear: () => void
  /**
   * Pass as `@update:model-value` handler on the RadioGroup component.
   * Keeps `value` in sync when the component changes selection internally.
   */
  onValueChange: (value: string) => void
}

/**
 * Manages selection state for the RadioGroup component.
 *
 * @example
 * ```ts
 * const radio = useRadioGroup({ defaultValue: 'option-a' })
 * ```
 * ```html
 * <RadioGroup :model-value="radio.value" @update:model-value="radio.onValueChange">
 *   <Radio value="option-a">Option A</Radio>
 *   <Radio value="option-b">Option B</Radio>
 * </RadioGroup>
 * ```
 */
export function useRadioGroup(options: UseRadioGroupOptions = {}): UseRadioGroupReturn {
  const value = ref<string | undefined>(options.defaultValue)

  function setValue(v: string): void {
    value.value = v
  }

  function clear(): void {
    value.value = undefined
  }

  function onValueChange(v: string): void {
    value.value = v
  }

  return {
    value,
    setValue,
    clear,
    onValueChange,
  }
}
