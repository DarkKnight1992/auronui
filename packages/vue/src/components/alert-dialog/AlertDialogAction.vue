<script setup lang="ts">
import { AlertDialogAction } from 'reka-ui'
import { buttonVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'

/**
 * AlertDialogAction — confirm button for destructive flows.
 *
 * Wraps reka-ui AlertDialogAction which renders <button type="button"> by default
 * (confirmed: AlertDialogAction uses DialogClose which sets type="button" when as="button").
 *
 * D-04: Do NOT override the button type — reka-ui's default `type="button"` is intentional
 * and prevents accidental form submission / Enter-key propagation.
 */
const props = withDefaults(defineProps<{
  variant?: 'danger' | 'danger-soft' | 'primary' | 'secondary' | 'ghost' | 'outline' | 'success' | 'success-soft' | 'warning' | 'warning-soft' | 'tertiary'
  size?: 'sm' | 'md' | 'lg'
  class?: string
  asChild?: boolean
}>(), {
  variant: 'danger',
  size: 'md',
  asChild: false,
})

const slotFns = buttonVariants({ variant: props.variant, size: props.size })
</script>

<template>
  <AlertDialogAction
    :as-child="props.asChild"
    :class="composeClassName(slotFns.base(), props.class)"
  >
    <slot />
  </AlertDialogAction>
</template>
