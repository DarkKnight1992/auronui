<script setup lang="ts">
import { computed } from 'vue'
import { tableVariants } from '@auronui/styles'
import { useTableInject } from './table.context'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'

const props = defineProps<{
  columnIndex?: number
  sortDirection?: 'ascending' | 'descending' | 'none'
  /** Per-slot class overrides */
  classNames?: Partial<{
    column: ClassValue
  }>
}>()

const ctx = useTableInject()
const slotFns = computed(() => tableVariants({ variant: ctx.variant.value }))
</script>

<template>
  <th
    role="columnheader"
    :class="composeClassName(slotFns.column(), props.classNames?.column)"
    :data-col-index="columnIndex"
    :aria-sort="sortDirection"
  >
    <slot />
  </th>
</template>
