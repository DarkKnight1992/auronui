<script setup lang="ts">
import { computed } from 'vue'
import { FlexRender, type Row, type RowData } from '@tanstack/vue-table'
import { tableVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useTableInject } from './table.context'

interface Props {
  /**
   * Per-slot class overrides. Each key maps to a named slot in the anatomy;
   * the value is merged with the generated variant classes via `composeClassName`.
   *
   * @example
   * ```vue
   * <TableBody :class-names="{ row: 'bg-blue-50', cell: 'border-blue-200' }" />
   * ```
   *
   * Available slots: `body`, `row`, `cell`.
   */
  classNames?: Partial<{
    body: ClassValue
    row: ClassValue
    cell: ClassValue
  }>
}

defineProps<Props>()

const ctx = useTableInject()
const slotFns = computed(() => tableVariants({ variant: ctx.variant.value }))

function onRowKeydown(row: Row<RowData>, event: KeyboardEvent) {
  // Space on a gridcell toggles row selection
  if (event.key !== ' ') return
  if (ctx.selectionMode.value === 'none') return
  // Do NOT handle Space when target is inside a checkbox element (it handles its own Space)
  const target = event.target as HTMLElement
  if (target.tagName === 'INPUT' || target.closest('[role="checkbox"]')) return
  event.preventDefault()
  if (ctx.selectionMode.value === 'single') {
    // Single-select: clear all, select just this one
    ctx.table.setRowSelection({ [row.id]: true })
  } else {
    row.toggleSelected()
  }
}
</script>

<template>
  <tbody :class="composeClassName(slotFns.body(), props.classNames?.body)">
    <tr
      v-for="(row, rowIndex) in ctx.table.getRowModel().rows"
      :key="row.id"
      role="row"
      :class="composeClassName(slotFns.row(), props.classNames?.row)"
      :aria-rowindex="rowIndex + 1"
      :aria-selected="ctx.selectionMode.value !== 'none' ? row.getIsSelected() : undefined"
      :data-state="row.getIsSelected() ? 'checked' : undefined"
      @click="(e: MouseEvent) => ctx.handleRowClick(rowIndex, e)"
      @keydown="(e: KeyboardEvent) => onRowKeydown(row, e)"
    >
      <td
        v-for="(cell, colIndex) in row.getVisibleCells()"
        :key="cell.id"
        role="gridcell"
        :class="composeClassName(slotFns.cell(), props.classNames?.cell)"
        :data-row-index="rowIndex"
        :data-col-index="colIndex"
        :tabindex="ctx.activeCell.value && ctx.activeCell.value.rowIndex === rowIndex && ctx.activeCell.value.columnIndex === colIndex ? 0 : (ctx.activeCell.value === null && rowIndex === 0 && colIndex === 0 ? 0 : -1)"
      >
        <slot
          name="cell"
          :row="row"
          :cell="cell"
          :column="cell.column"
          :value="cell.getValue()"
        >
          <FlexRender
            :render="cell.column.columnDef.cell"
            :props="cell.getContext()"
          />
        </slot>
      </td>
    </tr>
  </tbody>
</template>
