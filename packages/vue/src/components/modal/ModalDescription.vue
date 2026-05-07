<script setup lang="ts">
import { DialogDescription } from 'reka-ui'
import { composeClassName } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  as?: string
  class?: string
}>(), {
  as: 'p',
})
</script>

<template>
  <DialogDescription
    :as="props.as"
    :class="composeClassName('text-sm text-muted', props.class)"
  >
    <slot />
  </DialogDescription>
</template>
