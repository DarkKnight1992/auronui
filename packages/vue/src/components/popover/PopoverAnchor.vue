<script setup lang="ts">
import { PopoverAnchor } from 'reka-ui'

const props = defineProps<{
  as?: string | object
  asChild?: boolean
}>()
</script>

<template>
  <PopoverAnchor
    :as="props.as"
    :as-child="props.asChild"
    v-bind="$attrs"
  >
    <slot />
  </PopoverAnchor>
</template>
