import type { PaginationVariants } from "@auronui/styles";
import { createStrictContext } from "../../utils";

export type PaginationRangeItem = { type: "page"; value: number } | { type: "ellipsis" };

export interface PaginationContext {
  /** Current page (numeric mode) */
  page: number;
  /** Computed total page count */
  totalPages: number;
  /** Size variant */
  size: NonNullable<PaginationVariants["size"]>;
  /** Pagination type */
  type: "numeric" | "cursor";
  /** Whether pagination is disabled */
  disabled: boolean;
  /** Cursor mode: before cursor (relay-style pagination) */
  beforeCursor: string | null;
  /** Cursor mode: after cursor (relay-style pagination) */
  afterCursor: string | null;
  /** Cursor mode: fire the cursor-change handler */
  onCursorChange: (before: string | null, after: string | null) => void;
  /** Numeric mode: fire the page-change handler */
  onPageChange: (page: number) => void;
  /** Numeric mode: the computed page/ellipsis range, respecting siblingCount/showEdges */
  range: PaginationRangeItem[];
}

export const paginationContextDefaults: PaginationContext = {
  page: 1,
  totalPages: 1,
  size: "md",
  type: "numeric",
  disabled: false,
  beforeCursor: null,
  afterCursor: null,
  onCursorChange: () => {},
  onPageChange: () => {},
  range: [],
};

export const { Provider: PaginationProvider, useStrictContext: usePaginationContext } =
  createStrictContext<PaginationContext>("Pagination");

function range(start: number, end: number): number[] {
  const len = end - start + 1;
  return Array.from({ length: len }, (_, i) => start + i);
}

/**
 * Computes the numeric page range with ellipsis markers, standard
 * "siblingCount + boundary" pagination algorithm — replicates what
 * reka-ui's PaginationList exposes via its `items` slot prop in the Vue
 * package, since @auronui/react doesn't depend on reka-ui/react-aria for
 * this plain presentational component.
 */
export function getPaginationRange(
  page: number,
  totalPages: number,
  siblingCount: number,
): PaginationRangeItem[] {
  const totalPageNumbers = siblingCount * 2 + 5;

  if (totalPageNumbers >= totalPages) {
    return range(1, totalPages).map((value) => ({ type: "page", value }) as const);
  }

  const leftSiblingIndex = Math.max(page - siblingCount, 1);
  const rightSiblingIndex = Math.min(page + siblingCount, totalPages);

  const shouldShowLeftEllipsis = leftSiblingIndex > 2;
  const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  const toPages = (values: number[]): PaginationRangeItem[] =>
    values.map((value) => ({ type: "page", value }) as const);

  if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    const leftItemCount = 3 + 2 * siblingCount;
    return [...toPages(range(1, leftItemCount)), { type: "ellipsis" }, { type: "page", value: totalPages }];
  }

  if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
    const rightItemCount = 3 + 2 * siblingCount;
    return [
      { type: "page", value: firstPageIndex },
      { type: "ellipsis" },
      ...toPages(range(totalPages - rightItemCount + 1, totalPages)),
    ];
  }

  return [
    { type: "page", value: firstPageIndex },
    { type: "ellipsis" },
    ...toPages(range(leftSiblingIndex, rightSiblingIndex)),
    { type: "ellipsis" },
    { type: "page", value: lastPageIndex },
  ];
}
