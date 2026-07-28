<script setup lang="ts">
import { Primitive, injectDialogRootContext } from 'reka-ui'
import { buttonVariants, type ButtonVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { warnDeprecatedVariant } from '../../utils/warnDeprecated'
import { computed } from 'vue'

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
  /** variant — use 'bordered' for the outline style; 'outline' is @deprecated */
  variant?: 'danger' | 'danger-soft' | 'primary' | 'secondary' | 'ghost' | 'bordered' | 'outline' | 'success' | 'success-soft' | 'warning' | 'warning-soft' | 'tertiary'
  size?: ButtonVariants['size']
  class?: ClassValue
  /** Override default classes for any slot. Keys correspond to slot names (e.g., base). */
  classNames?: Partial<{
    base: ClassValue
  }>
  asChild?: boolean
  as?: string
}>(), {
  variant: 'danger',
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
    warnDeprecatedVariant('AlertDialogAction', 'outline', 'bordered')
    return 'bordered' as ButtonVariants['variant']
  }
  return (LEGACY_VARIANTS[v] ?? v) as ButtonVariants['variant']
})

const slotFns = computed(() => buttonVariants({ variant: resolvedVariant.value, size: props.size }))

const rootContext = injectDialogRootContext()

// With as-child, Reka's Slot merges our onClick and the wrapped child's own
// onClick onto the same element, and OUR handler runs first — so deferring
// the actual close to a microtask lets the child's handler (which still
// runs synchronously within the same click dispatch, right after ours) call
// event.preventDefault() first if it wants to keep the dialog open (e.g.
// while an async destructive action is in flight, so the user gets error
// feedback before the dialog disappears); the caller then closes it
// manually once that async work resolves.
function handleClick(event: Event) {
  queueMicrotask(() => {
    if (event.defaultPrevented) return
    rootContext.onOpenChange(false)
  })
}

const resolvedAs = () => props.as ?? 'button'
</script>

<template>
  <Primitive
    :as-child="props.asChild"
    :as="resolvedAs()"
    :type="resolvedAs() === 'button' ? 'button' : undefined"
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    @click="handleClick"
  >
    <slot />
  </Primitive>
</template>
