<script setup lang="ts">
import { DialogDescription } from 'reka-ui'
import { composeClassName } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  as?: string
  asChild?: boolean
  class?: string
}>(), {
  as: 'p',
  asChild: false,
})
</script>

<template>
  <DialogDescription
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName('text-sm text-muted', props.class)"
  >
    <slot />
  </DialogDescription>
</template>
