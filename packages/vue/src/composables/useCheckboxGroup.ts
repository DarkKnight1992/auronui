import { ref, computed, type Ref, type ComputedRef } from 'vue'

export interface UseCheckboxGroupOptions {
  /** Initial checked values. */
  defaultValues?: string[]
  /**
   * Full set of option keys in the group.
   * Required for `isIndeterminate` and `isAllChecked` to be accurate.
   */
  options?: string[]
}

export interface UseCheckboxGroupReturn {
  /** Reactive array of currently checked values. */
  values: Ref<string[]>
  /** Whether a given value is currently checked. */
  isChecked: (value: string) => boolean
  /** Toggle a value — checks it if unchecked, unchecks if checked. */
  toggle: (value: string) => void
  /** Check all provided values (merges with existing). */
  checkAll: (keys: string[]) => void
  /** Uncheck all values. */
  uncheckAll: () => void
  /** Set the checked values directly. */
  setValues: (values: string[]) => void
  /**
   * True when some — but not all — options are checked.
   * Requires `options` to be provided in the options object.
   */
  isIndeterminate: ComputedRef<boolean>
  /**
   * True when every option is checked.
   * Requires `options` to be provided in the options object.
   */
  isAllChecked: ComputedRef<boolean>
  /**
   * Pass as `@update:model-value` handler on the CheckboxGroup component.
   * Keeps `values` in sync when the component changes state internally.
   */
  onValueChange: (values: string[]) => void
}

/**
 * Manages checked state for a CheckboxGroup.
 *
 * @example
 * ```ts
 * const group = useCheckboxGroup({
 *   options: ['apple', 'banana', 'cherry'],
 *   defaultValues: ['apple'],
 * })
 * ```
 * ```html
 * <CheckboxGroup :model-value="group.values" @update:model-value="group.onValueChange">
 *   <Checkbox value="apple">Apple</Checkbox>
 *   <Checkbox value="banana">Banana</Checkbox>
 *   <Checkbox value="cherry">Cherry</Checkbox>
 * </CheckboxGroup>
 * ```
 */
export function useCheckboxGroup(options: UseCheckboxGroupOptions = {}): UseCheckboxGroupReturn {
  const values = ref<string[]>(options.defaultValues ? [...options.defaultValues] : [])

  function isChecked(value: string): boolean {
    return values.value.includes(value)
  }

  function toggle(value: string): void {
    if (isChecked(value)) {
      values.value = values.value.filter(v => v !== value)
    } else {
      values.value = [...values.value, value]
    }
  }

  function checkAll(keys: string[]): void {
    values.value = [...new Set([...values.value, ...keys])]
  }

  function uncheckAll(): void {
    values.value = []
  }

  function setValues(next: string[]): void {
    values.value = [...next]
  }

  function onValueChange(next: string[]): void {
    values.value = [...next]
  }

  const isIndeterminate = computed<boolean>(() => {
    if (!options.options || options.options.length === 0) return false
    const count = values.value.filter(v => options.options!.includes(v)).length
    return count > 0 && count < options.options.length
  })

  const isAllChecked = computed<boolean>(() => {
    if (!options.options || options.options.length === 0) return false
    return options.options.every(k => values.value.includes(k))
  })

  return {
    values,
    isChecked,
    toggle,
    checkAll,
    uncheckAll,
    setValues,
    isIndeterminate,
    isAllChecked,
    onValueChange,
  }
}
