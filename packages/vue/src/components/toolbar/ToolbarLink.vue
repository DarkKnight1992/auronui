<script setup lang="ts">
import { safeHref } from '../../utils/safeHref'
import { ToolbarLink as RekaToolbarLink } from 'reka-ui'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'

const props = defineProps<{
  href?: string
  class?: ClassValue
  /** Render as a different element */
  as?: string
  /** Merge props onto child element */
  asChild?: boolean
}>()
</script>

<template>
  <RekaToolbarLink
    :href="safeHref(props.href)"
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName('link', props.class)"
  >
    <slot />
  </RekaToolbarLink>
</template>
