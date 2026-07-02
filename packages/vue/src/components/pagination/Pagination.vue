<script setup lang="ts">
import { computed, toRef, type Ref } from 'vue'
import { PaginationRoot } from 'reka-ui'
import { paginationVariants, type PaginationVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { createPaginationContext } from './pagination.context'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

const props = withDefaults(defineProps<{
  /** Current page number (v-model:page) */
  page?: number
  /** Default page for uncontrolled usage */
  defaultPage?: number
  /** Number of items per page */
  itemsPerPage?: number
  /** Total number of items */
  totalItems?: number
  /** Number of sibling pages shown on each side of current page */
  siblingCount?: number
  /** Whether to show first/last page edge buttons */
  showEdges?: boolean
  /** Size variant */
  size?: PaginationVariants['size']
  /** Pagination type: 'numeric' for page numbers, 'cursor' for relay-style */
  type?: 'numeric' | 'cursor'
  /** Whether the entire pagination is disabled */
  isDisabled?: boolean
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean
  /** Cursor mode: before cursor value */
  beforeCursor?: string | null
  /** Cursor mode: after cursor value */
  afterCursor?: string | null
  /** Additional CSS class */
  class?: string
  /** Render as a different element */
  as?: string
  /** Merge props onto child element */
  asChild?: boolean
}>(), {
  page: 1,
  defaultPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  siblingCount: 2,
  showEdges: false,
  size: 'md',
  type: 'numeric',
  isDisabled: undefined,
  disabled: undefined,
  beforeCursor: null,
  afterCursor: null,
})

const emit = defineEmits<{
  'update:page': [page: number]
  'update:cursor': [before: string | null, after: string | null]
}>()

// Compute total pages — cap at 1 minimum to prevent division edge cases (T-08-03)
const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.totalItems / props.itemsPerPage))
)

// Validate page ∈ [1, totalPages] before propagating (T-08-01)
function handlePageChange(newPage: number) {
  const safePage = Math.max(1, Math.min(newPage, totalPages.value))
  emit('update:page', safePage)
}

function handleCursorChange(before: string | null, after: string | null) {
  emit('update:cursor', before, after)
}

const isDisabled = useDeprecatedBooleanProp(
  'Pagination', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)

// Provide context for all child parts
createPaginationContext({
  page: toRef(props, 'page'),
  totalItems: toRef(props, 'totalItems'),
  pageSize: toRef(props, 'itemsPerPage'),
  totalPages,
  size: toRef(props, 'size') as Ref<NonNullable<PaginationVariants['size']>>,
  type: toRef(props, 'type'),
  disabled: isDisabled,
  beforeCursor: toRef(props, 'beforeCursor'),
  afterCursor: toRef(props, 'afterCursor'),
  onPageChange: handlePageChange,
  onCursorChange: handleCursorChange,
})

const styles = computed(() => paginationVariants({ size: props.size }))
</script>

<template>
  <!--
    Numeric mode: use Reka UI PaginationRoot for full numeric pagination with ellipsis.
    Cursor mode: render a plain nav (Reka UI does not support cursor-based pagination).
  -->
  <PaginationRoot
    v-if="props.type === 'numeric'"
    :page="props.page"
    :default-page="props.defaultPage"
    :items-per-page="props.itemsPerPage"
    :total="props.totalItems"
    :sibling-count="props.siblingCount"
    :show-edges="props.showEdges"
    :disabled="isDisabled"
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(styles.base(), props.class)"
    @update:page="handlePageChange"
  >
    <slot />
  </PaginationRoot>

  <nav
    v-else
    :class="composeClassName(styles.base(), props.class)"
    aria-label="Pagination"
  >
    <slot />
  </nav>
</template>
