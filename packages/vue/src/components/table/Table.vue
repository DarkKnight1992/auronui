<script setup lang="ts" generic="TData extends RowData = RowData">
import { computed, ref, watch, useTemplateRef, h } from 'vue'
import {
  useVueTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
  type PaginationState,
  type Table as TableInstance,
  type RowData,
  type Row,
} from '@tanstack/vue-table'
import { tableVariants, type TableVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useTableProvide } from './table.context'
import { useTableKeyboardNav } from './useTableKeyboardNav'
import TableHeader from './TableHeader.vue'
import TableBody from './TableBody.vue'
import TableVirtualBody from './TableVirtualBody.vue'
import TableFooter from './TableFooter.vue'
import TableCheckboxCell from './TableCheckboxCell.vue'
import Pagination from '../pagination/Pagination.vue'
import PaginationContent from '../pagination/PaginationContent.vue'
import PaginationPrev from '../pagination/PaginationPrev.vue'
import PaginationNext from '../pagination/PaginationNext.vue'
import PaginationItem from '../pagination/PaginationItem.vue'
import PaginationEllipsis from '../pagination/PaginationEllipsis.vue'
import Select from '../select/Select.vue'
import type { SelectItemValue } from '../select/Select.context'
import { warnConflictingProps } from '../../utils/warnDeprecated'

type SelectionMode = 'none' | 'single' | 'multiple'

const props = withDefaults(
  defineProps<{
    columns: ColumnDef<TData, any>[]
    data: TData[]
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
    /**
     * Opt-in pagination. Omit (default) to disable — Table renders all rows
     * with no pagination row model applied.
     */
    pagination?: {
      /** Rows per page. Default: 10 */
      pageSize?: number
      /** Server-side mode: `data` is assumed to already be just the current page's rows. Default: false */
      manual?: boolean
      /** Required when `manual: true` — total row count across all pages. */
      totalItems?: number
    }
    /** Current page, 1-indexed. Use v-model:page. Default: 1 (uncontrolled if unbound). */
    page?: number
    /**
     * Rows-per-page choices to offer the user as a <Select> next to the auto-rendered
     * Pagination control. Omit to hide the selector — pageSize is then fixed to
     * `pagination.pageSize`. Requires `pagination` to be set.
     */
    pageSizeOptions?: number[]
    /** Per-slot CSS class overrides */
    classNames?: Partial<{
      base: ClassValue
      scrollContainer: ClassValue
      content: ClassValue
      header: ClassValue
      row: ClassValue
      column: ClassValue
      body: ClassValue
      cell: ClassValue
      footer: ClassValue
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
    pagination: undefined,
    page: undefined,
    pageSizeOptions: undefined,
  }
)

const emit = defineEmits<{
  'update:rowSelection': [value: RowSelectionState]
  'update:page': [value: number]
  'update:pageSize': [value: number]
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

// --- Pagination state (controlled/uncontrolled) -----------------------
const paginationEnabled = computed(() => props.pagination !== undefined)
const isManualPagination = computed(() => props.pagination?.manual ?? false)
const paginationTotalItems = computed(() =>
  isManualPagination.value ? (props.pagination?.totalItems ?? 0) : props.data.length
)

const internalPage = ref<number>(props.page ?? 1)
watch(
  () => props.page,
  (next) => {
    if (next !== undefined) internalPage.value = next
  }
)

function updatePage(next: number) {
  internalPage.value = next
  emit('update:page', next)
}

const internalPageSize = ref<number>(props.pagination?.pageSize ?? 10)
watch(
  () => props.pagination?.pageSize,
  (next) => {
    if (next !== undefined) internalPageSize.value = next
  }
)

// Changing pageSize invalidates the current page's offset — reset to page 1,
// matching the common pagination UX (avoids landing on a now out-of-range page).
function updatePageSize(next: number) {
  internalPageSize.value = next
  emit('update:pageSize', next)
  updatePage(1)
}

const pageSizeOptionItems = computed(() =>
  (props.pageSizeOptions ?? []).map((n) => ({ value: n as SelectItemValue, label: String(n) }))
)

// --- Selection column injected at position 0 when enabled -----------
const selectionColumn: ColumnDef<TData, any> = {
  id: '__select__',
  size: 44,
  enableSorting: false,
  // TableCheckboxCell is invoked here via h() (a runtime call, not a compiled
  // template), which — like @vue/test-utils' mount() — does not infer a generic
  // SFC's type parameter from the props passed. It always resolves to the
  // component's default (RowData). Casting through RowData (not TData) here
  // matches what h() actually expects; this is the one narrower assertion the
  // design spec anticipated keeping.
  header: ({ table: t }) =>
    props.selection === 'multiple'
      ? h(TableCheckboxCell, { table: t as unknown as TableInstance<RowData> })
      : '',
  cell: ({ row: r }) => h(TableCheckboxCell, { row: r as unknown as Row<RowData> }),
}

const effectiveColumns = computed<ColumnDef<TData, any>[]>(() => {
  if (props.selection === 'none') return props.columns
  return [selectionColumn, ...props.columns]
})

// Instantiate once for a stable reference; a new model per getter access would bust TanStack's memoization.
const paginationRowModel = getPaginationRowModel()

// --- useVueTable instance ---------------------------------------------
// Use getters so @tanstack/vue-table tracks prop reactivity.
const table = useVueTable({
  get data() {
    return props.data
  },
  get columns() {
    return effectiveColumns.value as ColumnDef<TData, unknown>[]
  },
  state: {
    get sorting() {
      return sorting.value
    },
    get rowSelection() {
      return internalRowSelection.value
    },
    get pagination(): PaginationState {
      return { pageIndex: internalPage.value - 1, pageSize: internalPageSize.value }
    },
  },
  onSortingChange: (updater) => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
  },
  onRowSelectionChange: updateRowSelection,
  onPaginationChange: (updater) => {
    const current: PaginationState = { pageIndex: internalPage.value - 1, pageSize: internalPageSize.value }
    const next = typeof updater === 'function' ? updater(current) : updater
    if (next.pageSize !== internalPageSize.value) {
      updatePageSize(next.pageSize)
    } else {
      updatePage(next.pageIndex + 1)
    }
  },
  get enableRowSelection() {
    return props.selection !== 'none'
  },
  get enableMultiRowSelection() {
    return props.selection === 'multiple'
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  get getPaginationRowModel() {
    return paginationEnabled.value ? paginationRowModel : undefined
  },
  get manualPagination() {
    return isManualPagination.value
  },
  get pageCount() {
    return isManualPagination.value
      ? Math.ceil(paginationTotalItems.value / internalPageSize.value)
      : undefined
  },
})

// --- Virtualization ---------------------------------------------------
/** Whether to use TableVirtualBody instead of TableBody */
const useVirtual = computed<boolean>(() => {
  if (paginationEnabled.value) return false
  if (props.virtualRows === false) return false
  if (props.virtualRows === true) return true
  if (typeof props.virtualRows === 'number') return props.data.length > props.virtualRows
  return false
})

// Warn when pagination and virtualRows are both set (pagination takes precedence)
watch(
  [paginationEnabled, () => props.virtualRows],
  ([paginationEnabled, virtualRows]) => {
    if (paginationEnabled && virtualRows !== false) {
      warnConflictingProps(
        'Table',
        'virtualRows',
        'pagination',
        'pagination takes precedence and virtualRows is disabled',
      )
    }
  },
  { immediate: true }
)

// The scroll container wrapping the <table> — passed to the virtualizer
const scrollContainerRef = useTemplateRef<HTMLElement>('scrollContainerRef')

// Ref to TableVirtualBody instance so keyboard nav can call scrollToIndex.
// InstanceType<typeof TableVirtualBody> no longer resolves now that
// TableVirtualBody is a generic SFC (its exported type is a generic factory
// function, not a plain constructor) — declare the exposed shape by hand
// instead, matching what TableVirtualBody.vue's defineExpose actually provides.
interface TableVirtualBodyExpose {
  scrollToIndex: (index: number) => void
}
const virtualBodyRef = ref<TableVirtualBodyExpose | null>(null)

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
        :class="composeClassName(slotFns.content(), props.classNames?.content)"
        role="grid"
        :aria-label="ariaLabel"
        :aria-rowcount="rowCount"
        :aria-colcount="columnCount"
        @keydown="keyboardNav.onKeydown"
      >
        <TableHeader
          :class-names="{ header: props.classNames?.header, row: props.classNames?.row, column: props.classNames?.column }"
        />
        <TableBody
          v-if="!useVirtual"
          :class-names="{ body: props.classNames?.body, row: props.classNames?.row, cell: props.classNames?.cell }"
        >
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
          :class-names="{ body: props.classNames?.body, row: props.classNames?.row, cell: props.classNames?.cell }"
        />
        <TableFooter
          v-if="$slots.footer || paginationEnabled"
          :class-names="{ footer: props.classNames?.footer }"
          :colspan="columnCount"
        >
          <slot
            v-if="$slots.footer"
            name="footer"
          />
          <template v-else-if="paginationEnabled">
            <Select
              v-if="pageSizeOptions && pageSizeOptions.length > 0"
              :model-value="internalPageSize"
              :items="pageSizeOptionItems"
              label="Rows per page"
              label-placement="outside-left"
              class="w-52 shrink-0"
              @update:model-value="(v) => updatePageSize(Number(v))"
            />
            <Pagination
              :page="internalPage"
              :items-per-page="internalPageSize"
              :total-items="paginationTotalItems"
              class="w-auto"
              @update:page="updatePage"
            >
              <PaginationContent v-slot="{ items }">
                <PaginationPrev />
                <template
                  v-for="(item, itemIndex) in items"
                  :key="item.type === 'page' ? item.value : `e-${itemIndex}`"
                >
                  <PaginationItem
                    v-if="item.type === 'page'"
                    :value="item.value"
                  />
                  <PaginationEllipsis v-else />
                </template>
                <PaginationNext />
              </PaginationContent>
            </Pagination>
          </template>
        </TableFooter>
      </table>
    </div>
  </div>
</template>
