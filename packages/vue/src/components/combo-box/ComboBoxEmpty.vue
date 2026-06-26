<script setup lang="ts">
import { ComboboxEmpty } from 'reka-ui'

const props = withDefaults(defineProps<{
  /** Render as a different element or component. */
  as?: string
  /** Merge props onto child element instead of rendering a wrapper. */
  asChild?: boolean
}>(), {
  as: undefined,
  asChild: false,
})
</script>

<template>
  <ComboboxEmpty
    :as="props.as"
    :as-child="props.asChild"
    class="py-3 text-center text-sm text-default-400"
    data-slot="empty-content"
  >
    <slot />
  </ComboboxEmpty>
</template>
