<script setup lang="ts">
import { ToastDescription as RekaToastDescription } from 'reka-ui'
import { toastVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'

const props = defineProps<{
  class?: string
  /** Render as a different element */
  as?: string
  /** Merge props onto child element */
  asChild?: boolean
}>()
const styles = toastVariants()
</script>

<template>
  <RekaToastDescription
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(styles.description(), props.class)"
  >
    <slot />
  </RekaToastDescription>
</template>
