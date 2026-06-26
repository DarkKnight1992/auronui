<script setup lang="ts">
import { computed } from 'vue'
import { PaginationPrev } from 'reka-ui'
import { paginationVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { usePaginationInject, paginationContextDefaults } from './pagination.context'

const props = defineProps<{
  class?: string
  /** Render as a different element */
  as?: string
  /** Merge props onto child element */
  asChild?: boolean
}>()

const ctx = usePaginationInject(paginationContextDefaults)

const styles = computed(() => paginationVariants({ size: ctx.size.value }))

// Disabled when on first page or globally disabled (T-08-04)
const isDisabled = computed(() => ctx.page.value <= 1 || ctx.disabled.value)
</script>

<template>
  <PaginationPrev
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(styles.link(), 'pagination__link--nav', props.class)"
    aria-label="Previous page"
    :disabled="isDisabled"
    :data-disabled="isDisabled || undefined"
  >
    <slot>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
      <span class="sr-only">Previous</span>
    </slot>
  </PaginationPrev>
</template>
