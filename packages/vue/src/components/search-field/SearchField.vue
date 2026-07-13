<!--
  SearchField — dedicated search/filter input. Mirrors Input's anatomy,
  prop surface, a11y contract, and CSS classes (reuses .input/.input__*
  wholesale — no new stylesheet needed) but specializes it for search:
  fixed type="search", a built-in magnifying-glass icon (overridable via
  #startContent), and a clear button that's on by default and also
  responds to Escape.

  See Input.vue's header comment for the full anatomy/a11y contract this
  mirrors. Differences from Input:
    • type is fixed to "search", not a prop.
    • isClearable defaults to true (Input defaults to false).
    • Escape clears the field (in addition to the visible × button).
    • No password toggle (not applicable to a search field).

  ─── Emits ─────────────────────────────────────────────────────────────
    @clear -- emitted when the value is cleared, via the × button or Escape.
-->
<script setup lang="ts">
import { computed, nextTick, useAttrs, useId, useTemplateRef } from 'vue'
import { inputVariants, type InputVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'
import { useFormField } from '../../composables/useFormField'
import FieldLabel from '../_shared/FieldLabel.vue'
import FormFieldHelper from '../_shared/FormFieldHelper.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<Props>(), {
  variant: 'flat',
  size: 'md',
  color: 'default',
  labelPlacement: 'inside',
  fullWidth: false,
  isInvalid: false,
  isDisabled: false,
  isReadOnly: false,
  isRequired: false,
  isClearable: true,
})

const emit = defineEmits<{
  /** Fired when the value is cleared, via the × button or Escape. */
  clear: []
}>()

const modelValue = defineModel<string>({ default: '' })

type Props = {
  /** Visual style of the field. @default 'flat' */
  variant?: InputVariants['variant']
  /** Field height. @default 'md' */
  size?: InputVariants['size']
  /** Accent color applied to focus ring + floating label. @default 'default' */
  color?: InputVariants['color']
  /** Where the `label` is rendered relative to the field. @default 'inside' */
  labelPlacement?: InputVariants['labelPlacement']
  /** Stretches root wrapper to 100% width. @default false */
  fullWidth?: boolean
  /** Marks the field as invalid. Triggers danger styling and enables `errorMessage`. @default false */
  isInvalid?: boolean
  /** Disables the field. @default false */
  isDisabled?: boolean
  /** Makes the field read-only. @default false */
  isReadOnly?: boolean
  /** Adds a required asterisk next to the label and the `required` attribute on the input. @default false */
  isRequired?: boolean
  /** Shows the × clear button once the value is non-empty. @default true */
  isClearable?: boolean
  /** Placeholder shown when empty. */
  placeholder?: string
  /** Form field name, for native form submission. */
  name?: string
  /** Field label. When omitted, the floating-label behavior is skipped. */
  label?: string
  /** Helper text displayed below the field. Suppressed when `isInvalid && errorMessage` is shown. */
  description?: string
  /** Error text displayed below the field. Only rendered when `isInvalid` is also true. Takes precedence over `description`. */
  errorMessage?: string
  /** Extra classes merged onto the root wrapper via `composeClassName`. */
  class?: ClassValue
  /**
   * Per-slot class overrides. Available slots: `base`, `mainWrapper`,
   * `inputWrapper`, `input`, `label`, `startContent`, `endContent`,
   * `clearButton`, `helperWrapper`, `description`, `errorMessage`.
   */
  classNames?: Partial<{
    base: ClassValue
    mainWrapper: ClassValue
    inputWrapper: ClassValue
    input: ClassValue
    label: ClassValue
    startContent: ClassValue
    endContent: ClassValue
    clearButton: ClassValue
    helperWrapper: ClassValue
    description: ClassValue
    errorMessage: ClassValue
  }>
}

const attrs = useAttrs()
const generatedId = useId()
const inputId = computed(() => (attrs.id as string | undefined) ?? generatedId)
const inputAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([k]) => k !== 'id'))
)

const inputEl = useTemplateRef<HTMLInputElement>('inputEl')

const isFilled = computed(() => modelValue.value !== '')

const {
  descriptionId,
  errorMessageId,
  showError,
  showDescription,
  hasHelper,
  ariaDescribedBy,
  hasLabel,
  showOutsideLabel,
  showInsideLabel,
  rootDataAttrs,
} = useFormField({
  fieldId: () => inputId.value,
  label: () => props.label,
  description: () => props.description,
  errorMessage: () => props.errorMessage,
  isInvalid: () => props.isInvalid,
  isDisabled: () => props.isDisabled,
  isReadOnly: () => props.isReadOnly,
  isRequired: () => props.isRequired,
  labelPlacement: () => props.labelPlacement,
})

const isInteractive = computed(() => !props.isDisabled && !props.isReadOnly)
const showClearButton = computed(
  () => props.isClearable && isFilled.value && isInteractive.value,
)

function handleClear() {
  modelValue.value = ''
  emit('clear')
  nextTick(() => inputEl.value?.focus())
}

function handleKeydown(ev: KeyboardEvent) {
  if (ev.key === 'Escape' && showClearButton.value) {
    ev.stopPropagation()
    handleClear()
  }
}

const slotFns = computed(() =>
  inputVariants({
    variant: props.variant,
    size: props.size,
    color: props.color,
    fullWidth: props.fullWidth,
    isInvalid: props.isInvalid,
    isDisabled: props.isDisabled,
    isReadonly: props.isReadOnly,
    hasLabel: hasLabel.value,
    labelPlacement: props.labelPlacement,
  }),
)
</script>

<template>
  <div
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    v-bind="rootDataAttrs"
  >
    <FieldLabel
      v-if="showOutsideLabel"
      :for="inputId"
      :label="label"
      :is-required="isRequired"
      :class="composeClassName(slotFns.label(), props.classNames?.label)"
    />

    <div :class="composeClassName(slotFns.mainWrapper(), props.classNames?.mainWrapper)">
      <div
        :class="composeClassName(slotFns.inputWrapper(), props.classNames?.inputWrapper)"
        :data-filled="hasLabel ? (isFilled || undefined) : undefined"
      >
        <FieldLabel
          v-if="showInsideLabel"
          :for="inputId"
          :label="label"
          :is-required="isRequired"
          :class="composeClassName(slotFns.label(), props.classNames?.label)"
        />
        <span
          :class="composeClassName(slotFns.startContent(), props.classNames?.startContent)"
        >
          <slot name="startContent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle
                cx="11"
                cy="11"
                r="8"
              />
              <line
                x1="21"
                y1="21"
                x2="16.65"
                y2="16.65"
              />
            </svg>
          </slot>
        </span>
        <input
          v-bind="inputAttrs"
          :id="inputId"
          ref="inputEl"
          v-model="modelValue"
          type="search"
          :placeholder="placeholder"
          :name="name"
          :disabled="isDisabled || undefined"
          :readonly="isReadOnly || undefined"
          :required="isRequired || undefined"
          :aria-invalid="isInvalid || undefined"
          :aria-describedby="ariaDescribedBy"
          :class="composeClassName(slotFns.input(), props.classNames?.input)"
          @keydown="handleKeydown"
        >
        <span
          v-if="$slots.endContent"
          :class="composeClassName(slotFns.endContent(), props.classNames?.endContent)"
        >
          <slot name="endContent" />
        </span>
        <button
          v-if="showClearButton"
          type="button"
          tabindex="-1"
          :class="composeClassName(slotFns.clearButton(), props.classNames?.clearButton)"
          aria-label="Clear search"
          @click="handleClear"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
            />
            <line
              x1="15"
              y1="9"
              x2="9"
              y2="15"
            />
            <line
              x1="9"
              y1="9"
              x2="15"
              y2="15"
            />
          </svg>
        </button>
      </div>

      <FormFieldHelper
        :has-helper="hasHelper"
        :show-error="showError"
        :show-description="showDescription"
        :error-message="errorMessage"
        :description="description"
        :error-message-id="errorMessageId"
        :description-id="descriptionId"
        :wrapper-class="composeClassName(slotFns.helperWrapper(), props.classNames?.helperWrapper)"
        :error-class="composeClassName(slotFns.errorMessage(), props.classNames?.errorMessage)"
        :description-class="composeClassName(slotFns.description(), props.classNames?.description)"
      />
    </div>
  </div>
</template>
