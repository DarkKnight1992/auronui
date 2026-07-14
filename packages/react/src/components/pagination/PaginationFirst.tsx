import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { paginationVariants } from "@auronui/styles";
import { composeClassName, dataAttr, type ClassValue } from "../../utils";
import { usePaginationContext, paginationContextDefaults } from "./pagination.context";

export interface PaginationFirstOwnProps {
  className?: ClassValue;
  children?: ReactNode;
}

export type PaginationFirstProps = PaginationFirstOwnProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof PaginationFirstOwnProps>;

export const PaginationFirst = forwardRef<HTMLButtonElement, PaginationFirstProps>(function PaginationFirst(
  { className, children, ...rest },
  ref,
) {
  const ctx = usePaginationContext(paginationContextDefaults);
  const styles = paginationVariants({ size: ctx.size });
  const isDisabled = ctx.page <= 1 || ctx.disabled;

  return (
    <button
      ref={ref}
      type="button"
      className={composeClassName(styles.link(), "pagination__link--nav", className)}
      aria-label="Go to first page"
      disabled={isDisabled}
      data-disabled={dataAttr(isDisabled)}
      onClick={() => ctx.onPageChange(1)}
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
            <path d="m11 17-5-5 5-5" />
            <path d="m18 17-5-5 5-5" />
          </svg>
          <span className="sr-only">First</span>
        </>
      )}
    </button>
  );
});
