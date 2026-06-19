<script setup lang="ts">
import { computed } from 'vue'
import { tableVariants } from '@auronui/styles'
import { useTableInject } from './table.context'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'

const props = defineProps<{
  rowIndex?: number
  columnIndex?: number
  /** Per-slot class name overrides merged via `composeClassName`. */
  classNames?: Partial<{
    cell: ClassValue
  }>
}>()

const ctx = useTableInject()
const slotFns = computed(() => tableVariants({ variant: ctx.variant.value }))
</script>

<template>
  <td
    role="gridcell"
    :class="composeClassName(slotFns.cell(), props.classNames?.cell)"
    :data-row-index="rowIndex"
    :data-col-index="columnIndex"
  >
    <slot />
  </td>
</template>
