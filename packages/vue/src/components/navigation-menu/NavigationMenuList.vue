<script setup lang="ts">
import { navigationMenuVariants } from '@auronui/styles'
import { NavigationMenuList } from 'reka-ui'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  class?: ClassValue
  /** Render as a different element or component. */
  as?: string
  /** Merge props onto child element instead of rendering a wrapper. */
  asChild?: boolean
}>(), {
  class: undefined,
  as: undefined,
  asChild: undefined,
})

const slotFns = navigationMenuVariants()
</script>

<template>
  <NavigationMenuList
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(slotFns.list(), props.class)"
  >
    <slot />
  </NavigationMenuList>
</template>
