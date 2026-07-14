import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { paginationVariants } from "@auronui/styles";
import { composeClassName, dataAttr, type ClassValue } from "../../utils";
import { usePaginationContext, paginationContextDefaults } from "./pagination.context";

export interface PaginationItemOwnProps {
  /** Page number this item represents */
  value: number;
  className?: ClassValue;
  children?: ReactNode;
}

export type PaginationItemProps = PaginationItemOwnProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof PaginationItemOwnProps>;

export const PaginationItem = forwardRef<HTMLButtonElement, PaginationItemProps>(function PaginationItem(
  { value, className, children, ...rest },
  ref,
) {
  const ctx = usePaginationContext(paginationContextDefaults);
  const styles = paginationVariants({ size: ctx.size });
  const isSelected = ctx.page === value;

  return (
    <span className={composeClassName(styles.item(), className)}>
      <button
        ref={ref}
        type="button"
        className={styles.link()}
        data-type="page"
        data-selected={dataAttr(isSelected)}
        aria-label={`Page ${value}`}
        aria-current={isSelected ? "page" : undefined}
        disabled={ctx.disabled}
        onClick={() => ctx.onPageChange(value)}
        {...rest}
      >
        {children ?? value}
      </button>
    </span>
  );
});
