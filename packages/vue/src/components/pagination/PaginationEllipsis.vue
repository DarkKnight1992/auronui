<script setup lang="ts">
import { computed } from 'vue'
import { PaginationEllipsis } from 'reka-ui'
import { paginationVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { usePaginationInject, paginationContextDefaults } from './pagination.context'

const props = defineProps<{
  class?: string
}>()

const ctx = usePaginationInject(paginationContextDefaults)

const styles = computed(() => paginationVariants({ size: ctx.size.value }))
</script>

<template>
  <PaginationEllipsis
    :class="composeClassName(styles.ellipsis(), props.class)"
    aria-hidden="true"
    role="presentation"
  >
    <slot>&#8230;</slot>
  </PaginationEllipsis>
</template>
