import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { paginationVariants } from "@auronui/styles";
import { composeClassName, dataAttr, type ClassValue } from "../../utils";
import { usePaginationContext, paginationContextDefaults } from "./pagination.context";

export interface PaginationPrevOwnProps {
  className?: ClassValue;
  children?: ReactNode;
}

export type PaginationPrevProps = PaginationPrevOwnProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof PaginationPrevOwnProps>;

export const PaginationPrev = forwardRef<HTMLButtonElement, PaginationPrevProps>(function PaginationPrev(
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
      aria-label="Previous page"
      disabled={isDisabled}
      data-disabled={dataAttr(isDisabled)}
      onClick={() => ctx.onPageChange(ctx.page - 1)}
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
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span className="sr-only">Previous</span>
        </>
      )}
    </button>
  );
});
