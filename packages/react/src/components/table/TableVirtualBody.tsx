import { forwardRef, useImperativeHandle, type KeyboardEvent } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { flexRender, type Row, type RowData } from "@tanstack/react-table";
import { tableVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { useTableContext, type TableContext } from "./table.context";

export interface TableVirtualBodyHandle {
  scrollToIndex: (index: number) => void;
}

export interface TableVirtualBodyProps {
  scrollElement: HTMLElement | null;
  estimatedRowHeight?: number;
  overscan?: number;
  /**
   * Per-slot class overrides. Each key maps to a named slot in the anatomy;
   * the value is merged with the generated variant classes via `composeClassName`.
   */
  classNames?: Partial<{
    body: ClassValue;
    row: ClassValue;
    cell: ClassValue;
  }>;
}

function onRowKeyDown<TData extends RowData>(
  ctx: TableContext<TData>,
  row: Row<TData>,
  event: KeyboardEvent<HTMLTableRowElement>,
) {
  if (event.key !== " ") return;
  if (ctx.selectionMode === "none") return;
  const target = event.target as HTMLElement;
  if (target.tagName === "INPUT" || target.closest('[role="checkbox"]')) return;
  event.preventDefault();
  if (ctx.selectionMode === "single") {
    ctx.table.setRowSelection({ [row.id]: true });
  } else {
    row.toggleSelected();
  }
}

/**
 * Uses <tbody> + spacer <tr> rows so virtualized rows stay inside valid
 * <table> structure and inherit column widths from <thead>.
 * paddingTop/paddingBottom spacers replace the absolute-positioning approach.
 */
export const TableVirtualBody = forwardRef<TableVirtualBodyHandle, TableVirtualBodyProps>(function TableVirtualBody(
  { scrollElement, estimatedRowHeight = 44, overscan = 8, classNames },
  ref,
) {
  const ctx = useTableContext();
  const slotFns = tableVariants({ variant: ctx.variant });

  const rows = ctx.table.getRowModel().rows;

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollElement,
    estimateSize: () => estimatedRowHeight,
    overscan,
  });

  useImperativeHandle(
    ref,
    () => ({
      scrollToIndex: (index: number) => virtualizer.scrollToIndex(index, { align: "auto" }),
    }),
    [virtualizer],
  );

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0;
  const paddingBottom = virtualItems.length > 0 ? totalSize - virtualItems[virtualItems.length - 1].end : 0;

  const columnCount = ctx.table.getVisibleLeafColumns().length;

  return (
    <tbody className={composeClassName(slotFns.body(), classNames?.body)}>
      {paddingTop > 0 && (
        <tr aria-hidden="true">
          <td colSpan={columnCount} style={{ height: `${paddingTop}px`, padding: 0, border: "none" }} />
        </tr>
      )}
      {virtualItems.map((vItem) => {
        const row = rows[vItem.index];
        return (
          <tr
            key={row.id}
            role="row"
            className={composeClassName(slotFns.row(), classNames?.row)}
            aria-rowindex={vItem.index + 1}
            aria-selected={ctx.selectionMode !== "none" ? row.getIsSelected() : undefined}
            data-state={row.getIsSelected() ? "checked" : undefined}
            onClick={(event) => ctx.handleRowClick(vItem.index, event)}
            onKeyDown={(event) => onRowKeyDown(ctx, row, event)}
          >
            {row.getVisibleCells().map((cell, colIndex) => (
              <td
                key={cell.id}
                role="gridcell"
                className={composeClassName(slotFns.cell(), classNames?.cell)}
                data-row-index={vItem.index}
                data-col-index={colIndex}
                tabIndex={
                  ctx.activeCell !== null &&
                  ctx.activeCell.rowIndex === vItem.index &&
                  ctx.activeCell.columnIndex === colIndex
                    ? 0
                    : ctx.activeCell === null && vItem.index === 0 && colIndex === 0
                      ? 0
                      : -1
                }
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        );
      })}
      {paddingBottom > 0 && (
        <tr aria-hidden="true">
          <td colSpan={columnCount} style={{ height: `${paddingBottom}px`, padding: 0, border: "none" }} />
        </tr>
      )}
    </tbody>
  );
});
