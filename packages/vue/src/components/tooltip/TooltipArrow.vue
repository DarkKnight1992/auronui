<script setup lang="ts">
import type { ClassValue } from '../../utils/composeClassName'
import { TooltipArrow } from 'reka-ui'

const props = defineProps<{
  as?: string | object
  asChild?: boolean
  width?: number
  height?: number
  class?: ClassValue
}>()
</script>

<template>
  <TooltipArrow
    :as="props.as"
    :as-child="props.asChild"
    :width="props.width"
    :height="props.height"
    data-slot="overlay-arrow"
    :class="props.class"
    v-bind="$attrs"
  />
</template>
