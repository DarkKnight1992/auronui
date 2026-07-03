import { createContext } from '../../utils/context'
import type { Table as TableInstance, RowData } from '@tanstack/vue-table'
import type { Ref } from 'vue'

/**
 * TableContext — provided by the <Table> root, consumed by every descendant.
 *
 * Generic over TData so descendants can recover the real row-data type.
 * Vue's InjectionKey can't carry a live generic parameter, so the key itself
 * is fixed at `TableContext<any>`; generic satellite components cast the
 * injected value to `TableContext<TData>` at their own scope (same pattern
 * as Tree.context.ts's `treeContextKey`/`TreeItem.vue`).
 *
 * The `activeCell` ref tracks which cell is the "active" cell for
 * the roving tabindex. Format: { rowIndex, columnIndex } | null.
 */
export interface TableContext<TData extends RowData = RowData> {
  /** The TanStack table instance (reactive via vue-table composable) */
  table: TableInstance<TData>
  /** Roving tabindex active cell */
  activeCell: Ref<{ rowIndex: number; columnIndex: number } | null>
  /** Whether selection column (checkbox) is enabled */
  selectionEnabled: Ref<boolean>
  /** Variant for slot className generation */
  variant: Ref<'primary' | 'secondary'>
  /** Selection mode: 'none' | 'single' | 'multiple' */
  selectionMode: Ref<'none' | 'single' | 'multiple'>
  /** Shift+Click range handler called from TableBody row click listener */
  handleRowClick: (rowIndex: number, event: MouseEvent) => void
}

export const {
  useProvide: useTableProvide,
  useInject: useTableInject,
  key: tableContextKey,
} = createContext<TableContext<any>>('Table')
