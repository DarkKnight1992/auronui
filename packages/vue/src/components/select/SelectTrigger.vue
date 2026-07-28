<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { SelectTrigger, SelectIcon, injectSelectRootContext } from 'reka-ui'
import { useSelectInject } from './Select.context'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'
import FieldLabel from '../_shared/FieldLabel.vue'

const props = withDefaults(defineProps<{
  class?: string
  /** Whether the trigger is disabled. */
  isDisabled?: boolean
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean
  /** Virtual or DOM reference element to position against. */
  reference?: object | null
  /** Render as a different element or component. */
  as?: string
  /** Merge props onto child element instead of rendering a wrapper. */
  asChild?: boolean
  /** Per-slot class overrides */
  classNames?: Partial<{
    trigger: ClassValue
    label: ClassValue
    startContent: ClassValue
    indicator: ClassValue
  }>
}>(), {
  class: undefined,
  isDisabled: undefined,
  disabled: undefined,
  reference: undefined,
  as: undefined,
  asChild: false,
})

const isDisabled = useDeprecatedBooleanProp(
  'SelectTrigger', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)

const ctx = useSelectInject()
const rootContext = injectSelectRootContext()

const isFilled = computed(() => {
  const v = rootContext?.modelValue?.value
  if (v == null) return false
  if (Array.isArray(v)) return v.length > 0
  return v !== ''
})

const showInsideLabel = computed(
  () => ctx.hasLabel.value && ctx.labelPlacement.value === 'inside',
)

// Guard re-open when Reka returns focus to the trigger after close (value
// selection, Escape, Tab). Set to true whenever open transitions true→false,
// reset after a microtask once the focus-return event has been processed.
const skipNextFocus = ref(false)

// flush:'sync' fires the moment open.value changes (synchronously, before any
// Vue scheduling), so skipNextFocus is true before Reka's FocusScope can call
// trigger.focus(). setTimeout defers the reset until after all pending
// microtasks (render + focus-return) have flushed.
watch(() => rootContext.open.value, (open, wasOpen) => {
  if (!open && wasOpen) {
    skipNextFocus.value = true
    setTimeout(() => { skipNextFocus.value = false }, 0)
  }
}, { flush: 'sync' })

function handleFocus(event: FocusEvent) {
  if (ctx.isDisabled.value || ctx.isReadonly.value || skipNextFocus.value || rootContext.open.value) return
  // Only open for a genuine keyboard-driven focus (e.g. Tab into the field).
  // Without this check, a Dialog auto-focusing this trigger as its first
  // focusable descendant on open (standard, correct dialog a11y behavior)
  // would silently open the dropdown too — the user's first real click then
  // toggles it closed instead of opening it. Mouse clicks open the dropdown
  // via Reka's own built-in trigger click handling, unaffected by this guard.
  const target = event.target as HTMLElement | null
  if (!target?.matches(':focus-visible')) return
  rootContext.onOpenChange(true)
}
</script>

<template>
  <SelectTrigger
    :id="ctx.triggerId.value"
    :class="composeClassName(ctx.slots.value.trigger(), props.classNames?.trigger)"
    :data-filled="isFilled || undefined"
    :data-invalid="ctx.isInvalid.value || undefined"
    :data-readonly="ctx.isReadonly.value || undefined"
    :aria-invalid="ctx.isInvalid.value || undefined"
    :aria-describedby="ctx.ariaDescribedBy.value"
    :disabled="isDisabled"
    :reference="(props.reference as any)"
    :as="props.as"
    :as-child="props.asChild"
    data-slot="trigger"
    @focus="handleFocus"
  >
    <FieldLabel
      v-if="showInsideLabel"
      :for="ctx.triggerId.value"
      :label="ctx.label.value"
      :is-required="ctx.isRequired.value"
      :class="composeClassName(ctx.slots.value.label(), props.classNames?.label)"
    />
    <span
      v-if="$slots.startContent"
      :class="composeClassName(ctx.slots.value.startContent(), props.classNames?.startContent)"
      data-slot="start-content"
    >
      <slot name="startContent" />
    </span>
    <slot />
    <SelectIcon
      :class="composeClassName(ctx.slots.value.indicator(), props.classNames?.indicator)"
      data-slot="select-default-indicator"
    >
      <slot name="selectorIcon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </slot>
    </SelectIcon>
  </SelectTrigger>
</template>
