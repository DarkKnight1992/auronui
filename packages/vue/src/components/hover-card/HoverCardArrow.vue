<script setup lang="ts">
import { HoverCardArrow } from 'reka-ui'

const props = defineProps<{
  as?: string | object
  asChild?: boolean
  width?: number
  height?: number
  class?: string
}>()
</script>

<template>
  <HoverCardArrow
    :as="props.as"
    :as-child="props.asChild"
    :width="props.width"
    :height="props.height"
    :class="props.class"
    v-bind="$attrs"
  />
</template>
