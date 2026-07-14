import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { tableVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { useTableContext } from "./table.context";

export interface TableHeaderCellOwnProps {
  columnIndex?: number;
  sortDirection?: "ascending" | "descending" | "none";
  /** Per-slot class overrides */
  classNames?: Partial<{
    column: ClassValue;
  }>;
  children?: ReactNode;
}

export type TableHeaderCellProps = TableHeaderCellOwnProps &
  Omit<ComponentPropsWithoutRef<"th">, keyof TableHeaderCellOwnProps>;

export const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(function TableHeaderCell(
  { columnIndex, sortDirection, classNames, children, className, ...rest },
  ref,
) {
  const ctx = useTableContext();
  const slotFns = tableVariants({ variant: ctx.variant });

  return (
    <th
      ref={ref}
      role="columnheader"
      className={composeClassName(slotFns.column(), className, classNames?.column)}
      data-col-index={columnIndex}
      aria-sort={sortDirection}
      {...rest}
    >
      {children}
    </th>
  );
});
