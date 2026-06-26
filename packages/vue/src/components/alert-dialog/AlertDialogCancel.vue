<script setup lang="ts">
import { AlertDialogCancel } from 'reka-ui'
import { buttonVariants, type ButtonVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { warnDeprecatedVariant } from '../../utils/warnDeprecated'
import { computed } from 'vue'

/**
 * AlertDialogCancel — dismiss button for alert dialogs.
 * Wraps reka-ui AlertDialogCancel which renders <button type="button"> by default.
 */
const props = withDefaults(defineProps<{
  /** variant — use 'bordered' for the outline style; 'outline' is @deprecated */
  variant?: 'danger' | 'danger-soft' | 'primary' | 'secondary' | 'ghost' | 'bordered' | 'outline' | 'success' | 'success-soft' | 'warning' | 'warning-soft' | 'tertiary'
  size?: 'sm' | 'md' | 'lg'
  class?: ClassValue
  /** Per-slot class name overrides */
  classNames?: Partial<{ base: ClassValue }>
  asChild?: boolean
  as?: string
}>(), {
  variant: 'secondary',
  size: 'md',
  asChild: false,
})

// Map legacy variant names to buttonVariants-compatible variants
const LEGACY_VARIANTS: Record<string, ButtonVariants['variant']> = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'secondary',
  danger: 'danger',
  'danger-soft': 'danger-soft',
  success: 'success',
  'success-soft': 'success-soft',
  warning: 'warning',
  'warning-soft': 'warning-soft',
  ghost: 'ghost',
  bordered: 'bordered',
}

const resolvedVariant = computed(() => {
  const v = props.variant
  if (!v) return v
  if (v === 'outline') {
    warnDeprecatedVariant('AlertDialogCancel', 'outline', 'bordered')
    return 'bordered' as ButtonVariants['variant']
  }
  return (LEGACY_VARIANTS[v] ?? v) as ButtonVariants['variant']
})

const slotFns = computed(() => buttonVariants({ variant: resolvedVariant.value, size: props.size }))
</script>

<template>
  <AlertDialogCancel
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
  >
    <slot />
  </AlertDialogCancel>
</template>
