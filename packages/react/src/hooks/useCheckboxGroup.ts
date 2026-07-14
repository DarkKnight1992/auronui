import { useCallback, useMemo, useState } from "react";

export interface UseCheckboxGroupOptions {
  /** Initial checked values. */
  defaultValues?: string[];
  /**
   * Full set of option keys in the group.
   * Required for `isIndeterminate` and `isAllChecked` to be accurate.
   */
  options?: string[];
}

export interface UseCheckboxGroupReturn {
  /** Currently checked values. */
  values: string[];
  /** Whether a given value is currently checked. */
  isChecked: (value: string) => boolean;
  /** Toggle a value — checks it if unchecked, unchecks if checked. */
  toggle: (value: string) => void;
  /** Check all provided values (merges with existing). */
  checkAll: (keys: string[]) => void;
  /** Uncheck all values. */
  uncheckAll: () => void;
  /** Set the checked values directly. */
  setValues: (values: string[]) => void;
  /**
   * True when some — but not all — options are checked.
   * Requires `options` to be provided in the options object.
   */
  isIndeterminate: boolean;
  /**
   * True when every option is checked.
   * Requires `options` to be provided in the options object.
   */
  isAllChecked: boolean;
  /**
   * Pass as the `onValueChange` handler on the CheckboxGroup component.
   * Keeps `values` in sync when the component changes state internally.
   */
  onValueChange: (values: string[]) => void;
}

/**
 * Manages checked state for a CheckboxGroup.
 *
 * @example
 * ```tsx
 * const group = useCheckboxGroup({
 *   options: ['apple', 'banana', 'cherry'],
 *   defaultValues: ['apple'],
 * })
 * ```
 * ```tsx
 * <CheckboxGroup value={group.values} onValueChange={group.onValueChange}>
 *   <Checkbox value="apple">Apple</Checkbox>
 *   <Checkbox value="banana">Banana</Checkbox>
 *   <Checkbox value="cherry">Cherry</Checkbox>
 * </CheckboxGroup>
 * ```
 */
export function useCheckboxGroup(options: UseCheckboxGroupOptions = {}): UseCheckboxGroupReturn {
  const { options: optionKeys } = options;
  const [values, setValuesState] = useState<string[]>(
    options.defaultValues ? [...options.defaultValues] : [],
  );

  const isChecked = useCallback((value: string): boolean => values.includes(value), [values]);

  const toggle = useCallback((value: string): void => {
    setValuesState((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }, []);

  const checkAll = useCallback((keys: string[]): void => {
    setValuesState((prev) => [...new Set([...prev, ...keys])]);
  }, []);

  const uncheckAll = useCallback((): void => {
    setValuesState([]);
  }, []);

  const setValues = useCallback((next: string[]): void => {
    setValuesState([...next]);
  }, []);

  const onValueChange = useCallback((next: string[]): void => {
    setValuesState([...next]);
  }, []);

  const isIndeterminate = useMemo(() => {
    if (!optionKeys || optionKeys.length === 0) return false;
    const count = values.filter((v) => optionKeys.includes(v)).length;
    return count > 0 && count < optionKeys.length;
  }, [optionKeys, values]);

  const isAllChecked = useMemo(() => {
    if (!optionKeys || optionKeys.length === 0) return false;
    return optionKeys.every((k) => values.includes(k));
  }, [optionKeys, values]);

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
  };
}
