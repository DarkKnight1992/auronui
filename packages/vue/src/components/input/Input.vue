<!--
  Input — reference form-field component for @auronui/vue.

  This is the canonical template for every form field in the library
  (Textarea, NumberInput, DateInput, Select, etc.). Porting a new field
  means mirroring its prop surface, slot layout, data-attribute contract,
  CSS selector pairing, and a11y wiring. Keep these in sync.

  ─── Anatomy ────────────────────────────────────────────────────────────
    base (.input-root)                         ← layout container, carries class/data-attrs
      label [outside | outside-left]           ← rendered here when placement !== 'inside'
      mainWrapper (.input__main-wrapper)       ← groups field + helper vertically
        inputWrapper (.input)                  ← styled field box (border, bg, focus)
          label [inside]                       ← rendered here when placement === 'inside'
          startContent (.input__start-content) ← leading icon slot
          <input ref="inputEl">                ← the native element
          endContent (.input__end-content)     ← trailing icon slot
          clearButton (.input__clear-button)   ← × button, after endContent
          passwordToggle (.input__password-toggle) ← eye button, type="password" only
        helperWrapper (.input__helper-wrapper) ← holds description XOR error
          errorMessage | description

  ─── Data attributes on base (selector hooks) ──────────────────────────
    data-invalid    — mirrors isInvalid
    data-disabled   — mirrors isDisabled
    data-readonly   — mirrors isReadOnly
    data-required   — mirrors isRequired
    data-has-label  — true when label prop is set (any placement)
    data-has-helper — true when description or error is visible
    data-filled     — set on inputWrapper when the value is non-empty (for
                      floating-label up-state)

  Every interactive CSS rule in input.css pairs a pseudo-class with its
  data-attribute counterpart (Reka UI selector pairing rule), e.g.
    &:focus-within, &[data-focused="true"] { ... }

  ─── v-model ───────────────────────────────────────────────────────────
    <Input v-model="value" />   -- string | number | null

  ─── Emits ─────────────────────────────────────────────────────────────
    @clear   -- emitted when the user activates the clear (×) button.
                The input is already empty and refocused by this point.

  ─── Slots ─────────────────────────────────────────────────────────────
    #startContent  -- leading icon / adornment
    #endContent    -- trailing icon / adornment (renders BEFORE clear/toggle,
                      so you can combine them freely)

  ─── Accessibility contract (audited by vitest-axe) ────────────────────
    • <label for="{inputId}"> wraps the label text.
    • aria-invalid reflects isInvalid.
    • aria-describedby points to whichever helper is rendered (error wins).
    • Required field uses the native `required` attribute; the visual
      asterisk is aria-hidden.
    • Clear button: tabindex=-1 (out of form tab flow), aria-label.
    • Password toggle: tabbable, aria-pressed reflects visibility.
    • All transitions are wrapped in motion-reduce:transition-none.

  ─── Reuse checklist for new form fields ───────────────────────────────
    1. Copy prop names verbatim (variant, size, color, labelPlacement,
       fullWidth, isInvalid, isDisabled, isReadOnly, isRequired, label,
       description, errorMessage, class, classNames).
    2. Expose the same slot keys in tailwind-variants.
    3. Emit the same data-attributes on the root + data-filled on the
       field box.
    4. Use the `useFormField` composable (packages/vue/src/composables/useFormField.ts)
       for the description/error/label-visibility state machine, and the
       `FieldLabel` / `FormFieldHelper` components (components/_shared/) for
       the repeated label and helper markup — do not hand-roll these again.
    5. Generate ids with useId(), scope helper ids as `{id}-error` /
       `{id}-description`.
    6. Default labelPlacement to 'inside' and apply the inside-label
       CSS via a compoundVariant of (hasLabel=true, labelPlacement='inside').
-->
<script setup lang="ts">
import { computed, nextTick, ref, useAttrs, useId, useTemplateRef } from 'vue'
import { inputVariants, type InputVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'
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
  isReadOnly: undefined,
  isReadonly: undefined,
  isRequired: false,
  isClearable: false,
  showPasswordToggle: false,
  type: 'text',
})

const emit = defineEmits<{
  /**
   * Fired when the user activates the clear (×) button.
   * At the time this fires the v-model value is already '' and focus
   * has been returned to the input element.
   */
  clear: []
}>()

/**
 * Two-way value. String for text-like types, number for type="number",
 * null allowed so controlled consumers can represent "no value" without
 * coercing to empty string.
 */
const modelValue = defineModel<string | number | null>({ default: '' })

type Props = {
  /** Visual style of the field. @default 'flat' */
  variant?: InputVariants['variant']
  /** Field height. @default 'md' */
  size?: InputVariants['size']
  /** Accent color applied to focus ring + floating label. @default 'default' */
  color?: InputVariants['color']
  /**
   * Where the `label` is rendered relative to the field.
   * - `inside`: floats above the input (shrinks when focused/filled)
   * - `outside`: sits above the field, static
   * - `outside-left`: sits to the left, horizontal layout
   * @default 'inside'
   */
  labelPlacement?: InputVariants['labelPlacement']
  /** Stretches root wrapper to 100% width. @default false */
  fullWidth?: boolean
  /** Marks the field as invalid. Triggers danger styling and enables `errorMessage`. @default false */
  isInvalid?: boolean
  /** Disables the field. @default false */
  isDisabled?: boolean
  /** Makes the field read-only. @default false */
  isReadOnly?: boolean
  /** @deprecated Use isReadOnly instead. */
  isReadonly?: boolean
  /** Adds a required asterisk next to the label and the `required` attribute on the input. @default false */
  isRequired?: boolean
  /** Shows an × button that clears the value and refocuses the input when value is non-empty. @default false */
  isClearable?: boolean
  /** Shows a show/hide eye button. Only active when `type === 'password'`. @default false */
  showPasswordToggle?: boolean
  /** Native input type (e.g. `text`, `email`, `password`, `number`). @default 'text' */
  type?: string
  /** Placeholder shown when empty. Hidden behind the floating label until focused/filled for `labelPlacement: 'inside'`. */
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
   * Per-slot class overrides. Each key maps to a named slot in the anatomy;
   * the value is merged with the generated variant classes via `composeClassName`.
   *
   * @example
   * ```vue
   * <Input :class-names="{ input: 'text-xl', inputWrapper: 'border-2 border-blue-500' }" />
   * ```
   *
   * Available slots: `base`, `mainWrapper`, `inputWrapper`, `input`,
   * `label`, `startContent`, `endContent`, `clearButton`, `passwordToggle`,
   * `helperWrapper`, `description`, `errorMessage`.
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
    passwordToggle: ClassValue
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

const isReadOnly = useDeprecatedBooleanProp(
  'Input', 'isReadOnly', () => props.isReadOnly, 'isReadonly', () => props.isReadonly,
)

const isFilled = computed(
  () => modelValue.value !== null && modelValue.value !== undefined && String(modelValue.value) !== '',
)

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
  isReadOnly: () => isReadOnly.value,
  isRequired: () => props.isRequired,
  labelPlacement: () => props.labelPlacement,
})

const isPasswordVisible = ref(false)
const isPasswordField = computed(() => props.type === 'password')
const effectiveType = computed(() =>
  isPasswordField.value && isPasswordVisible.value ? 'text' : props.type,
)

const isInteractive = computed(() => !props.isDisabled && !isReadOnly.value)
const showClearButton = computed(
  () => props.isClearable && isFilled.value && isInteractive.value,
)
const showPasswordToggleButton = computed(
  () => props.showPasswordToggle && isPasswordField.value && isInteractive.value,
)

function handleClear() {
  modelValue.value = ''
  emit('clear')
  nextTick(() => inputEl.value?.focus())
}

function togglePasswordVisibility() {
  isPasswordVisible.value = !isPasswordVisible.value
}

const slotFns = computed(() =>
  inputVariants({
    variant: props.variant,
    size: props.size,
    color: props.color,
    fullWidth: props.fullWidth,
    isInvalid: props.isInvalid,
    isDisabled: props.isDisabled,
    isReadonly: isReadOnly.value,
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
          v-if="$slots.startContent"
          :class="composeClassName(slotFns.startContent(), props.classNames?.startContent)"
        >
          <slot name="startContent" />
        </span>
        <input
          v-bind="inputAttrs"
          :id="inputId"
          ref="inputEl"
          v-model="modelValue"
          :type="effectiveType"
          :placeholder="placeholder"
          :name="name"
          :disabled="isDisabled || undefined"
          :readonly="isReadOnly || undefined"
          :required="isRequired || undefined"
          :aria-invalid="isInvalid || undefined"
          :aria-describedby="ariaDescribedBy"
          :class="composeClassName(slotFns.input(), props.classNames?.input)"
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
          aria-label="Clear input"
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
        <button
          v-if="showPasswordToggleButton"
          type="button"
          :class="composeClassName(slotFns.passwordToggle(), props.classNames?.passwordToggle)"
          :aria-label="isPasswordVisible ? 'Hide password' : 'Show password'"
          :aria-pressed="isPasswordVisible"
          @click="togglePasswordVisibility"
        >
          <svg
            v-if="isPasswordVisible"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line
              x1="1"
              y1="1"
              x2="23"
              y2="23"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle
              cx="12"
              cy="12"
              r="3"
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
