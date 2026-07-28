<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, inject, useTemplateRef } from 'vue'
import { TreeItem } from 'reka-ui'
import { treeVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { treeContextKey } from './Tree.context'

const props = withDefaults(defineProps<{
  value: T
  level: number
  class?: ClassValue
  /** Additional class names to apply to individual slots. */
  classNames?: Partial<{
    item: ClassValue
    itemContent: ClassValue
  }>
  /** Render as a different element */
  as?: string
  /** Merge props onto child element */
  asChild?: boolean
}>(), {
  class: undefined,
  classNames: undefined,
})

const emit = defineEmits<{
  select: []
  toggle: []
}>()

const ctx = inject(treeContextKey, null)
const slotFns = computed(() => treeVariants({ size: ctx?.size.value }))
const hasChildren = computed(() => {
  const children = ctx?.getChildren(props.value)
  return Array.isArray(children) ? children.length > 0 : !!children
})

const indentStyle = computed(() => ({
  '--tree-indent': props.level - 1,
}))

// reka-ui's TreeItem fires both select + toggle on click, but on Enter/Space
// it only fires select — keyboard users can never expand/collapse a folder
// node without also reaching for the arrow keys. Mirror click's behavior by
// calling the same exposed handleToggle() reka-ui uses internally.
//
// Note: reka-ui's exposed `handleToggle` is `() => rootContext.onToggle(value)`
// — it mutates reka's internal expanded state directly but does NOT go
// through the component's own `emits('toggle', ev)` call the way the click
// handler does. That means consumers listening on our `@toggle` (e.g. to
// lazy-load a node's children only once it's actually expanded) never heard
// about keyboard-driven expansion, even though the DOM visually updated. Fix:
// explicitly re-emit our own `toggle` event alongside the internal call so
// both interaction methods notify consumers identically.
const treeItemRef = useTemplateRef<{ handleToggle: () => void }>('treeItemRef')

function handleActivateKeydown(ev: KeyboardEvent): void {
  if (ev.target !== ev.currentTarget) return
  if (ev.key !== 'Enter' && ev.key !== ' ') return
  if (!hasChildren.value) return
  treeItemRef.value?.handleToggle()
  emit('toggle')
}
</script>

<template>
  <TreeItem
    ref="treeItemRef"
    :value="value"
    :level="level"
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(slotFns.item(), props.class, props.classNames?.item)"
    data-slot="tree-item"
    @select="$emit('select')"
    @toggle="$emit('toggle')"
    @keydown="handleActivateKeydown"
  >
    <template #default="s: any">
      <div
        :class="composeClassName(slotFns.itemContent(), props.classNames?.itemContent)"
        :style="indentStyle"
        :data-selected="s.isSelected ? '' : undefined"
        :data-expanded="s.isExpanded ? '' : undefined"
      >
        <slot
          :is-expanded="s.isExpanded"
          :is-selected="s.isSelected"
          :is-indeterminate="s.isIndeterminate"
          :has-children="hasChildren"
          :handle-select="s.handleSelect"
          :handle-toggle="s.handleToggle"
          :toggle-class="slotFns.itemToggle()"
          :icon-class="slotFns.itemIcon()"
        />
      </div>
    </template>
  </TreeItem>
</template>
