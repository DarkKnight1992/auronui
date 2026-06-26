<script setup lang="ts">
import { computed } from 'vue'
import { PaginationListItem } from 'reka-ui'
import { paginationVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { usePaginationInject, paginationContextDefaults } from './pagination.context'

const props = defineProps<{
  /** Page number this item represents */
  value: number
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
  <span :class="composeClassName(styles.item(), props.class)">
    <PaginationListItem
      :value="props.value"
      :as="props.as"
      :as-child="props.asChild"
      :class="styles.link()"
    >
      <slot>{{ props.value }}</slot>
    </PaginationListItem>
  </span>
</template>
