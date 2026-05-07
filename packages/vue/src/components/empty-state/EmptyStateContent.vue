<script setup lang="ts">
import { composeClassName } from '../../utils/composeClassName'
import { useEmptyStateInject } from './empty-state.context'

const props = defineProps<{ class?: string }>()

// Inject to confirm we're in scope; fallback allows standalone use
useEmptyStateInject({ _brand: 'EmptyState' })
</script>

<template>
  <div :class="composeClassName('empty-state__content', props.class)">
    <slot />
  </div>
</template>
