import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { paginationVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { usePaginationContext, paginationContextDefaults, type PaginationRangeItem } from "./pagination.context";

export interface PaginationContentOwnProps {
  className?: ClassValue;
  /** Numeric mode render prop, receives the computed page/ellipsis range. */
  children?: ((items: PaginationRangeItem[]) => ReactNode) | ReactNode;
  /** Cursor mode: content of the "Before" button. Defaults to "Before". */
  beforeContent?: ReactNode;
  /** Cursor mode: content of the "After" button. Defaults to "After". */
  afterContent?: ReactNode;
  /** Cursor mode: page info content. Defaults to "Page {n}". */
  pageInfo?: ReactNode;
}

export type PaginationContentProps = PaginationContentOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof PaginationContentOwnProps>;

export const PaginationContent = forwardRef<HTMLDivElement, PaginationContentProps>(
  function PaginationContent({ className, children, beforeContent, afterContent, pageInfo, ...rest }, ref) {
    const ctx = usePaginationContext(paginationContextDefaults);
    const styles = paginationVariants({ size: ctx.size });

    if (ctx.type === "numeric") {
      return (
        <div ref={ref} className={composeClassName(styles.content(), className)} {...rest}>
          {typeof children === "function" ? children(ctx.range) : children}
        </div>
      );
    }

    const hasPreviousPage = ctx.beforeCursor !== null;
    const hasNextPage = ctx.afterCursor !== null;

    return (
      <div
        ref={ref}
        className={composeClassName(styles.content(), className)}
        role="group"
        aria-label="Cursor pagination"
        {...rest}
      >
        <button
          type="button"
          className={composeClassName(styles.link(), "pagination__link--nav")}
          disabled={!hasPreviousPage || ctx.disabled}
          data-disabled={!hasPreviousPage || ctx.disabled || undefined}
          aria-label="Before page"
          onClick={() => ctx.onCursorChange(ctx.beforeCursor, null)}
        >
          {beforeContent ?? "Before"}
        </button>

        <span className={styles.summary?.()}>{pageInfo ?? `Page ${ctx.page}`}</span>

        <button
          type="button"
          className={composeClassName(styles.link(), "pagination__link--nav")}
          disabled={!hasNextPage || ctx.disabled}
          data-disabled={!hasNextPage || ctx.disabled || undefined}
          aria-label="After page"
          onClick={() => ctx.onCursorChange(null, ctx.afterCursor)}
        >
          {afterContent ?? "After"}
        </button>
      </div>
    );
  },
);
