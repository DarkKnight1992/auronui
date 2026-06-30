import { ref, type Ref } from 'vue'

export type TreeValue = string | string[] | undefined

export interface UseTreeOptions {
  /** Enable multi-selection. Defaults to false. */
  multiple?: boolean
  /** Initial selected node key(s). */
  defaultSelected?: TreeValue
  /** Initial expanded node keys. */
  defaultExpanded?: string[]
}

export interface UseTreeReturn {
  /** Reactive selected node key(s). String in single mode, string[] in multiple mode. */
  selected: Ref<TreeValue>
  /** Reactive array of expanded node keys. */
  expanded: Ref<string[]>
  /** Whether a given node is currently selected. */
  isSelected: (key: string) => boolean
  /** Select a node. In single mode, replaces the current selection. */
  select: (key: string) => void
  /** Deselect a node. */
  deselect: (key: string) => void
  /** Toggle a node's selection state. */
  toggle: (key: string) => void
  /** Whether a given node is currently expanded. */
  isExpanded: (key: string) => boolean
  /** Expand a node. */
  expand: (key: string) => void
  /** Collapse a node. */
  collapse: (key: string) => void
  /** Toggle a node's expanded state. */
  toggleExpand: (key: string) => void
  /** Expand all provided node keys. */
  expandAll: (keys: string[]) => void
  /** Collapse all expanded nodes. */
  collapseAll: () => void
  /**
   * Pass as `@update:model-value` on the Tree component.
   * Keeps `selected` in sync when the component changes selection internally.
   */
  onSelectionChange: (value: TreeValue) => void
  /**
   * Pass as `@update:expanded` on the Tree component.
   * Keeps `expanded` in sync when the component changes expanded state internally.
   */
  onExpandedChange: (keys: string[]) => void
}

/**
 * Manages selection and expansion state for the Tree component.
 *
 * @example
 * ```ts
 * const tree = useTree({ multiple: false, defaultExpanded: ['root'] })
 * ```
 * ```html
 * <Tree
 *   :model-value="tree.selected"
 *   :expanded="tree.expanded"
 *   @update:model-value="tree.onSelectionChange"
 *   @update:expanded="tree.onExpandedChange"
 * >
 *   ...
 * </Tree>
 * ```
 */
export function useTree(options: UseTreeOptions = {}): UseTreeReturn {
  const multiple = options.multiple ?? false

  const selected = ref<TreeValue>(
    options.defaultSelected ?? (multiple ? [] : undefined)
  )
  const expanded = ref<string[]>(options.defaultExpanded ? [...options.defaultExpanded] : [])

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

  function isExpanded(key: string): boolean {
    return expanded.value.includes(key)
  }

  function expand(key: string): void {
    if (!isExpanded(key)) expanded.value = [...expanded.value, key]
  }

  function collapse(key: string): void {
    expanded.value = expanded.value.filter(k => k !== key)
  }

  function toggleExpand(key: string): void {
    if (isExpanded(key)) collapse(key)
    else expand(key)
  }

  function expandAll(keys: string[]): void {
    expanded.value = [...new Set([...expanded.value, ...keys])]
  }

  function collapseAll(): void {
    expanded.value = []
  }

  function onSelectionChange(value: TreeValue): void {
    selected.value = value
  }

  function onExpandedChange(keys: string[]): void {
    expanded.value = keys
  }

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
  }
}
