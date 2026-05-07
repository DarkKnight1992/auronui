<script setup lang="ts">
import { ToolbarLink as RekaToolbarLink } from 'reka-ui'
import { composeClassName } from '../../utils/composeClassName'

const props = defineProps<{
  href?: string
  class?: string
}>()
</script>

<template>
  <RekaToolbarLink
    :href="props.href"
    :class="composeClassName('link', props.class)"
  >
    <slot />
  </RekaToolbarLink>
</template>
