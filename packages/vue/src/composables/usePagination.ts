import { ref, computed, type Ref, type ComputedRef } from 'vue'

export interface UsePaginationOptions {
  /** Total number of items across all pages. */
  totalItems?: number
  /** Number of items per page. Defaults to 10. */
  pageSize?: number
  /** Initial page for uncontrolled usage. Defaults to 1. */
  defaultPage?: number
}

export interface UsePaginationReturn {
  /** Reactive current page number (1-based). */
  page: Ref<number>
  /** Reactive number of items per page. */
  pageSize: Ref<number>
  /** Reactive total item count. */
  totalItems: Ref<number>
  /** Computed total number of pages. Minimum 1. */
  totalPages: ComputedRef<number>
  /** Whether the current page is the first page. */
  isFirst: ComputedRef<boolean>
  /** Whether the current page is the last page. */
  isLast: ComputedRef<boolean>
  /** Navigate to a specific page number. Clamps to valid range. */
  goToPage: (page: number) => void
  /** Navigate to the next page. No-op on last page. */
  nextPage: () => void
  /** Navigate to the previous page. No-op on first page. */
  prevPage: () => void
  /**
   * Pass as `@update:page` handler on the Pagination component.
   * Keeps `page` in sync when the component navigates internally.
   */
  onPageChange: (page: number) => void
}

/**
 * Manages pagination state for the Pagination component.
 *
 * @example
 * ```ts
 * const pagination = usePagination({ totalItems: 200, pageSize: 20 })
 * ```
 * ```html
 * <Pagination
 *   :page="pagination.page"
 *   :total-items="pagination.totalItems"
 *   :items-per-page="pagination.pageSize"
 *   @update:page="pagination.onPageChange"
 * />
 * ```
 */
export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
  const page = ref(options.defaultPage ?? 1)
  const pageSize = ref(options.pageSize ?? 10)
  const totalItems = ref(options.totalItems ?? 0)

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(totalItems.value / pageSize.value))
  )

  const isFirst = computed(() => page.value <= 1)
  const isLast = computed(() => page.value >= totalPages.value)

  function goToPage(p: number): void {
    page.value = Math.max(1, Math.min(p, totalPages.value))
  }

  function nextPage(): void {
    if (!isLast.value) goToPage(page.value + 1)
  }

  function prevPage(): void {
    if (!isFirst.value) goToPage(page.value - 1)
  }

  function onPageChange(p: number): void {
    goToPage(p)
  }

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
    onPageChange,
  }
}
