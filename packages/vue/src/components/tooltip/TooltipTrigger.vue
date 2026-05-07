<script setup lang="ts">
import { TooltipTrigger } from 'reka-ui'

const props = defineProps<{
  asChild?: boolean
  as?: string | object
}>()
</script>

<template>
  <TooltipTrigger
    :as-child="props.asChild"
    :as="props.as"
    v-bind="$attrs"
  >
    <slot />
  </TooltipTrigger>
</template>
