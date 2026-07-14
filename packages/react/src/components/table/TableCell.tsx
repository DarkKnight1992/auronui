import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { tableVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { useTableContext } from "./table.context";

export interface TableCellOwnProps {
  rowIndex?: number;
  columnIndex?: number;
  /** Per-slot class name overrides merged via `composeClassName`. */
  classNames?: Partial<{
    cell: ClassValue;
  }>;
  children?: ReactNode;
}

export type TableCellProps = TableCellOwnProps & Omit<ComponentPropsWithoutRef<"td">, keyof TableCellOwnProps>;

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { rowIndex, columnIndex, classNames, children, className, ...rest },
  ref,
) {
  const ctx = useTableContext();
  const slotFns = tableVariants({ variant: ctx.variant });

  return (
    <td
      ref={ref}
      role="gridcell"
      className={composeClassName(slotFns.cell(), className, classNames?.cell)}
      data-row-index={rowIndex}
      data-col-index={columnIndex}
      {...rest}
    >
      {children}
    </td>
  );
});
