import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { paginationVariants } from "@auronui/styles";
import { composeClassName, dataAttr, type ClassValue } from "../../utils";
import { usePaginationContext, paginationContextDefaults } from "./pagination.context";

export interface PaginationLastOwnProps {
  className?: ClassValue;
  children?: ReactNode;
}

export type PaginationLastProps = PaginationLastOwnProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof PaginationLastOwnProps>;

export const PaginationLast = forwardRef<HTMLButtonElement, PaginationLastProps>(function PaginationLast(
  { className, children, ...rest },
  ref,
) {
  const ctx = usePaginationContext(paginationContextDefaults);
  const styles = paginationVariants({ size: ctx.size });
  const isDisabled = ctx.page >= ctx.totalPages || ctx.disabled;

  return (
    <button
      ref={ref}
      type="button"
      className={composeClassName(styles.link(), "pagination__link--nav", className)}
      aria-label="Go to last page"
      disabled={isDisabled}
      data-disabled={dataAttr(isDisabled)}
      onClick={() => ctx.onPageChange(ctx.totalPages)}
      {...rest}
    >
      {children ?? (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m6 17 5-5-5-5" />
            <path d="m13 17 5-5-5-5" />
          </svg>
          <span className="sr-only">Last</span>
        </>
      )}
    </button>
  );
});
