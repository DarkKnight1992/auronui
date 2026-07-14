import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { tableVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { useTableContext } from "./table.context";

/** Thin public re-export for consumers who want to compose their own body.
 * Renders a single tr with role="row" and the row slot style. */
export interface TableRowOwnProps {
  /** Per-slot class overrides */
  classNames?: Partial<{
    row: ClassValue;
  }>;
  children?: ReactNode;
}

export type TableRowProps = TableRowOwnProps & Omit<ComponentPropsWithoutRef<"tr">, keyof TableRowOwnProps>;

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { classNames, children, className, ...rest },
  ref,
) {
  const ctx = useTableContext();
  const slotFns = tableVariants({ variant: ctx.variant });

  return (
    <tr ref={ref} role="row" className={composeClassName(slotFns.row(), className, classNames?.row)} {...rest}>
      {children}
    </tr>
  );
});
