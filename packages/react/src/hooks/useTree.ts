import { useCallback, useState } from "react";

export type TreeValue = string | string[] | undefined;

export interface UseTreeOptions {
  /** Enable multi-selection. Defaults to false. */
  multiple?: boolean;
  /** Initial selected node key(s). */
  defaultSelected?: TreeValue;
  /** Initial expanded node keys. */
  defaultExpanded?: string[];
}

export interface UseTreeReturn {
  /** Currently selected node key(s). String in single mode, string[] in multiple mode. */
  selected: TreeValue;
  /** Currently expanded node keys. */
  expanded: string[];
  /** Whether a given node is currently selected. */
  isSelected: (key: string) => boolean;
  /** Select a node. In single mode, replaces the current selection. */
  select: (key: string) => void;
  /** Deselect a node. */
  deselect: (key: string) => void;
  /** Toggle a node's selection state. */
  toggle: (key: string) => void;
  /** Whether a given node is currently expanded. */
  isExpanded: (key: string) => boolean;
  /** Expand a node. */
  expand: (key: string) => void;
  /** Collapse a node. */
  collapse: (key: string) => void;
  /** Toggle a node's expanded state. */
  toggleExpand: (key: string) => void;
  /** Expand all provided node keys. */
  expandAll: (keys: string[]) => void;
  /** Collapse all expanded nodes. */
  collapseAll: () => void;
  /**
   * Pass as the `onSelectionChange` handler on the Tree component.
   * Keeps `selected` in sync when the component changes selection internally.
   */
  onSelectionChange: (value: TreeValue) => void;
  /**
   * Pass as the `onExpandedChange` handler on the Tree component.
   * Keeps `expanded` in sync when the component changes expanded state internally.
   */
  onExpandedChange: (keys: string[]) => void;
}

/**
 * Manages selection and expansion state for the Tree component.
 *
 * @example
 * ```tsx
 * const tree = useTree({ multiple: false, defaultExpanded: ['root'] })
 * ```
 * ```tsx
 * <Tree
 *   selected={tree.selected}
 *   expanded={tree.expanded}
 *   onSelectionChange={tree.onSelectionChange}
 *   onExpandedChange={tree.onExpandedChange}
 * >
 *   ...
 * </Tree>
 * ```
 */
export function useTree(options: UseTreeOptions = {}): UseTreeReturn {
  const multiple = options.multiple ?? false;

  const [selected, setSelected] = useState<TreeValue>(
    options.defaultSelected ?? (multiple ? [] : undefined),
  );
  const [expanded, setExpanded] = useState<string[]>(
    options.defaultExpanded ? [...options.defaultExpanded] : [],
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

  const isExpanded = useCallback((key: string): boolean => expanded.includes(key), [expanded]);

  const expand = useCallback((key: string): void => {
    setExpanded((prev) => (prev.includes(key) ? prev : [...prev, key]));
  }, []);

  const collapse = useCallback((key: string): void => {
    setExpanded((prev) => prev.filter((k) => k !== key));
  }, []);

  const toggleExpand = useCallback(
    (key: string): void => {
      if (isExpanded(key)) collapse(key);
      else expand(key);
    },
    [isExpanded, collapse, expand],
  );

  const expandAll = useCallback((keys: string[]): void => {
    setExpanded((prev) => [...new Set([...prev, ...keys])]);
  }, []);

  const collapseAll = useCallback((): void => {
    setExpanded([]);
  }, []);

  const onSelectionChange = useCallback((value: TreeValue): void => {
    setSelected(value);
  }, []);

  const onExpandedChange = useCallback((keys: string[]): void => {
    setExpanded(keys);
  }, []);

  return {
    selected,
    expanded,
    isSelected,
    select,
    deselect,
    toggle,
    isExpanded,
    expand,
    collapse,
    toggleExpand,
    expandAll,
    collapseAll,
    onSelectionChange,
    onExpandedChange,
  };
}
