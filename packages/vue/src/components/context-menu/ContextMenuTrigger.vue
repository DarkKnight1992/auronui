<script setup lang="ts">
import { ContextMenuTrigger } from 'reka-ui'

const props = withDefaults(defineProps<{
  /** When true, the context menu does not open on right-click — the native browser context menu is restored. */
  disabled?: boolean
  /** Render as a different element or component. */
  as?: string
  /** Merge props onto child element instead of rendering a wrapper. */
  asChild?: boolean
}>(), {
  disabled: undefined,
  as: undefined,
  asChild: true,
})
</script>

<template>
  <ContextMenuTrigger
    :disabled="props.disabled"
    :as="props.as"
    :as-child="props.asChild"
  >
    <slot />
  </ContextMenuTrigger>
</template>
