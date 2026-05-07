<script setup lang="ts">
import { computed } from 'vue'
import { PaginationNext } from 'reka-ui'
import { paginationVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { usePaginationInject, paginationContextDefaults } from './pagination.context'

const props = defineProps<{
  class?: string
}>()

const ctx = usePaginationInject(paginationContextDefaults)

const styles = computed(() => paginationVariants({ size: ctx.size.value }))

// Disabled when on last page or globally disabled (T-08-04)
const isDisabled = computed(() => ctx.page.value >= ctx.totalPages.value || ctx.disabled.value)
</script>

<template>
  <PaginationNext
    :class="composeClassName(styles.link(), 'pagination__link--nav', props.class)"
    aria-label="Next page"
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
        <path d="m9 18 6-6-6-6" />
      </svg>
      <span class="sr-only">Next</span>
    </slot>
  </PaginationNext>
</template>
