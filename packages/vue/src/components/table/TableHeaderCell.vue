<script setup lang="ts">
import { computed } from 'vue'
import { tableVariants } from '@auronui/styles'
import { useTableInject } from './table.context'

defineProps<{
  columnIndex?: number
  sortDirection?: 'ascending' | 'descending' | 'none'
}>()

const ctx = useTableInject()
const slotFns = computed(() => tableVariants({ variant: ctx.variant.value }))
</script>

<template>
  <th
    role="columnheader"
    :class="slotFns.column()"
    :data-col-index="columnIndex"
    :aria-sort="sortDirection"
  >
    <slot />
  </th>
</template>
