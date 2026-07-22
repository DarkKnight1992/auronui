<script setup lang="ts">
import { TooltipTrigger } from 'reka-ui'
import { tooltipVariants } from '@auronui/styles/components/tooltip'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'

const props = defineProps<{
  asChild?: boolean
  as?: string | object
  class?: ClassValue
}>()

const styles = tooltipVariants()
</script>

<template>
  <TooltipTrigger
    :as-child="props.asChild"
    :as="props.as"
    :class="composeClassName(styles.trigger(), props.class)"
    v-bind="$attrs"
  >
    <slot />
  </TooltipTrigger>
</template>
