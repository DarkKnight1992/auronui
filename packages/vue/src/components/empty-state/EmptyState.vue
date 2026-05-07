<script setup lang="ts">
import { computed } from 'vue'
import { emptyStateVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { useEmptyStateProvide } from './empty-state.context'

const props = defineProps<{ class?: string }>()

useEmptyStateProvide({ _brand: 'EmptyState' })

const classes = computed(() => composeClassName(emptyStateVariants(), props.class))
</script>

<template>
  <div
    :class="classes"
    aria-live="polite"
  >
    <slot />
  </div>
</template>
