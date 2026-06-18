<script setup lang="ts">
// Note: Vue 3.5 generic SFCs do not propagate generic type parameters across
// component boundaries when used via JSX/mount() in tests. We use ColumnDef<any, any>
// for props to avoid TS2322 errors while keeping internal TanStack reactivity correct.
import { computed, ref, watch, useTemplateRef, h } from 'vue'
import {
  useVueTable,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
  type Table as TableInstance,
  type RowData,
  type Row,
} from '@tanstack/vue-table'
import { tableVariants, type TableVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { useTableProvide } from './table.context'
import { useTableKeyboardNav } from './useTableKeyboardNav'
import TableHeader from './TableHeader.vue'
import TableBody from './TableBody.vue'
import TableVirtualBody from './TableVirtualBody.vue'
import TableFooter from './TableFooter.vue'
import TableCheckboxCell from './TableCheckboxCell.vue'

type SelectionMode = 'none' | 'single' | 'multiple'

const props = withDefaults(
  defineProps<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: ColumnDef<any, any>[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[]
    variant?: TableVariants['variant']
    ariaLabel?: string
    /** Row selection mode. 'single' = radio-style; 'multiple' = checkbox + shift+click; 'none' = disabled */
    selection?: SelectionMode
    /** Controlled row selection state (Record<rowId, boolean>). Use v-model:rowSelection */
    rowSelection?: RowSelectionState
    /**
     * Opt-in row virtualization via @tanstack/vue-virtual.
     * - false (default): all rows render in a standard <tbody>
     * - true: always render via TableVirtualBody (only visible rows in DOM)
     * - number N: auto-enable virtualization when data.length > N
     */
    virtualRows?: boolean | number
    /** Estimated row height in px used by the virtualizer (default: 44) */
    estimatedRowHeight?: number
    /** Extra rows to render outside the visible viewport (default: 8) */
    virtualizerOverscan?: number
    /** Per-slot CSS class overrides */
    classNames?: Partial<{
      base: string
      scrollContainer: string
    }>
  }>(),
  {
    variant: 'primary',
    ariaLabel: undefined,
    selection: 'none',
    rowSelection: undefined,
    virtualRows: false,
    estimatedRowHeight: 44,
    virtualizerOverscan: 8,
  }
)

const emit = defineEmits<{
  'update:rowSelection': [value: RowSelectionState]
}>()

// --- Sorting state ----------------------------------------------------
const sorting = ref<SortingState>([])

// --- Row selection state (controlled/uncontrolled) -------------------
const internalRowSelection = ref<RowSelectionState>(props.rowSelection ?? {})
watch(
  () => props.rowSelection,
  (next) => {
    if (next !== undefined) internalRowSelection.value = next
  },
  { deep: true }
)

function updateRowSelection(
  updater: RowSelectionState | ((old: RowSelectionState) => RowSelectionState)
) {
  const next = typeof updater === 'function' ? updater(internalRowSelection.value) : updater
  internalRowSelection.value = next
  emit('update:rowSelection', next)
}

// --- Selection column injected at position 0 when enabled -----------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectionColumn: ColumnDef<any, any> = {
  id: '__select__',
  size: 44,
  enableSorting: false,
  header: ({ table: t }) =>
    props.selection === 'multiple'
      ? h(TableCheckboxCell, { table: t as unknown as TableInstance<RowData> })
      : '',
  cell: ({ row: r }) => h(TableCheckboxCell, { row: r as unknown as Row<RowData> }),
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const effectiveColumns = computed<ColumnDef<any, any>[]>(() => {
  if (props.selection === 'none') return props.columns
  return [selectionColumn, ...props.columns]
})

// --- useVueTable instance ---------------------------------------------
// Use getters so @tanstack/vue-table tracks prop reactivity.
const table = useVueTable({
  get data() {
    return props.data
  },
  get columns() {
    return effectiveColumns.value as ColumnDef<RowData, unknown>[]
  },
  state: {
    get sorting() {
      return sorting.value
    },
    get rowSelection() {
      return internalRowSelection.value
    },
  },
  onSortingChange: (updater) => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
  },
  onRowSelectionChange: updateRowSelection,
  get enableRowSelection() {
    return props.selection !== 'none'
  },
  get enableMultiRowSelection() {
    return props.selection === 'multiple'
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
}) as unknown as TableInstance<RowData>

// --- Virtualization ---------------------------------------------------
/** Whether to use TableVirtualBody instead of TableBody */
const useVirtual = computed<boolean>(() => {
  if (props.virtualRows === false) return false
  if (props.virtualRows === true) return true
  if (typeof props.virtualRows === 'number') return props.data.length > props.virtualRows
  return false
})

// The scroll container wrapping the <table> — passed to the virtualizer
const scrollContainerRef = useTemplateRef<HTMLElement>('scrollContainerRef')

// Ref to TableVirtualBody instance so keyboard nav can call scrollToIndex
const virtualBodyRef = ref<InstanceType<typeof TableVirtualBody> | null>(null)

// --- Keyboard navigation ----------------------------------------------
const rootRef = useTemplateRef<HTMLElement>('rootRef')

const rowCount = computed(() => props.data.length)
const columnCount = computed(() => {
  const firstGroup = table.getHeaderGroups()[0]
  return firstGroup ? firstGroup.headers.length : 0
})

function getCellElement(rowIndex: number, columnIndex: number): HTMLElement | null {
  const root = rootRef.value
  if (!root) return null
  // In virtualized mode, scroll the row into view first so the DOM node exists.
  // The queueMicrotask in useTableKeyboardNav.move() gives Vue one tick to
  // flush the virtualizer's render before focus is attempted.
  if (useVirtual.value && virtualBodyRef.value) {
    virtualBodyRef.value.scrollToIndex(rowIndex)
  }
  return root.querySelector<HTMLElement>(
    `[data-row-index="${rowIndex}"][data-col-index="${columnIndex}"]`
  )
}

const keyboardNav = useTableKeyboardNav({ rowCount, columnCount, getCellElement })

// --- Selection context helpers ----------------------------------------
const selectionEnabled = computed(() => props.selection !== 'none')
const selectionMode = computed(() => props.selection ?? 'none')

// Track last-clicked row index for Shift+Click range selection
const lastClickedRowIndex = ref<number | null>(null)

function handleRowClick(rowIndex: number, event: MouseEvent) {
  if (props.selection === 'none') return
  const rows = table.getRowModel().rows
  if (props.selection === 'multiple' && event.shiftKey && lastClickedRowIndex.value !== null) {
    const [start, end] = [lastClickedRowIndex.value, rowIndex].sort((a, b) => a - b)
    const next: RowSelectionState = { ...internalRowSelection.value }
    for (let i = start; i <= end; i++) {
      const r = rows[i]
      if (r) next[r.id] = true
    }
    updateRowSelection(next)
  }
  lastClickedRowIndex.value = rowIndex
}

// --- Context provision -------------------------------------------------
const variantRef = computed(() => props.variant ?? 'primary')
const activeCell = keyboardNav.activeCell

useTableProvide({
  table,
  activeCell,
  selectionEnabled,
  selectionMode,
  variant: variantRef,
  handleRowClick,
})

// --- Slot class derivation -------------------------------------------
const slotFns = computed(() => tableVariants({ variant: variantRef.value }))

defineExpose({ table, keyboardNav, handleRowClick })
</script>

<template>
  <div :class="composeClassName(slotFns.base(), $attrs.class as string, props.classNames?.base)">
    <!--
      scroll container: when virtualized, needs a fixed height + overflow:auto
      so the virtualizer can measure the viewport. Consumers should override
      the inline height via a wrapping container or CSS for production use.
    -->
    <div
      ref="scrollContainerRef"
      :class="composeClassName(slotFns.scrollContainer(), props.classNames?.scrollContainer)"
      :style="useVirtual ? { height: '400px', overflow: 'auto' } : undefined"
    >
      <table
        ref="rootRef"
        role="grid"
        :aria-label="ariaLabel"
        :aria-rowcount="rowCount"
        :aria-colcount="columnCount"
        @keydown="keyboardNav.onKeydown"
      >
        <TableHeader />
        <TableBody v-if="!useVirtual">
          <template #cell="slotProps">
            <slot
              name="cell"
              v-bind="slotProps"
            />
          </template>
        </TableBody>
        <TableVirtualBody
          v-else
          ref="virtualBodyRef"
          :scroll-element="scrollContainerRef"
          :estimated-row-height="estimatedRowHeight"
          :overscan="virtualizerOverscan"
        />
        <TableFooter v-if="$slots.footer">
          <slot name="footer" />
        </TableFooter>
      </table>
    </div>
  </div>
</template>
