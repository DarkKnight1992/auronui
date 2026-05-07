import { createContext } from '../../utils/context'
import type { Table as TableInstance, RowData } from '@tanstack/vue-table'
import type { Ref } from 'vue'

/**
 * TableContext — provided by the <Table> root, consumed by every descendant.
 *
 * We intentionally use `RowData` (TanStack's opaque row type) rather than a
 * generic TData because Vue's provide/inject cannot propagate generics
 * across SFC boundaries. Consumers (sub-parts) cast as needed.
 *
 * The `activeCell` ref tracks which cell is the "active" cell for
 * the roving tabindex. Format: { rowIndex, columnIndex } | null.
 */
export interface TableContext {
  /** The TanStack table instance (reactive via vue-table composable) */
  table: TableInstance<RowData>
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
} = createContext<TableContext>('Table')
