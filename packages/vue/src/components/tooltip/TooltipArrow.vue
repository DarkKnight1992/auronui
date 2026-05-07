<script setup lang="ts">
import { TooltipArrow } from 'reka-ui'
import { tooltipVariants } from '@auronui/styles/components/tooltip'
import { composeClassName } from '../../utils/composeClassName'

const props = defineProps<{
  as?: string | object
  asChild?: boolean
  width?: number
  height?: number
  class?: string
}>()

const styles = tooltipVariants()
</script>

<template>
  <TooltipArrow
    :as="props.as"
    :as-child="props.asChild"
    :width="props.width"
    :height="props.height"
    :class="composeClassName(styles.trigger(), props.class)"
    v-bind="$attrs"
  />
</template>
