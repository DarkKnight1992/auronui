import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
  type PaginationState,
  type RowData,
} from "@tanstack/react-table";
import { tableVariants, type TableVariants } from "@auronui/styles";
import { composeClassName, warnConflictingProps, type ClassValue } from "../../utils";
import { TableProvider } from "./table.context";
import { useTableKeyboardNav } from "./useTableKeyboardNav";
import { TableHeader } from "./TableHeader";
import { TableBody, type TableBodyCellSlotProps } from "./TableBody";
import { TableVirtualBody, type TableVirtualBodyHandle } from "./TableVirtualBody";
import { TableFooter } from "./TableFooter";
import { TableCheckboxCell } from "./TableCheckboxCell";

export type TableSelectionMode = "none" | "single" | "multiple";

export interface TablePaginationOptions {
  /** Rows per page. Default: 10 */
  pageSize?: number;
  /** Server-side mode: `data` is assumed to already be just the current page's rows. Default: false */
  manual?: boolean;
  /** Required when `manual: true` — total row count across all pages. */
  totalItems?: number;
}

export interface TableProps<TData extends RowData = RowData> {
  columns: ColumnDef<TData, any>[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  data: TData[];
  variant?: TableVariants["variant"];
  ariaLabel?: string;
  /** Row selection mode. 'single' = radio-style; 'multiple' = checkbox + shift+click; 'none' = disabled */
  selection?: TableSelectionMode;
  /** Controlled row selection state (Record<rowId, boolean>). */
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (value: RowSelectionState) => void;
  /**
   * Opt-in row virtualization via @tanstack/react-virtual.
   * - false (default): all rows render in a standard <tbody>
   * - true: always render via TableVirtualBody (only visible rows in DOM)
   * - number N: auto-enable virtualization when data.length > N
   */
  virtualRows?: boolean | number;
  /** Estimated row height in px used by the virtualizer (default: 44) */
  estimatedRowHeight?: number;
  /** Extra rows to render outside the visible viewport (default: 8) */
  virtualizerOverscan?: number;
  /**
   * Opt-in pagination. Omit (default) to disable — Table renders all rows
   * with no pagination row model applied.
   */
  pagination?: TablePaginationOptions;
  /** Current page, 1-indexed. Default: 1 (uncontrolled if unbound). */
  page?: number;
  onPageChange?: (page: number) => void;
  /**
   * Rows-per-page choices to offer the user as a <select> next to the
   * auto-rendered pagination control. Omit to hide the selector — pageSize
   * is then fixed to `pagination.pageSize`. Requires `pagination` to be set.
   */
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  /** Per-slot CSS class overrides */
  classNames?: Partial<{
    base: ClassValue;
    scrollContainer: ClassValue;
    content: ClassValue;
    header: ClassValue;
    row: ClassValue;
    column: ClassValue;
    body: ClassValue;
    cell: ClassValue;
    footer: ClassValue;
  }>;
  className?: ClassValue;
  /** Custom cell renderer — defaults to flexRender(cell.column.columnDef.cell, cell.getContext()). Ignored when virtualized. */
  renderCell?: (slotProps: TableBodyCellSlotProps<TData>) => ReactNode;
  /** Custom footer content. When omitted and `pagination` is set, a minimal built-in pager renders. */
  footer?: ReactNode;
}

const selectionColumnId = "__select__";

export function Table<TData extends RowData = RowData>({
  columns,
  data,
  variant = "primary",
  ariaLabel,
  selection = "none",
  rowSelection,
  onRowSelectionChange,
  virtualRows = false,
  estimatedRowHeight = 44,
  virtualizerOverscan = 8,
  pagination,
  page,
  onPageChange,
  pageSizeOptions,
  onPageSizeChange,
  classNames,
  className,
  renderCell,
  footer,
}: TableProps<TData>) {
  // --- Sorting state ------------------------------------------------------
  const [sorting, setSorting] = useState<SortingState>([]);

  // --- Row selection state (controlled/uncontrolled) ----------------------
  const [internalRowSelection, setInternalRowSelection] = useState<RowSelectionState>(rowSelection ?? {});
  const resolvedRowSelection = rowSelection ?? internalRowSelection;

  const updateRowSelection = useCallback(
    (updater: RowSelectionState | ((old: RowSelectionState) => RowSelectionState)) => {
      setInternalRowSelection((prev) => {
        const base = rowSelection ?? prev;
        const next = typeof updater === "function" ? updater(base) : updater;
        onRowSelectionChange?.(next);
        return next;
      });
    },
    [rowSelection, onRowSelectionChange],
  );

  // --- Pagination state (controlled/uncontrolled) --------------------------
  const paginationEnabled = pagination !== undefined;
  const isManualPagination = pagination?.manual ?? false;
  const paginationTotalItems = isManualPagination ? (pagination?.totalItems ?? 0) : data.length;

  const [internalPage, setInternalPage] = useState<number>(page ?? 1);
  const resolvedPage = page ?? internalPage;

  const updatePage = useCallback(
    (next: number) => {
      setInternalPage(next);
      onPageChange?.(next);
    },
    [onPageChange],
  );

  const [internalPageSize, setInternalPageSize] = useState<number>(pagination?.pageSize ?? 10);

  // Changing pageSize invalidates the current page's offset — reset to page 1,
  // matching the common pagination UX (avoids landing on a now out-of-range page).
  const updatePageSize = useCallback(
    (next: number) => {
      setInternalPageSize(next);
      onPageSizeChange?.(next);
      updatePage(1);
    },
    [onPageSizeChange, updatePage],
  );

  const pageSizeOptionItems = pageSizeOptions ?? [];

  // --- Selection column injected at position 0 when enabled ---------------
  const effectiveColumns = useMemo<ColumnDef<TData, any>[]>(() => { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (selection === "none") return columns;
    const selectionColumn: ColumnDef<TData, any> = { // eslint-disable-line @typescript-eslint/no-explicit-any
      id: selectionColumnId,
      size: 44,
      enableSorting: false,
      header: ({ table: t }) =>
        selection === "multiple" ? <TableCheckboxCell table={t} /> : null,
      cell: ({ row: r }) => <TableCheckboxCell row={r} />,
    };
    return [selectionColumn, ...columns];
  }, [selection, columns]);

  // Warn when pagination and virtualRows are both set (pagination takes precedence)
  const warnedRef = useRef(false);
  if (paginationEnabled && virtualRows !== false && !warnedRef.current) {
    warnedRef.current = true;
    warnConflictingProps("Table", "virtualRows", "pagination", "pagination takes precedence and virtualRows is disabled");
  }

  const paginationState: PaginationState = { pageIndex: resolvedPage - 1, pageSize: internalPageSize };

  const table = useReactTable({
    data,
    columns: effectiveColumns,
    state: {
      sorting,
      rowSelection: resolvedRowSelection,
      pagination: paginationState,
    },
    onSortingChange: (updater) => {
      setSorting((prev) => (typeof updater === "function" ? updater(prev) : updater));
    },
    onRowSelectionChange: updateRowSelection,
    onPaginationChange: (updater) => {
      const next = typeof updater === "function" ? updater(paginationState) : updater;
      if (next.pageSize !== internalPageSize) {
        updatePageSize(next.pageSize);
      } else {
        updatePage(next.pageIndex + 1);
      }
    },
    enableRowSelection: selection !== "none",
    enableMultiRowSelection: selection === "multiple",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: paginationEnabled ? getPaginationRowModel() : undefined,
    manualPagination: isManualPagination,
    pageCount: isManualPagination ? Math.ceil(paginationTotalItems / internalPageSize) : undefined,
  });

  // --- Virtualization -------------------------------------------------------
  const useVirtual = paginationEnabled
    ? false
    : virtualRows === true
      ? true
      : typeof virtualRows === "number"
        ? data.length > virtualRows
        : false;

  const [scrollContainerEl, setScrollContainerEl] = useState<HTMLDivElement | null>(null);
  const virtualBodyRef = useRef<TableVirtualBodyHandle | null>(null);
  const rootRef = useRef<HTMLTableElement | null>(null);

  const rowCount = data.length;
  const headerGroups = table.getHeaderGroups();
  const columnCount = headerGroups[0] ? headerGroups[0].headers.length : 0;

  const getCellElement = useCallback(
    (rowIndex: number, columnIndex: number): HTMLElement | null => {
      const root = rootRef.current;
      if (!root) return null;
      // In virtualized mode, scroll the row into view first so the DOM node exists.
      // The queueMicrotask in useTableKeyboardNav's move() gives React one tick to
      // flush the virtualizer's render before focus is attempted.
      if (useVirtual && virtualBodyRef.current) {
        virtualBodyRef.current.scrollToIndex(rowIndex);
      }
      return root.querySelector<HTMLElement>(`[data-row-index="${rowIndex}"][data-col-index="${columnIndex}"]`);
    },
    [useVirtual],
  );

  const keyboardNav = useTableKeyboardNav({ rowCount, columnCount, getCellElement });

  // --- Selection context helpers ---------------------------------------------
  const selectionEnabled = selection !== "none";

  // Track last-clicked row index for Shift+Click range selection
  const lastClickedRowIndexRef = useRef<number | null>(null);

  const handleRowClick = useCallback(
    (rowIndex: number, event: MouseEvent) => {
      if (selection === "none") return;
      const rows = table.getRowModel().rows;
      if (selection === "multiple" && event.shiftKey && lastClickedRowIndexRef.current !== null) {
        const [start, end] = [lastClickedRowIndexRef.current, rowIndex].sort((a, b) => a - b);
        const next: RowSelectionState = { ...resolvedRowSelection };
        for (let i = start; i <= end; i++) {
          const r = rows[i];
          if (r) next[r.id] = true;
        }
        updateRowSelection(next);
      }
      lastClickedRowIndexRef.current = rowIndex;
    },
    [selection, table, resolvedRowSelection, updateRowSelection],
  );

  const slotFns = tableVariants({ variant });

  const hasFooterContent = footer !== undefined || paginationEnabled;

  return (
    <TableProvider
      value={{
        table,
        activeCell: keyboardNav.activeCell,
        selectionEnabled,
        selectionMode: selection,
        variant,
        handleRowClick,
      }}
    >
      <div className={composeClassName(slotFns.base(), className, classNames?.base)}>
        {/*
          scroll container: when virtualized, needs a fixed height + overflow:auto
          so the virtualizer can measure the viewport. Consumers should override
          the inline height via a wrapping container or CSS for production use.
        */}
        <div
          ref={setScrollContainerEl}
          className={composeClassName(slotFns.scrollContainer(), classNames?.scrollContainer)}
          style={useVirtual ? { height: "400px", overflow: "auto" } : undefined}
        >
          <table
            ref={rootRef}
            className={composeClassName(slotFns.content(), classNames?.content)}
            role="grid"
            aria-label={ariaLabel}
            aria-rowcount={rowCount}
            aria-colcount={columnCount}
            onKeyDown={keyboardNav.onKeyDown}
          >
            <TableHeader
              classNames={{ header: classNames?.header, row: classNames?.row, column: classNames?.column }}
            />
            {!useVirtual ? (
              <TableBody
                classNames={{ body: classNames?.body, row: classNames?.row, cell: classNames?.cell }}
                renderCell={renderCell}
              />
            ) : (
              <TableVirtualBody
                ref={virtualBodyRef}
                scrollElement={scrollContainerEl}
                estimatedRowHeight={estimatedRowHeight}
                overscan={virtualizerOverscan}
                classNames={{ body: classNames?.body, row: classNames?.row, cell: classNames?.cell }}
              />
            )}
            {hasFooterContent && (
              <TableFooter classNames={{ footer: classNames?.footer }} colSpan={columnCount}>
                {footer ??
                  (paginationEnabled ? (
                    <TablePager
                      page={resolvedPage}
                      pageSize={internalPageSize}
                      totalItems={paginationTotalItems}
                      pageSizeOptions={pageSizeOptionItems}
                      onPageChange={updatePage}
                      onPageSizeChange={(n) => updatePageSize(n)}
                    />
                  ) : null)}
              </TableFooter>
            )}
          </table>
        </div>
      </div>
    </TableProvider>
  );
}

/**
 * NOTE: The Vue port composes the shared <Pagination>/<Select> components
 * here. Neither has been ported to @auronui/react yet (owned by parallel
 * batches), so this renders a minimal self-contained pager instead — same
 * page/pageSize contract, without the design-system styling those
 * components would provide. Swap for the real components once they land.
 */
function TablePager({
  page,
  pageSize,
  totalItems,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: {
  page: number;
  pageSize: number;
  totalItems: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}) {
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));

  return (
    <div className="flex items-center justify-between gap-4" data-slot="table-pager">
      {pageSizeOptions.length > 0 && (
        <label className="flex items-center gap-2 text-sm">
          Rows per page
          <select
            value={pageSize}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => onPageSizeChange(Number(event.target.value))}
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      )}
      <nav className="flex items-center gap-2" aria-label="Pagination">
        <button type="button" disabled={page <= 1} onClick={() => onPageChange(Math.max(1, page - 1))}>
          Previous
        </button>
        <span>
          Page {page} of {pageCount}
        </span>
        <button
          type="button"
          disabled={page >= pageCount}
          onClick={() => onPageChange(Math.min(pageCount, page + 1))}
        >
          Next
        </button>
      </nav>
    </div>
  );
}
