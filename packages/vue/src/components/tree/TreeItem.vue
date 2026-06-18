<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, inject } from 'vue'
import { TreeItem } from 'reka-ui'
import { treeVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { treeContextKey } from './Tree.context'

const props = withDefaults(defineProps<{
  value: T
  level: number
  class?: string
  /** Additional class names to apply to individual slots. */
  classNames?: Partial<{
    item: string
    itemContent: string
  }>
}>(), {
  class: undefined,
  classNames: undefined,
})

defineEmits<{
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
</script>

<template>
  <TreeItem
    :value="value"
    :level="level"
    :class="composeClassName(slotFns.item(), props.class, props.classNames?.item)"
    data-slot="tree-item"
    @select="$emit('select')"
    @toggle="$emit('toggle')"
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
