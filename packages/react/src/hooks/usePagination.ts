import { useCallback, useState } from "react";

export interface UsePaginationOptions {
  /** Total number of items across all pages. */
  totalItems?: number;
  /** Number of items per page. Defaults to 10. */
  pageSize?: number;
  /** Initial page for uncontrolled usage. Defaults to 1. */
  defaultPage?: number;
}

export interface UsePaginationReturn {
  /** Current page number (1-based). */
  page: number;
  /** Number of items per page. */
  pageSize: number;
  /** Total item count. */
  totalItems: number;
  /** Total number of pages. Minimum 1. */
  totalPages: number;
  /** Whether the current page is the first page. */
  isFirst: boolean;
  /** Whether the current page is the last page. */
  isLast: boolean;
  /** Navigate to a specific page number. Clamps to valid range. */
  goToPage: (page: number) => void;
  /** Navigate to the next page. No-op on last page. */
  nextPage: () => void;
  /** Navigate to the previous page. No-op on first page. */
  prevPage: () => void;
  /** Update the page size directly. */
  setPageSize: (size: number) => void;
  /** Update the total item count directly (e.g. after a list refetch). */
  setTotalItems: (count: number) => void;
  /**
   * Pass as the `onPageChange` handler on the Pagination component.
   * Keeps `page` in sync when the component navigates internally.
   */
  onPageChange: (page: number) => void;
}

/**
 * Manages pagination state for the Pagination component.
 *
 * @example
 * ```tsx
 * const pagination = usePagination({ totalItems: 200, pageSize: 20 })
 * ```
 * ```tsx
 * <Pagination
 *   page={pagination.page}
 *   totalItems={pagination.totalItems}
 *   itemsPerPage={pagination.pageSize}
 *   onPageChange={pagination.onPageChange}
 * />
 * ```
 */
export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
  const [page, setPage] = useState(options.defaultPage ?? 1);
  const [pageSize, setPageSize] = useState(options.pageSize ?? 10);
  const [totalItems, setTotalItems] = useState(options.totalItems ?? 0);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  const goToPage = useCallback(
    (p: number): void => {
      setPage((_prev) => Math.max(1, Math.min(p, totalPages)));
    },
    [totalPages],
  );

  const nextPage = useCallback((): void => {
    if (!isLast) goToPage(page + 1);
  }, [isLast, goToPage, page]);

  const prevPage = useCallback((): void => {
    if (!isFirst) goToPage(page - 1);
  }, [isFirst, goToPage, page]);

  const onPageChange = useCallback(
    (p: number): void => {
      goToPage(p);
    },
    [goToPage],
  );

  return {
    page,
    pageSize,
    totalItems,
    totalPages,
    isFirst,
    isLast,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
    setTotalItems,
    onPageChange,
  };
}
