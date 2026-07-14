import { useCallback, useState } from "react";

export type ListBoxValue = string | string[] | undefined;

export interface UseListBoxOptions {
  /** Enable multi-selection. Defaults to false. */
  multiple?: boolean;
  /** Initial selected value(s). */
  defaultSelected?: ListBoxValue;
}

export interface UseListBoxReturn {
  /** Currently selected value(s). String in single mode, string[] in multiple mode. */
  selected: ListBoxValue;
  /** Whether a given key is currently selected. */
  isSelected: (key: string) => boolean;
  /** Select an item. In single mode, replaces the current selection. */
  select: (key: string) => void;
  /** Deselect an item. */
  deselect: (key: string) => void;
  /** Toggle an item's selection state. */
  toggle: (key: string) => void;
  /** Select all provided keys. Only effective in multiple mode. */
  selectAll: (keys: string[]) => void;
  /** Clear all selections. */
  deselectAll: () => void;
  /**
   * Pass as the `onSelectionChange` handler on the ListBox component.
   * Keeps `selected` in sync when the component changes selection internally.
   */
  onSelectionChange: (value: ListBoxValue) => void;
}

/**
 * Manages selection state for the ListBox component.
 *
 * @example
 * ```tsx
 * const listBox = useListBox({ multiple: true, defaultSelected: ['apple'] })
 * ```
 * ```tsx
 * <ListBox value={listBox.selected} onSelectionChange={listBox.onSelectionChange}>
 *   <ListBoxItem value="apple">Apple</ListBoxItem>
 *   <ListBoxItem value="banana">Banana</ListBoxItem>
 * </ListBox>
 * ```
 */
export function useListBox(options: UseListBoxOptions = {}): UseListBoxReturn {
  const multiple = options.multiple ?? false;

  const [selected, setSelected] = useState<ListBoxValue>(
    options.defaultSelected ?? (multiple ? [] : undefined),
  );

  const isSelected = useCallback(
    (key: string): boolean => {
      if (Array.isArray(selected)) return selected.includes(key);
      return selected === key;
    },
    [selected],
  );

  const select = useCallback(
    (key: string): void => {
      if (multiple) {
        setSelected((prev) => {
          const current = (prev as string[]) ?? [];
          return current.includes(key) ? current : [...current, key];
        });
      } else {
        setSelected(key);
      }
    },
    [multiple],
  );

  const deselect = useCallback(
    (key: string): void => {
      if (multiple) {
        setSelected((prev) => ((prev as string[]) ?? []).filter((k) => k !== key));
      } else {
        setSelected((prev) => (prev === key ? undefined : prev));
      }
    },
    [multiple],
  );

  const toggle = useCallback(
    (key: string): void => {
      if (isSelected(key)) deselect(key);
      else select(key);
    },
    [isSelected, deselect, select],
  );

  const selectAll = useCallback(
    (keys: string[]): void => {
      if (multiple) setSelected([...new Set(keys)]);
    },
    [multiple],
  );

  const deselectAll = useCallback((): void => {
    setSelected(multiple ? [] : undefined);
  }, [multiple]);

  const onSelectionChange = useCallback((value: ListBoxValue): void => {
    setSelected(value);
  }, []);

  return { selected, isSelected, select, deselect, toggle, selectAll, deselectAll, onSelectionChange };
}
