<script setup lang="ts">
import { AlertDialogCancel } from 'reka-ui'
import { buttonVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'

/**
 * AlertDialogCancel — dismiss button for alert dialogs.
 * Wraps reka-ui AlertDialogCancel which renders <button type="button"> by default.
 */
const props = withDefaults(defineProps<{
  variant?: 'danger' | 'danger-soft' | 'primary' | 'secondary' | 'ghost' | 'outline' | 'success' | 'success-soft' | 'warning' | 'warning-soft' | 'tertiary'
  size?: 'sm' | 'md' | 'lg'
  class?: ClassValue
  /** Per-slot class name overrides */
  classNames?: Partial<{ base: ClassValue }>
  asChild?: boolean
}>(), {
  variant: 'secondary',
  size: 'md',
  asChild: false,
})

const slotFns = buttonVariants({ variant: props.variant, size: props.size })
</script>

<template>
  <AlertDialogCancel
    :as-child="props.asChild"
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
  >
    <slot />
  </AlertDialogCancel>
</template>
