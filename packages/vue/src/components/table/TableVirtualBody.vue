<script setup lang="ts" generic="TData extends RowData = RowData">
import { computed } from 'vue'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { FlexRender, type Row, type RowData } from '@tanstack/vue-table'
import { tableVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useTableInject, type TableContext } from './table.context'

const props = defineProps<{
  scrollElement: HTMLElement | null
  estimatedRowHeight?: number
  overscan?: number
  /**
   * Per-slot class overrides. Each key maps to a named slot in the anatomy;
   * the value is merged with the generated variant classes via `composeClassName`.
   */
  classNames?: Partial<{
    body: ClassValue
    row: ClassValue
    cell: ClassValue
  }>
}>()

const ctx = useTableInject() as TableContext<TData>
const slotFns = computed(() => tableVariants({ variant: ctx.variant.value }))

const rows = computed(() => ctx.table.getRowModel().rows)

const virtualizer = useVirtualizer({
  get count() {
    return rows.value.length
  },
  getScrollElement: () => props.scrollElement,
  estimateSize: () => props.estimatedRowHeight ?? 44,
  overscan: props.overscan ?? 8,
})

const virtualItems = computed(() => virtualizer.value.getVirtualItems())
const totalSize = computed(() => virtualizer.value.getTotalSize())

// Spacer heights above and below the rendered slice.
// This is the standard TanStack Virtual table pattern: pad via empty <tr> rows
// so the <tbody> stays inside <table> (valid HTML) and inherits column widths.
const paddingTop = computed(() => {
  const items = virtualItems.value
  return items.length > 0 ? items[0].start : 0
})
const paddingBottom = computed(() => {
  const items = virtualItems.value
  if (items.length === 0) return 0
  return totalSize.value - items[items.length - 1].end
})

const columnCount = computed(() => ctx.table.getVisibleLeafColumns().length)

function onRowKeydown(row: Row<TData>, event: KeyboardEvent) {
  if (event.key !== ' ') return
  if (ctx.selectionMode.value === 'none') return
  const target = event.target as HTMLElement
  if (target.tagName === 'INPUT' || target.closest('[role="checkbox"]')) return
  event.preventDefault()
  if (ctx.selectionMode.value === 'single') {
    ctx.table.setRowSelection({ [row.id]: true })
  } else {
    row.toggleSelected()
  }
}

defineExpose({
  scrollToIndex: (index: number) =>
    virtualizer.value.scrollToIndex(index, { align: 'auto' }),
})
</script>

<template>
  <!--
    Uses <tbody> + spacer <tr> rows so virtualized rows stay inside valid
    <table> structure and inherit column widths from <thead>.
    paddingTop/paddingBottom spacers replace the absolute-positioning approach.
  -->
  <tbody :class="composeClassName(slotFns.body(), props.classNames?.body)">
    <tr
      v-if="paddingTop > 0"
      aria-hidden="true"
    >
      <td
        :colspan="columnCount"
        :style="{ height: `${paddingTop}px`, padding: 0, border: 'none' }"
      />
    </tr>
    <tr
      v-for="vItem in virtualItems"
      :key="rows[vItem.index].id"
      role="row"
      :class="composeClassName(slotFns.row(), props.classNames?.row)"
      :aria-rowindex="vItem.index + 1"
      :aria-selected="
        ctx.selectionMode.value !== 'none'
          ? rows[vItem.index].getIsSelected()
          : undefined
      "
      :data-state="rows[vItem.index].getIsSelected() ? 'checked' : undefined"
      @click="(e: MouseEvent) => ctx.handleRowClick(vItem.index, e)"
      @keydown="(e: KeyboardEvent) => onRowKeydown(rows[vItem.index] as Row<TData>, e)"
    >
      <td
        v-for="(cell, colIndex) in rows[vItem.index].getVisibleCells()"
        :key="cell.id"
        role="gridcell"
        :class="composeClassName(slotFns.cell(), props.classNames?.cell)"
        :data-row-index="vItem.index"
        :data-col-index="colIndex"
        :tabindex="
          ctx.activeCell.value !== null &&
            ctx.activeCell.value.rowIndex === vItem.index &&
            ctx.activeCell.value.columnIndex === colIndex
            ? 0
            : ctx.activeCell.value === null && vItem.index === 0 && colIndex === 0
              ? 0
              : -1
        "
      >
        <FlexRender
          :render="cell.column.columnDef.cell"
          :props="cell.getContext()"
        />
      </td>
    </tr>
    <tr
      v-if="paddingBottom > 0"
      aria-hidden="true"
    >
      <td
        :colspan="columnCount"
        :style="{ height: `${paddingBottom}px`, padding: 0, border: 'none' }"
      />
    </tr>
  </tbody>
</template>
