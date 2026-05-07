<script setup lang="ts">
import { computed } from 'vue'
import { tableVariants } from '@auronui/styles'
import { useTableInject } from './table.context'

defineProps<{
  rowIndex?: number
  columnIndex?: number
}>()

const ctx = useTableInject()
const slotFns = computed(() => tableVariants({ variant: ctx.variant.value }))
</script>

<template>
  <td
    role="gridcell"
    :class="slotFns.cell()"
    :data-row-index="rowIndex"
    :data-col-index="columnIndex"
  >
    <slot />
  </td>
</template>
