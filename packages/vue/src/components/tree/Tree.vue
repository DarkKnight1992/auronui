<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, provide } from 'vue'
import { TreeRoot } from 'reka-ui'
import { treeVariants, type TreeVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { treeContextKey } from './Tree.context'

const props = withDefaults(defineProps<{
  items?: T[]
  modelValue?: T | T[]
  defaultValue?: T | T[]
  expanded?: string[]
  defaultExpanded?: string[]
  getKey: (item: T) => string
  getChildren?: (item: T) => T[] | undefined
  multiple?: boolean
  selectionBehavior?: 'toggle' | 'replace'
  propagateSelect?: boolean
  size?: TreeVariants['size']
  class?: ClassValue
  /** Per-slot class overrides */
  classNames?: Partial<{
    root: ClassValue
  }>
  /** Text direction */
  dir?: 'ltr' | 'rtl'
  /** Whether the entire tree is disabled */
  disabled?: boolean
  /** Whether selection bubbles up to parent nodes */
  bubbleSelect?: boolean
  /** Render as a different element */
  as?: string
  /** Merge props onto child element */
  asChild?: boolean
}>(), {
  items: () => [],
  modelValue: undefined,
  defaultValue: undefined,
  expanded: undefined,
  defaultExpanded: () => [],
  getChildren: (item: T) => item.children as T[] | undefined,
  multiple: false,
  selectionBehavior: 'toggle',
  propagateSelect: false,
  size: 'md',
  class: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: T | T[]]
  'update:expanded': [value: string[]]
}>()

const slotFns = computed(() => treeVariants({ size: props.size }))

provide(treeContextKey, {
  size: computed(() => props.size ?? 'md'),
  getChildren: (item: unknown) => props.getChildren?.(item as T),
})
</script>

<template>
  <TreeRoot
    :items="items"
    :get-key="getKey"
    :get-children="getChildren"
    :model-value="(modelValue as any)"
    :default-value="(defaultValue as any)"
    :expanded="expanded"
    :default-expanded="defaultExpanded"
    :multiple="multiple"
    :selection-behavior="selectionBehavior"
    :propagate-select="propagateSelect"
    :dir="props.dir"
    :disabled="props.disabled"
    :bubble-select="props.bubbleSelect"
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(slotFns.root(), props.class, props.classNames?.root)"
    data-slot="tree"
    @update:model-value="(v: any) => emit('update:modelValue', v)"
    @update:expanded="(v: string[]) => emit('update:expanded', v)"
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </TreeRoot>
</template>
