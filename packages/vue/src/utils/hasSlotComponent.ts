import { Fragment, type VNode } from 'vue'

/**
 * Returns true if any vnode in `nodes` has a `type` referentially equal to one
 * of `components`, recursively flattening `Fragment` (v-for / template) children.
 *
 * Dropdown form controls (Select, Autocomplete, ComboBox) use this to detect
 * whether the consumer supplied explicit compound chrome (e.g. SelectTrigger /
 * SelectContent) versus terse `*Item` children or an `items` prop. When chrome
 * is present the control passes the slot through unchanged; otherwise it renders
 * the trigger/value/content internally.
 */
export function hasSlotComponent(
  nodes: VNode[] | undefined,
  components: unknown[],
): boolean {
  if (!nodes) return false
  for (const node of nodes) {
    if (components.includes(node.type)) return true
    if (node.type === Fragment && Array.isArray(node.children)) {
      if (hasSlotComponent(node.children as VNode[], components)) return true
    }
  }
  return false
}
