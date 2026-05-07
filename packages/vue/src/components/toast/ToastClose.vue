<script setup lang="ts">
import { ToastClose as RekaToastClose } from 'reka-ui'
import { toastVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import CloseButton from '../button/CloseButton.vue'

const props = defineProps<{
  class?: string
  ariaLabel?: string
}>()

const styles = toastVariants()
</script>

<template>
  <RekaToastClose as-child>
    <CloseButton
      size="sm"
      :aria-label="ariaLabel ?? 'Close notification'"
      :class="composeClassName(styles.close(), props.class)"
    />
  </RekaToastClose>
</template>
