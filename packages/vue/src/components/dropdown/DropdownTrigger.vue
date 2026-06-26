<script setup lang="ts">
import { DropdownMenuTrigger } from 'reka-ui'

const props = withDefaults(defineProps<{
  /** Whether the trigger is disabled. */
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
  <DropdownMenuTrigger
    :disabled="props.disabled"
    :as="props.as"
    :as-child="props.asChild"
  >
    <slot />
  </DropdownMenuTrigger>
</template>
