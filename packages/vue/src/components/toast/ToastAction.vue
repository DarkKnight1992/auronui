<script setup lang="ts">
import { ToastAction as RekaToastAction } from 'reka-ui'
import Button from '../button/Button.vue'

const props = withDefaults(defineProps<{
  /** Required by Reka UI for screen reader announcements */
  altText?: string
  class?: string
}>(), {
  altText: 'Action',
})
</script>

<template>
  <RekaToastAction
    as-child
    :alt-text="altText"
  >
    <Button
      size="sm"
      variant="ghost"
      :class="props.class"
    >
      <slot />
    </Button>
  </RekaToastAction>
</template>
