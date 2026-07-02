<script setup lang="ts">
import { navigationMenuVariants } from '@auronui/styles'
import { NavigationMenuViewport } from 'reka-ui'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  /** Used to force mounting when more control is needed. */
  forceMount?: boolean
  /** Placement of the viewport relative to its trigger. @default 'center' */
  align?: 'start' | 'center' | 'end'
  /** Render as a different element or component. */
  as?: string
  /** Merge props onto child element instead of rendering a wrapper. */
  asChild?: boolean
  class?: ClassValue
}>(), {
  forceMount: undefined,
  align: undefined,
  as: undefined,
  asChild: undefined,
  class: undefined,
})

const slotFns = navigationMenuVariants()
</script>

<template>
  <div :class="slotFns.viewportWrapper()">
    <NavigationMenuViewport
      :force-mount="props.forceMount"
      :align="props.align"
      :as="props.as"
      :as-child="props.asChild"
      :class="composeClassName(slotFns.viewport(), props.class)"
    />
  </div>
</template>
