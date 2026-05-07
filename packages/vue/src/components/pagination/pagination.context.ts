import { computed } from 'vue'
import { createContext } from '../../utils/context'
import type { Ref } from 'vue'
import type { PaginationVariants } from '@auronui/styles'

export interface PaginationContext {
  /** Current page (numeric mode) */
  page: Ref<number>
  /** Total number of items (for calculating totalPages) */
  totalItems: Ref<number>
  /** Items per page */
  pageSize: Ref<number>
  /** Computed total page count */
  totalPages: Ref<number>
  /** Size variant */
  size: Ref<NonNullable<PaginationVariants['size']>>
  /** Pagination type */
  type: Ref<'numeric' | 'cursor'>
  /** Whether pagination is disabled */
  disabled: Ref<boolean>
  /** Cursor mode: before cursor (relay-style pagination) */
  beforeCursor: Ref<string | null>
  /** Cursor mode: after cursor (relay-style pagination) */
  afterCursor: Ref<string | null>
  /** Cursor mode: emit update:cursor */
  onCursorChange: (before: string | null, after: string | null) => void
  /** Numeric mode: emit update:page */
  onPageChange: (page: number) => void
}

export const {
  useProvide: usePaginationProvide,
  useInject: usePaginationInject,
  key: paginationContextKey,
} = createContext<PaginationContext>('Pagination')

export const paginationContextDefaults: PaginationContext = {
  page: computed(() => 1),
  totalItems: computed(() => 0),
  pageSize: computed(() => 10),
  totalPages: computed(() => 1),
  size: computed(() => 'md' as const),
  type: computed(() => 'numeric' as const),
  disabled: computed(() => false),
  beforeCursor: computed(() => null),
  afterCursor: computed(() => null),
  onPageChange: () => {},
  onCursorChange: () => {},
}

export function createPaginationContext(context: PaginationContext): PaginationContext {
  return usePaginationProvide(context)
}
