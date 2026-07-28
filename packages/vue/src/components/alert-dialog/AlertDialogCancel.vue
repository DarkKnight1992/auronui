<script setup lang="ts">
import { Primitive, injectDialogRootContext, injectAlertDialogContentContext, useForwardExpose } from 'reka-ui'
import { buttonVariants, type ButtonVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { warnDeprecatedVariant } from '../../utils/warnDeprecated'
import { computed, onMounted } from 'vue'

/**
 * AlertDialogCancel — dismiss button for alert dialogs. Renders <button type="button"> by default.
 */
const props = withDefaults(defineProps<{
  /** variant — use 'bordered' for the outline style; 'outline' is @deprecated */
  variant?: 'danger' | 'danger-soft' | 'primary' | 'secondary' | 'ghost' | 'bordered' | 'outline' | 'success' | 'success-soft' | 'warning' | 'warning-soft' | 'tertiary'
  size?: ButtonVariants['size']
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

const rootContext = injectDialogRootContext()
const contentContext = injectAlertDialogContentContext()
const { forwardRef, currentElement } = useForwardExpose()

// Reka's AlertDialogContent auto-focuses the Cancel element on open (a11y
// best practice: default focus should land on the safe action, not the
// destructive one) — that wiring lives in reka's own AlertDialogCancel,
// which this component no longer delegates to (see handleClick below), so
// it's replicated here directly to avoid silently regressing that behavior.
onMounted(() => {
  contentContext.onCancelElementChange(currentElement.value)
})

// With as-child, Reka's Slot merges our onClick and the wrapped child's own
// onClick onto the same element, and OUR handler runs first — so deferring
// the actual close to a microtask lets the child's handler (which still
// runs synchronously within the same click dispatch, right after ours) call
// event.preventDefault() first if it wants to keep the dialog open (e.g.
// while an async action is in flight); the caller then closes it manually
// once that async work resolves.
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
    :ref="forwardRef"
    :as-child="props.asChild"
    :as="resolvedAs()"
    :type="resolvedAs() === 'button' ? 'button' : undefined"
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    @click="handleClick"
  >
    <slot />
  </Primitive>
</template>
