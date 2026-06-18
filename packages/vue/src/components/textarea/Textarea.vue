<!--
  Textarea — multi-line form-field component for @auronui/vue.

  Mirrors Input.vue's prop surface, slot architecture, and a11y contract.
  Textarea-specific additions: `rows` (initial visible rows) and `autoResize`
  (wires @vueuse/core useTextareaAutosize so height tracks content).

  ─── Anatomy ────────────────────────────────────────────────────────────
    base (.textarea-root)
      label [outside | outside-left]
      mainWrapper (.textarea__main-wrapper)
        inputWrapper (.textarea)
          label [inside]
          startContent (.textarea__start-content)
          <textarea ref="textareaEl">
          endContent (.textarea__end-content)
          clearButton (.textarea__clear-button)
        helperWrapper (.textarea__helper-wrapper)
          errorMessage | description
-->
<script setup lang="ts">
import { computed, nextTick, toRef, useAttrs, useId, useTemplateRef } from 'vue'
import { useTextareaAutosize } from '@vueuse/core'
import { textAreaVariants, type TextAreaVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<Props>(), {
  variant: 'flat',
  size: 'md',
  color: 'default',
  labelPlacement: 'inside',
  fullWidth: false,
  isInvalid: false,
  isDisabled: false,
  isReadonly: false,
  isRequired: false,
  isClearable: false,
  rows: 3,
  autoResize: false,
})

const emit = defineEmits<{
  clear: []
}>()

const modelValue = defineModel<string>({ default: '' })

type Props = {
  /** Visual style of the field. @default 'flat' */
  variant?: TextAreaVariants['variant']
  /** Field size. @default 'md' */
  size?: TextAreaVariants['size']
  /** Accent color applied to focus ring + floating label. @default 'default' */
  color?: TextAreaVariants['color']
  /**
   * Where the `label` is rendered relative to the field.
   * @default 'inside'
   */
  labelPlacement?: TextAreaVariants['labelPlacement']
  /** Stretches root wrapper to 100% width. @default false */
  fullWidth?: boolean
  /** Marks the field as invalid. Enables `errorMessage`. @default false */
  isInvalid?: boolean
  /** Disables the field. @default false */
  isDisabled?: boolean
  /** Makes the field read-only. @default false */
  isReadonly?: boolean
  /** Adds a required asterisk next to the label and the `required` attribute. @default false */
  isRequired?: boolean
  /** Shows an × button that clears the value and refocuses the field. @default false */
  isClearable?: boolean
  /** Initial visible rows (native attribute). @default 3 */
  rows?: number
  /** Placeholder shown when empty. */
  placeholder?: string
  /** Form field name, for native form submission. */
  name?: string
  /** Field label. When omitted, the floating-label behavior is skipped. */
  label?: string
  /** Helper text displayed below the field. Suppressed when `isInvalid && errorMessage` is shown. */
  description?: string
  /** Error text displayed below the field. Only rendered when `isInvalid` is also true. */
  errorMessage?: string
  /** Auto-grow the textarea height to fit content (uses `useTextareaAutosize`). @default false */
  autoResize?: boolean
  /** Extra classes merged onto the root wrapper via `composeClassName`. */
  class?: string
  /** Per-slot class overrides. Each key accepts classes merged via `composeClassName`. */
  classNames?: Partial<{
    base: string
    label: string
    mainWrapper: string
    inputWrapper: string
    startContent: string
    input: string
    endContent: string
    clearButton: string
    helperWrapper: string
    errorMessage: string
    description: string
  }>
}

const attrs = useAttrs()
const generatedId = useId()
const inputId = computed(() => (attrs.id as string | undefined) ?? generatedId)
const inputAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([k]) => k !== 'id'))
)

const textareaEl = useTemplateRef<HTMLTextAreaElement>('textareaEl')

if (props.autoResize) {
  useTextareaAutosize({
    element: textareaEl,
    input: toRef(modelValue),
  })
}

const hasLabel = computed(() => !!props.label)
const isFilled = computed(() => modelValue.value != null && String(modelValue.value) !== '')

const descriptionId = computed(() => `${inputId.value}-description`)
const errorMessageId = computed(() => `${inputId.value}-error`)
const showError = computed(() => props.isInvalid && !!props.errorMessage)
const showDescription = computed(() => !!props.description && !showError.value)
const hasHelper = computed(() => showError.value || showDescription.value)
const ariaDescribedBy = computed(() => {
  if (showError.value) return errorMessageId.value
  if (showDescription.value) return descriptionId.value
  return undefined
})

const isInteractive = computed(() => !props.isDisabled && !props.isReadonly)
const showClearButton = computed(
  () => props.isClearable && isFilled.value && isInteractive.value,
)

function handleClear() {
  modelValue.value = ''
  emit('clear')
  nextTick(() => textareaEl.value?.focus())
}

const slotFns = computed(() =>
  textAreaVariants({
    variant: props.variant,
    size: props.size,
    color: props.color,
    fullWidth: props.fullWidth,
    isInvalid: props.isInvalid,
    isDisabled: props.isDisabled,
    isReadonly: props.isReadonly,
    hasLabel: hasLabel.value,
    labelPlacement: props.labelPlacement,
  }),
)

const showOutsideLabel = computed(
  () => hasLabel.value && props.labelPlacement !== 'inside',
)
const showInsideLabel = computed(
  () => hasLabel.value && props.labelPlacement === 'inside',
)
</script>

<template>
  <div
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    :data-invalid="isInvalid || undefined"
    :data-disabled="isDisabled || undefined"
    :data-readonly="isReadonly || undefined"
    :data-required="isRequired || undefined"
    :data-has-label="hasLabel || undefined"
    :data-has-helper="hasHelper || undefined"
  >
    <label
      v-if="showOutsideLabel"
      :for="inputId"
      :class="composeClassName(slotFns.label(), props.classNames?.label)"
    >{{ label }}<span
      v-if="isRequired"
      aria-hidden="true"
    > *</span></label>

    <div :class="composeClassName(slotFns.mainWrapper(), props.classNames?.mainWrapper)">
      <div
        :class="composeClassName(slotFns.inputWrapper(), props.classNames?.inputWrapper)"
        :data-filled="hasLabel ? (isFilled || undefined) : undefined"
      >
        <label
          v-if="showInsideLabel"
          :for="inputId"
          :class="composeClassName(slotFns.label(), props.classNames?.label)"
        >{{ label }}<span
          v-if="isRequired"
          aria-hidden="true"
        > *</span></label>
        <span
          v-if="$slots.startContent"
          :class="composeClassName(slotFns.startContent(), props.classNames?.startContent)"
        >
          <slot name="startContent" />
        </span>
        <textarea
          v-bind="inputAttrs"
          :id="inputId"
          ref="textareaEl"
          v-model="modelValue"
          :rows="rows"
          :placeholder="placeholder"
          :name="name"
          :disabled="isDisabled || undefined"
          :readonly="isReadonly || undefined"
          :required="isRequired || undefined"
          :aria-invalid="isInvalid || undefined"
          :aria-describedby="ariaDescribedBy"
          :class="composeClassName(slotFns.input(), props.classNames?.input)"
        />
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
          aria-label="Clear textarea"
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

      <div
        v-if="hasHelper"
        :class="composeClassName(slotFns.helperWrapper(), props.classNames?.helperWrapper)"
      >
        <div
          v-if="showError"
          :id="errorMessageId"
          :class="composeClassName(slotFns.errorMessage(), props.classNames?.errorMessage)"
        >
          {{ errorMessage }}
        </div>
        <div
          v-else-if="showDescription"
          :id="descriptionId"
          :class="composeClassName(slotFns.description(), props.classNames?.description)"
        >
          {{ description }}
        </div>
      </div>
    </div>
  </div>
</template>
