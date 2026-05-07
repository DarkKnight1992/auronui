<script setup lang="ts">
import { TooltipProvider } from 'reka-ui'

const props = withDefaults(defineProps<{
  delayDuration?: number
  skipDelayDuration?: number
  disableHoverableContent?: boolean
}>(), {
  delayDuration: 700,
  skipDelayDuration: 300,
  disableHoverableContent: false,
})
</script>

<template>
  <TooltipProvider
    :delay-duration="props.delayDuration"
    :skip-delay-duration="props.skipDelayDuration"
    :disable-hoverable-content="props.disableHoverableContent"
  >
    <slot />
  </TooltipProvider>
</template>
