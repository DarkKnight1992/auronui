<script setup lang="ts">
import { ToastAction as RekaToastAction } from 'reka-ui'
import { toastVariants } from '@auronui/styles/components/toast'
import Button from '../button/Button.vue'
import { composeClassName } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  /** Required by Reka UI for screen reader announcements */
  altText?: string
  class?: string
  /** Render as a different element */
  as?: string
  /** Merge props onto child element */
  asChild?: boolean
}>(), {
  altText: 'Action',
})

const styles = toastVariants()
</script>

<template>
  <RekaToastAction
    as-child
    :alt-text="altText"
  >
    <Button
      size="sm"
      variant="ghost"
      :class="composeClassName(styles.action(), props.class)"
    >
      <slot />
    </Button>
  </RekaToastAction>
</template>
