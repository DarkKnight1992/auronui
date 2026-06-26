<script setup lang="ts">
import { computed } from 'vue'
import { PaginationEllipsis } from 'reka-ui'
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
</script>

<template>
  <PaginationEllipsis
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(styles.ellipsis(), props.class)"
    aria-hidden="true"
    role="presentation"
  >
    <slot>&#8230;</slot>
  </PaginationEllipsis>
</template>
