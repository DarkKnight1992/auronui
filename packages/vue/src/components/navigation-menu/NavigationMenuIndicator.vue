<script setup lang="ts">
import { navigationMenuVariants } from '@auronui/styles'
import { NavigationMenuIndicator } from 'reka-ui'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  /** Used to force mounting when more control is needed. */
  forceMount?: boolean
  /** Render as a different element or component. */
  as?: string
  /** Merge props onto child element instead of rendering a wrapper. */
  asChild?: boolean
  class?: ClassValue
}>(), {
  forceMount: undefined,
  as: undefined,
  asChild: undefined,
  class: undefined,
})

const slotFns = navigationMenuVariants()
</script>

<template>
  <NavigationMenuIndicator
    :force-mount="props.forceMount"
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(slotFns.indicator(), props.class)"
  >
    <div :class="slotFns.indicatorArrow()" />
  </NavigationMenuIndicator>
</template>
