import type { KeyboardEvent, MouseEvent } from "react";
import { flexRender, type Header } from "@tanstack/react-table";
import { tableVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { useTableContext } from "./table.context";

export interface TableHeaderProps {
  /** Per-slot class overrides */
  classNames?: Partial<{
    header: ClassValue;
    row: ClassValue;
    column: ClassValue;
  }>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getAriaSort(header: Header<any, unknown>): "ascending" | "descending" | "none" | undefined {
  if (!header.column.getCanSort()) return undefined;
  const dir = header.column.getIsSorted();
  if (dir === "asc") return "ascending";
  if (dir === "desc") return "descending";
  return "none";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onHeaderActivate(header: Header<any, unknown>, event: MouseEvent | KeyboardEvent) {
  if (!header.column.getCanSort()) return;
  const handler = header.column.getToggleSortingHandler();
  if (handler) handler(event);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onHeaderKeyDown(header: Header<any, unknown>, event: KeyboardEvent) {
  if (event.key !== " " && event.key !== "Enter") return;
  if (!header.column.getCanSort()) return;
  event.preventDefault();
  onHeaderActivate(header, event);
}

export function TableHeader({ classNames }: TableHeaderProps) {
  const ctx = useTableContext();
  const slotFns = tableVariants({ variant: ctx.variant });

  return (
    <thead className={composeClassName(slotFns.header(), classNames?.header)}>
      {ctx.table.getHeaderGroups().map((headerGroup: ReturnType<typeof ctx.table.getHeaderGroups>[number]) => (
        <tr key={headerGroup.id} role="row" className={composeClassName(slotFns.row(), classNames?.row)}>
          {headerGroup.headers.map((header: (typeof headerGroup.headers)[number], colIndex: number) => (
            <th
              key={header.id}
              role="columnheader"
              className={composeClassName(slotFns.column(), classNames?.column)}
              data-col-index={colIndex}
              data-row-index={-1}
              aria-sort={getAriaSort(header)}
              data-allows-sorting={header.column.getCanSort() ? "true" : undefined}
              tabIndex={header.column.getCanSort() ? 0 : undefined}
              onClick={(event) => onHeaderActivate(header, event)}
              onKeyDown={(event) => onHeaderKeyDown(header, event)}
            >
              {!header.isPlaceholder && flexRender(header.column.columnDef.header, header.getContext())}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
}
