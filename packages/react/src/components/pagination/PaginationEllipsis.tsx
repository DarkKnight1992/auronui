import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { paginationVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { usePaginationContext, paginationContextDefaults } from "./pagination.context";

export interface PaginationEllipsisOwnProps {
  className?: ClassValue;
  children?: ReactNode;
}

export type PaginationEllipsisProps = PaginationEllipsisOwnProps &
  Omit<ComponentPropsWithoutRef<"span">, keyof PaginationEllipsisOwnProps>;

export const PaginationEllipsis = forwardRef<HTMLSpanElement, PaginationEllipsisProps>(
  function PaginationEllipsis({ className, children, ...rest }, ref) {
    const ctx = usePaginationContext(paginationContextDefaults);
    const styles = paginationVariants({ size: ctx.size });

    return (
      <span
        ref={ref}
        className={composeClassName(styles.ellipsis(), className)}
        aria-hidden="true"
        role="presentation"
        {...rest}
      >
        {children ?? "…"}
      </span>
    );
  },
);
