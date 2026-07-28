import type { MouseEvent } from "react";
import type { Table as TableInstance, RowData } from "@tanstack/react-table";
import { createStrictContext } from "../../utils";

export type TableSelectionMode = "none" | "single" | "multiple";

/**
 * TableContext — provided by the <Table> root, consumed by every descendant.
 *
 * Generic over TData so descendants can recover the real row-data type. React
 * Context can't carry a live generic parameter either (same limitation as
 * Vue's InjectionKey), so the context itself is fixed at `TableContext<any>`
 * and generic satellite components cast the consumed value to
 * `TableContext<TData>` at their own call site.
 */
export interface TableContext<TData extends RowData = RowData> {
  /** The TanStack table instance */
  table: TableInstance<TData>;
  /** Roving tabindex active cell */
  activeCell: { rowIndex: number; columnIndex: number } | null;
  /** Whether selection column (checkbox) is enabled */
  selectionEnabled: boolean;
  /** Variant for slot className generation */
  variant: "primary" | "secondary";
  /** Selection mode */
  selectionMode: TableSelectionMode;
  /** Shift+Click range handler called from TableBody/TableVirtualBody row click listener */
  handleRowClick: (rowIndex: number, event: MouseEvent) => void;
  /**
   * Syncs the roving-tabindex activeCell to whatever cell actually receives
   * DOM focus (mouse click, Tab-entry) — not just arrow-key navigation.
   * Bind to each gridcell's `onFocus`.
   */
  onCellFocus: (rowIndex: number, columnIndex: number) => void;
}

export const {
  Provider: TableProvider,
  useStrictContext: useTableContext,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} = createStrictContext<TableContext<any>>("Table");
