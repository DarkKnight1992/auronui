<script setup lang="ts">
import { computed } from 'vue'
import { ToastClose as RekaToastClose } from 'reka-ui'
import { toastVariants } from '@auronui/styles'
import type { ButtonVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import CloseButton from '../button/CloseButton.vue'
import { useToastInject } from './toast.context'

const props = defineProps<{
  class?: string
  ariaLabel?: string
  /** Render as a different element */
  as?: string
  /** Merge props onto child element */
  asChild?: boolean
}>()

const styles = toastVariants()

const ctx = useToastInject({ variant: computed(() => 'default') })
const color = computed(() => ctx.variant.value as ButtonVariants['color'])
</script>

<template>
  <RekaToastClose as-child>
    <CloseButton
      size="sm"
      :color="color"
      :aria-label="ariaLabel ?? 'Close notification'"
      :class="composeClassName(styles.close(), props.class)"
    />
  </RekaToastClose>
</template>
