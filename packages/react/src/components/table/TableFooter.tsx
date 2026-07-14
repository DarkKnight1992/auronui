import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { tableVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { useTableContext } from "./table.context";

export interface TableFooterOwnProps {
  /** Override classes for specific slots. */
  classNames?: Partial<{
    footer: ClassValue;
  }>;
  /**
   * Number of columns the footer content should span.
   * Required for valid <tfoot> markup — content is wrapped in a single <tr><td>.
   */
  colSpan?: number;
  children?: ReactNode;
}

export type TableFooterProps = TableFooterOwnProps &
  Omit<ComponentPropsWithoutRef<"tfoot">, keyof TableFooterOwnProps | "colSpan">;

export const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(function TableFooter(
  { classNames, colSpan, children, className, ...rest },
  ref,
) {
  const ctx = useTableContext();
  const slotFns = tableVariants({ variant: ctx.variant });

  return (
    <tfoot ref={ref} className={composeClassName(slotFns.footer(), className, classNames?.footer)} {...rest}>
      <tr>
        <td colSpan={colSpan} className={slotFns.footerCell()}>
          <div className={slotFns.footerContent()}>{children}</div>
        </td>
      </tr>
    </tfoot>
  );
});
