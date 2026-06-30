import { ref, type Ref } from 'vue'

export type AccordionType = 'single' | 'multiple'
export type AccordionValue = string | string[] | undefined

export interface UseAccordionOptions {
  /** Whether to allow only one item open at a time ('single') or multiple ('multiple'). Defaults to 'single'. */
  type?: AccordionType
  /** Initial expanded item(s). String for single mode, string[] for multiple mode. */
  defaultExpanded?: AccordionValue
  /** In single mode, whether all items can be collapsed. Defaults to false. */
  collapsible?: boolean
}

export interface UseAccordionReturn {
  /** Reactive expanded item(s). String in single mode, string[] in multiple mode. */
  expanded: Ref<AccordionValue>
  /** Whether a given item is currently expanded. */
  isExpanded: (key: string) => boolean
  /** Expand a specific item. */
  expand: (key: string) => void
  /** Collapse a specific item. No-op in single non-collapsible mode. */
  collapse: (key: string) => void
  /** Toggle a specific item open or closed. */
  toggle: (key: string) => void
  /** Collapse all items. Only fully effective in multiple or collapsible-single mode. */
  collapseAll: () => void
  /**
   * Pass as `@update:model-value` handler on the Accordion component.
   * Keeps `expanded` in sync when the component changes state internally.
   */
  onValueChange: (value: AccordionValue) => void
}

/**
 * Manages expanded item state for the Accordion component.
 *
 * @example
 * ```ts
 * const accordion = useAccordion({ type: 'single', collapsible: true })
 * ```
 * ```html
 * <Accordion :type="'single'" :model-value="accordion.expanded" @update:model-value="accordion.onValueChange">
 *   ...
 * </Accordion>
 * ```
 */
export function useAccordion(options: UseAccordionOptions = {}): UseAccordionReturn {
  const type = options.type ?? 'single'
  const collapsible = options.collapsible ?? false

  const expanded = ref<AccordionValue>(
    options.defaultExpanded ?? (type === 'multiple' ? [] : undefined)
  )

  function isExpanded(key: string): boolean {
    if (type === 'multiple') return (expanded.value as string[]).includes(key)
    return expanded.value === key
  }

  function expand(key: string): void {
    if (type === 'multiple') {
      const current = expanded.value as string[]
      if (!current.includes(key)) expanded.value = [...current, key]
    } else {
      expanded.value = key
    }
  }

  function collapse(key: string): void {
    if (type === 'multiple') {
      expanded.value = (expanded.value as string[]).filter(k => k !== key)
    } else if (collapsible && expanded.value === key) {
      expanded.value = undefined
    }
  }

  function toggle(key: string): void {
    if (isExpanded(key)) collapse(key)
    else expand(key)
  }

  function collapseAll(): void {
    if (type === 'multiple') {
      expanded.value = []
    } else if (collapsible) {
      expanded.value = undefined
    }
  }

  function onValueChange(value: AccordionValue): void {
    expanded.value = value
  }

  return {
    expanded,
    isExpanded,
    expand,
    collapse,
    toggle,
    collapseAll,
    onValueChange,
  }
}
