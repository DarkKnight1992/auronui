import type { KeyboardEvent, ReactNode } from "react";
import { flexRender, type Cell, type Column, type Row, type RowData } from "@tanstack/react-table";
import { tableVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { useTableContext, type TableContext } from "./table.context";

export interface TableBodyCellSlotProps<TData extends RowData = RowData> {
  row: Row<TData>;
  cell: Cell<TData, unknown>;
  column: Column<TData, unknown>;
  value: unknown;
}

export interface TableBodyProps<TData extends RowData = RowData> {
  /**
   * Per-slot class overrides. Each key maps to a named slot in the anatomy;
   * the value is merged with the generated variant classes via `composeClassName`.
   *
   * Available slots: `body`, `row`, `cell`.
   */
  classNames?: Partial<{
    body: ClassValue;
    row: ClassValue;
    cell: ClassValue;
  }>;
  /** Custom cell renderer — defaults to flexRender(cell.column.columnDef.cell, cell.getContext()) */
  renderCell?: (slotProps: TableBodyCellSlotProps<TData>) => ReactNode;
}

function onRowKeyDown<TData extends RowData>(
  ctx: TableContext<TData>,
  row: Row<TData>,
  event: KeyboardEvent<HTMLTableRowElement>,
) {
  // Space on a gridcell toggles row selection
  if (event.key !== " ") return;
  if (ctx.selectionMode === "none") return;
  // Do NOT handle Space when target is inside a checkbox element (it handles its own Space)
  const target = event.target as HTMLElement;
  if (target.tagName === "INPUT" || target.closest('[role="checkbox"]')) return;
  event.preventDefault();
  if (ctx.selectionMode === "single") {
    // Single-select: clear all, select just this one
    ctx.table.setRowSelection({ [row.id]: true });
  } else {
    row.toggleSelected();
  }
}

export function TableBody<TData extends RowData = RowData>({ classNames, renderCell }: TableBodyProps<TData>) {
  const ctx = useTableContext() as TableContext<TData>;
  const slotFns = tableVariants({ variant: ctx.variant });

  return (
    <tbody className={composeClassName(slotFns.body(), classNames?.body)}>
      {ctx.table.getRowModel().rows.map((row, rowIndex) => (
        <tr
          key={row.id}
          role="row"
          className={composeClassName(slotFns.row(), classNames?.row)}
          aria-rowindex={rowIndex + 1}
          aria-selected={ctx.selectionMode !== "none" ? row.getIsSelected() : undefined}
          data-state={row.getIsSelected() ? "checked" : undefined}
          onClick={(event) => ctx.handleRowClick(rowIndex, event)}
          onKeyDown={(event) => onRowKeyDown(ctx, row, event)}
        >
          {row.getVisibleCells().map((cell, colIndex) => (
            <td
              key={cell.id}
              role="gridcell"
              className={composeClassName(slotFns.cell(), classNames?.cell)}
              data-row-index={rowIndex}
              data-col-index={colIndex}
              tabIndex={
                ctx.activeCell && ctx.activeCell.rowIndex === rowIndex && ctx.activeCell.columnIndex === colIndex
                  ? 0
                  : ctx.activeCell === null && rowIndex === 0 && colIndex === 0
                    ? 0
                    : -1
              }
              onFocus={() => ctx.onCellFocus(rowIndex, colIndex)}
            >
              {renderCell
                ? renderCell({ row, cell, column: cell.column, value: cell.getValue() })
                : flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
