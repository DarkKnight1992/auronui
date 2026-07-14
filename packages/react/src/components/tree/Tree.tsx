import { useCallback, useMemo, useState, type ReactNode } from "react";
import { treeVariants, type TreeVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { TreeProvider } from "./tree.context";

export type TreeSelected = string | string[] | undefined;

export interface FlattenedTreeItem<T> {
  /** Stable key for React's list rendering + selection/expansion lookups. */
  key: string;
  /** The original data item. */
  item: T;
  /** 1-based nesting depth, mirroring Vue's `level` prop on TreeItem. */
  level: number;
  hasChildren: boolean;
}

export interface TreeSlotProps<T> {
  flattenItems: FlattenedTreeItem<T>[];
}

export interface TreeOwnProps<T> {
  items?: T[];
  getKey: (item: T) => string;
  getChildren?: (item: T) => T[] | undefined;
  /** Controlled selection. String in single mode, string[] in multiple mode. */
  selected?: TreeSelected;
  defaultSelected?: TreeSelected;
  onSelectionChange?: (value: TreeSelected) => void;
  /** Controlled expanded node keys. */
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (keys: string[]) => void;
  multiple?: boolean;
  selectionBehavior?: "toggle" | "replace";
  size?: TreeVariants["size"];
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  className?: ClassValue;
  classNames?: Partial<{
    root: ClassValue;
  }>;
  "aria-label"?: string;
  children: (slotProps: TreeSlotProps<T>) => ReactNode;
}

function isKeySelected(selected: TreeSelected, key: string): boolean {
  if (Array.isArray(selected)) return selected.includes(key);
  return selected === key;
}

/**
 * Tree — hierarchical, expand/collapse, single- or multi-select list.
 *
 * Unlike the Vue port (which delegates to reka-ui's `TreeRoot`), this is a
 * from-scratch implementation since React has no reka-ui equivalent —
 * selection/expansion state and keyboard semantics are owned directly here
 * and exposed to consumers via a render-prop (`children({ flattenItems })`),
 * mirroring the Vue `<Tree>` default scoped-slot pattern so `<TreeItem>` can
 * be composed the same way in both frameworks.
 */
export function Tree<T extends object>({
  items = [],
  getKey,
  getChildren = (item: T) => (item as { children?: T[] }).children,
  selected: selectedProp,
  defaultSelected,
  onSelectionChange,
  expanded: expandedProp,
  defaultExpanded = [],
  onExpandedChange,
  multiple = false,
  selectionBehavior = "toggle",
  size = "md",
  isDisabled,
  disabled,
  className,
  classNames,
  children,
  ...rest
}: TreeOwnProps<T>) {
  const effectiveDisabled = isDisabled ?? disabled ?? false;

  const [internalSelected, setInternalSelected] = useState<TreeSelected>(
    defaultSelected ?? (multiple ? [] : undefined),
  );
  const [internalExpanded, setInternalExpanded] = useState<string[]>(defaultExpanded);

  const currentSelected = selectedProp !== undefined ? selectedProp : internalSelected;
  const currentExpanded = expandedProp !== undefined ? expandedProp : internalExpanded;

  const isSelected = useCallback(
    (key: string) => isKeySelected(currentSelected, key),
    [currentSelected],
  );

  const isExpanded = useCallback((key: string) => currentExpanded.includes(key), [currentExpanded]);

  const select = useCallback(
    (key: string) => {
      let next: TreeSelected;
      if (multiple) {
        const current = Array.isArray(currentSelected) ? currentSelected : [];
        const already = current.includes(key);
        if (already && selectionBehavior === "toggle") {
          next = current.filter((k) => k !== key);
        } else if (!already) {
          next = [...current, key];
        } else {
          next = current;
        }
      } else {
        const already = currentSelected === key;
        next = already && selectionBehavior === "toggle" ? undefined : key;
      }
      setInternalSelected(next);
      onSelectionChange?.(next);
    },
    [multiple, currentSelected, selectionBehavior, onSelectionChange, setInternalSelected],
  );

  const toggleExpand = useCallback(
    (key: string) => {
      const next = currentExpanded.includes(key)
        ? currentExpanded.filter((k) => k !== key)
        : [...currentExpanded, key];
      setInternalExpanded(next);
      onExpandedChange?.(next);
    },
    [currentExpanded, onExpandedChange, setInternalExpanded],
  );

  const flattenItems = useMemo(() => {
    const result: FlattenedTreeItem<T>[] = [];
    const walk = (nodes: T[], level: number) => {
      for (const item of nodes) {
        const key = getKey(item);
        const kids = getChildren(item);
        const hasChildren = Array.isArray(kids) ? kids.length > 0 : !!kids;
        result.push({ key, item, level, hasChildren });
        if (hasChildren && currentExpanded.includes(key)) {
          walk(kids as T[], level + 1);
        }
      }
    };
    walk(items, 1);
    return result;
  }, [items, getKey, getChildren, currentExpanded]);

  const slotFns = useMemo(() => treeVariants({ size }), [size]);

  return (
    <TreeProvider
      value={{
        size,
        isDisabled: effectiveDisabled,
        getChildren: getChildren as (item: unknown) => unknown[] | undefined,
        isSelected,
        isExpanded,
        select,
        toggleExpand,
      }}
    >
      <div
        role="tree"
        aria-multiselectable={multiple || undefined}
        data-slot="tree"
        data-disabled={effectiveDisabled || undefined}
        className={composeClassName(slotFns.root(), className, classNames?.root)}
        {...rest}
      >
        {children({ flattenItems })}
      </div>
    </TreeProvider>
  );
}
