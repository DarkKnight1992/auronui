import { ref, type Ref } from 'vue'

export type ListBoxValue = string | string[] | undefined

export interface UseListBoxOptions {
  /** Enable multi-selection. Defaults to false. */
  multiple?: boolean
  /** Initial selected value(s). */
  defaultSelected?: ListBoxValue
}

export interface UseListBoxReturn {
  /** Reactive selected value(s). String in single mode, string[] in multiple mode. */
  selected: Ref<ListBoxValue>
  /** Whether a given key is currently selected. */
  isSelected: (key: string) => boolean
  /** Select an item. In single mode, replaces the current selection. */
  select: (key: string) => void
  /** Deselect an item. */
  deselect: (key: string) => void
  /** Toggle an item's selection state. */
  toggle: (key: string) => void
  /** Select all provided keys. Only effective in multiple mode. */
  selectAll: (keys: string[]) => void
  /** Clear all selections. */
  deselectAll: () => void
  /**
   * Pass as `@update:model-value` handler on the ListBox component.
   * Keeps `selected` in sync when the component changes selection internally.
   */
  onSelectionChange: (value: ListBoxValue) => void
}

/**
 * Manages selection state for the ListBox component.
 *
 * @example
 * ```ts
 * const listBox = useListBox({ multiple: true, defaultSelected: ['apple'] })
 * ```
 * ```html
 * <ListBox :model-value="listBox.selected" @update:model-value="listBox.onSelectionChange">
 *   <ListBoxItem value="apple">Apple</ListBoxItem>
 *   <ListBoxItem value="banana">Banana</ListBoxItem>
 * </ListBox>
 * ```
 */
export function useListBox(options: UseListBoxOptions = {}): UseListBoxReturn {
  const multiple = options.multiple ?? false

  const selected = ref<ListBoxValue>(
    options.defaultSelected ?? (multiple ? [] : undefined)
  )

  function isSelected(key: string): boolean {
    if (Array.isArray(selected.value)) return selected.value.includes(key)
    return selected.value === key
  }

  function select(key: string): void {
    if (multiple) {
      const current = (selected.value as string[]) ?? []
      if (!current.includes(key)) selected.value = [...current, key]
    } else {
      selected.value = key
    }
  }

  function deselect(key: string): void {
    if (multiple) {
      selected.value = ((selected.value as string[]) ?? []).filter(k => k !== key)
    } else if (selected.value === key) {
      selected.value = undefined
    }
  }

  function toggle(key: string): void {
    if (isSelected(key)) deselect(key)
    else select(key)
  }

  function selectAll(keys: string[]): void {
    if (multiple) selected.value = [...new Set(keys)]
  }

  function deselectAll(): void {
    selected.value = multiple ? [] : undefined
  }

  function onSelectionChange(value: ListBoxValue): void {
    selected.value = value
  }

  return {
    selected,
    isSelected,
    select,
    deselect,
    toggle,
    selectAll,
    deselectAll,
    onSelectionChange,
  }
}
