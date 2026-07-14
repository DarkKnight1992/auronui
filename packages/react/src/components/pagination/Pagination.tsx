import { forwardRef, useMemo, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { paginationVariants, type PaginationVariants } from "@auronui/styles";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import { PaginationProvider, getPaginationRange } from "./pagination.context";

export interface PaginationOwnProps {
  /** Current page number (controlled) */
  page?: number;
  /** Default page for uncontrolled usage */
  defaultPage?: number;
  /** Number of items per page */
  itemsPerPage?: number;
  /** Total number of items */
  totalItems?: number;
  /** Number of sibling pages shown on each side of current page */
  siblingCount?: number;
  /** Whether to show first/last page edge buttons — passed through to consumers via context-independent layout, mirrors Vue's prop for API parity. */
  showEdges?: boolean;
  /** Size variant */
  size?: PaginationVariants["size"];
  /** Pagination type: 'numeric' for page numbers, 'cursor' for relay-style */
  type?: "numeric" | "cursor";
  /** Whether the entire pagination is disabled */
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  /** Cursor mode: before cursor value */
  beforeCursor?: string | null;
  /** Cursor mode: after cursor value */
  afterCursor?: string | null;
  className?: ClassValue;
  onPageChange?: (page: number) => void;
  onCursorChange?: (before: string | null, after: string | null) => void;
  children?: ReactNode;
}

export type PaginationProps = PaginationOwnProps &
  Omit<ComponentPropsWithoutRef<"nav">, keyof PaginationOwnProps>;

export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    page = 1,
    itemsPerPage = 10,
    totalItems = 0,
    siblingCount = 2,
    size = "md",
    type = "numeric",
    isDisabled,
    disabled,
    beforeCursor = null,
    afterCursor = null,
    className,
    onPageChange,
    onCursorChange,
    children,
    ...rest
  },
  ref,
) {
  // Cap at 1 minimum to prevent division edge cases (mirrors Pagination.vue).
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const resolvedDisabled = resolveDeprecatedBooleanProp(
    "Pagination",
    "isDisabled",
    isDisabled,
    "disabled",
    disabled,
  );

  function handlePageChange(newPage: number) {
    const safePage = Math.max(1, Math.min(newPage, totalPages));
    onPageChange?.(safePage);
  }

  function handleCursorChange(before: string | null, after: string | null) {
    onCursorChange?.(before, after);
  }

  const styles = paginationVariants({ size });

  const rangeItems = useMemo(
    () => (type === "numeric" ? getPaginationRange(page, totalPages, siblingCount) : []),
    [type, page, totalPages, siblingCount],
  );

  const contextValue = {
    page,
    totalPages,
    size: size ?? "md",
    type,
    disabled: resolvedDisabled,
    beforeCursor,
    afterCursor,
    onCursorChange: handleCursorChange,
    onPageChange: handlePageChange,
    range: rangeItems,
  };

  return (
    <nav
      ref={ref}
      aria-label="Pagination"
      className={composeClassName(styles.base(), className)}
      {...rest}
    >
      <PaginationProvider value={contextValue}>{children}</PaginationProvider>
    </nav>
  );
});
