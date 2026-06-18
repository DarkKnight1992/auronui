<script setup lang="ts">
import { computed } from 'vue'
import { useId } from 'vue'
import {
  NumberFieldRoot,
  NumberFieldInput,
  NumberFieldIncrement,
  NumberFieldDecrement,
} from 'reka-ui'
import { numberFieldVariants, type NumberFieldVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  variant?: NumberFieldVariants['variant']
  size?: NumberFieldVariants['size']
  color?: NumberFieldVariants['color']
  fullWidth?: boolean
  isInvalid?: boolean
  isDisabled?: boolean
  isReadonly?: boolean
  min?: number
  max?: number
  step?: number
  formatOptions?: Intl.NumberFormatOptions
  locale?: string
  name?: string
  id?: string
  placeholder?: string
  label?: string
  // camelCase prop; in templates users write aria-label="…" (Vue auto-converts)
  ariaLabel?: string
  class?: string
  /** Per-slot classNames override object for custom styling */
  classNames?: Partial<{
    base: string
    group: string
    decrementButton: string
    input: string
    incrementButton: string
  }>
}>(), {
  variant: 'flat',
  size: 'md',
  color: 'default',
  fullWidth: false,
  isInvalid: false,
  isDisabled: false,
  isReadonly: false,
  step: 1,
  min: undefined,
  max: undefined,
  formatOptions: undefined,
  locale: undefined,
  label: undefined,
  ariaLabel: undefined,
})

const modelValue = defineModel<number | undefined>()

const slotFns = computed(() =>
  numberFieldVariants({
    variant: props.variant,
    size: props.size,
    color: props.color,
    fullWidth: props.fullWidth,
    isInvalid: props.isInvalid,
    isDisabled: props.isDisabled,
    isReadonly: props.isReadonly,
  })
)

// Generate a stable id for the input element.
// NumberFieldRoot forwards this id to the underlying <input> via context.
// We use this to wire a <label for="inputId"> which is axe-safe regardless
// of how Reka UI handles attr forwarding through its Primitive component.
const generatedInputId = useId()
// Use caller-provided id if given, otherwise our generated id.
const resolvedInputId = computed(() => props.id ?? generatedInputId)

// Whether to show a label element (visible or sr-only).
const hasLabel = computed(() => !!(props.label || props.ariaLabel))
// When only ariaLabel is given (no visible label), the label is sr-only.
const isLabelVisible = computed(() => !!props.label)
</script>

<template>
  <NumberFieldRoot
    :id="resolvedInputId"
    v-model="modelValue"
    :min="props.min"
    :max="props.max"
    :step="props.step"
    :disabled="props.isDisabled || undefined"
    :readonly="props.isReadonly || undefined"
    :format-options="props.formatOptions"
    :locale="props.locale"
    :name="props.name"
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    :data-invalid="props.isInvalid || undefined"
    :data-disabled="props.isDisabled || undefined"
    :data-readonly="props.isReadonly || undefined"
  >
    <!--
      Label element — always rendered when `label` or `aria-label` is provided.
      When only `aria-label` is given (no visible label) the element is sr-only.
      Uses label[for=resolvedInputId] to wire to the Reka UI input element —
      this is axe-safe because NumberFieldRoot forwards its `id` prop directly
      to the underlying <input> via context, making label[for] reliable even
      though custom attrs passed to NumberFieldInput don't reach the DOM input.
    -->
    <label
      v-if="hasLabel"
      :for="resolvedInputId"
      :class="isLabelVisible ? undefined : 'sr-only'"
      data-slot="label"
    >{{ props.label || props.ariaLabel }}</label>

    <!-- Number field control group -->
    <div
      :class="composeClassName(slotFns.group(), props.classNames?.group)"
      data-slot="group"
    >
      <NumberFieldDecrement :class="composeClassName(slotFns.decrementButton(), props.classNames?.decrementButton)">
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          data-slot="number-field-decrement-button-icon"
        >
          <path d="M5 12h14" />
        </svg>
      </NumberFieldDecrement>

      <NumberFieldInput
        :class="composeClassName(slotFns.input(), props.classNames?.input)"
        :placeholder="props.placeholder"
      />

      <NumberFieldIncrement :class="composeClassName(slotFns.incrementButton(), props.classNames?.incrementButton)">
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          data-slot="number-field-increment-button-icon"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
      </NumberFieldIncrement>
    </div>
  </NumberFieldRoot>
</template>
