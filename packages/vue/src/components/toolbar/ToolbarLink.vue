<script setup lang="ts">
import { ToolbarLink as RekaToolbarLink } from 'reka-ui'
import { composeClassName } from '../../utils/composeClassName'

const props = defineProps<{
  href?: string
  class?: string
  /** Render as a different element */
  as?: string
  /** Merge props onto child element */
  asChild?: boolean
}>()
</script>

<template>
  <RekaToolbarLink
    :href="props.href"
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName('link', props.class)"
  >
    <slot />
  </RekaToolbarLink>
</template>
