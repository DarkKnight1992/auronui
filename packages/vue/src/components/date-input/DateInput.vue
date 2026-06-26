<!--
  DateInput — form-field mirror of Input.vue for @internationalized/date.

  Anatomy, data-attributes, floating-label behavior, start/end content
  slots, and a11y wiring all mirror Input.vue. See the Input.vue docblock
  for the canonical contract.
-->
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useAttrs, useId, watch } from 'vue'
import { DateFieldRoot, DateFieldInput } from 'reka-ui'
import type { DateValue } from '@internationalized/date'
import { dateInputVariants, type DateInputVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'

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
  hideTimeZone: false,
})

const modelValue = defineModel<DateValue | null | undefined>()

type Props = {
  /** Visual style of the field. @default 'flat' */
  variant?: DateInputVariants['variant']
  /** Field height. @default 'md' */
  size?: DateInputVariants['size']
  /** Accent color applied to focus ring + floating label. @default 'default' */
  color?: DateInputVariants['color']
  /** Label placement relative to the field. @default 'inside' */
  labelPlacement?: DateInputVariants['labelPlacement']
  /** Stretches root wrapper to 100% width. @default false */
  fullWidth?: boolean
  /** Marks the field as invalid. @default false */
  isInvalid?: boolean
  /** Disables the field. @default false */
  isDisabled?: boolean
  /** Makes the field read-only. @default false */
  isReadOnly?: boolean
  /** Adds a required asterisk next to the label. @default false */
  isRequired?: boolean
  /** Field label. When omitted, floating-label behavior is skipped. */
  label?: string
  /** Helper text below the field. Suppressed when isInvalid && errorMessage is shown. */
  description?: string
  /** Error text below the field. Only rendered when isInvalid is true. */
  errorMessage?: string
  /** Extra classes merged onto the root wrapper. */
  class?: ClassValue
  /** Per-slot class overrides. */
  classNames?: Partial<{
    base: ClassValue
    label: ClassValue
    mainWrapper: ClassValue
    inputWrapper: ClassValue
    startContent: ClassValue
    segmentList: ClassValue
    segment: ClassValue
    endContent: ClassValue
    helperWrapper: ClassValue
    errorMessage: ClassValue
    description: ClassValue
  }>

  /* ─── DateInput-specific ──────────────────────────────────────── */
  defaultValue?: DateValue
  defaultPlaceholder?: DateValue
  placeholderValue?: DateValue
  minValue?: DateValue
  maxValue?: DateValue
  granularity?: 'day' | 'hour' | 'minute' | 'second'
  hourCycle?: 12 | 24
  /** Steps for segment keyboard navigation. */
  step?: Partial<Record<'hour' | 'minute' | 'second' | 'millisecond', number>>
  locale?: string
  name?: string
  hideTimeZone?: boolean
  isDateUnavailable?: (date: DateValue) => boolean
  /** Marks the field as required for form submission. */
  required?: boolean
  /** Text direction for the field. */
  dir?: 'ltr' | 'rtl'
  /** Render as a different element or component. */
  as?: string
  /** Render child as root element. */
  asChild?: boolean
}

const attrs = useAttrs()
const generatedId = useId()
const fieldId = computed(() => (attrs.id as string | undefined) ?? `${generatedId}-field`)
const labelId = computed(() => `${generatedId}-label`)
const descriptionId = computed(() => `${generatedId}-description`)
const errorMessageId = computed(() => `${generatedId}-error`)

const hasLabel = computed(() => !!props.label)
const isFilled = computed(() => modelValue.value != null)

const showError = computed(() => props.isInvalid && !!props.errorMessage)
const showDescription = computed(() => !!props.description && !showError.value)
const hasHelper = computed(() => showError.value || showDescription.value)
const ariaDescribedBy = computed(() => {
  if (showError.value) return errorMessageId.value
  if (showDescription.value) return descriptionId.value
  return undefined
})

const fieldRef = ref<HTMLElement | null>(null)
// Reka components expose their root DOM node via $el — unwrap before using DOM APIs.
const fieldEl = computed<HTMLElement | null>(() => {
  const r = fieldRef.value as unknown as { $el?: HTMLElement } | HTMLElement | null
  if (!r) return null
  if (r instanceof HTMLElement) return r
  return r.$el ?? null
})

// `isFocused` tracks focus on a DATE SEGMENT specifically — not any descendant.
// This prevents nested interactive children (e.g. a DatePickerTrigger button in
// endContent) from flipping the field into the focused visual state.
const isFocused = ref(false)
function updateSegmentFocus() {
  const root = fieldEl.value
  if (!root) { isFocused.value = false; return }
  const active = (root.ownerDocument ?? document).activeElement as HTMLElement | null
  isFocused.value = !!active
    && root.contains(active)
    && active.hasAttribute('data-reka-date-field-segment')
}
function onDocFocusIn() { updateSegmentFocus() }
function onDocFocusOut() { queueMicrotask(updateSegmentFocus) }

// Guard against a focus snap-back after an outside click. When the user
// clicks outside the field, we mark a short-lived "suppress segment focus"
// window. Any focusin landing on a segment inside that window gets blurred
// immediately — kills the two-click-to-blur UX regardless of which internal
// mechanism (Reka VisuallyHidden, label-for, contenteditable selection
// restoration) tried to restore the focus.
let suppressSegmentFocusUntil = 0
function onDocPointerDown(e: PointerEvent) {
  const root = fieldEl.value
  if (!root) return
  const target = e.target as Node | null
  if (!target || root.contains(target)) return
  suppressSegmentFocusUntil = performance.now() + 250
  const active = (root.ownerDocument ?? document).activeElement as HTMLElement | null
  if (active && root.contains(active) && active.hasAttribute('data-reka-date-field-segment')) {
    active.blur()
  }
}
function onDocFocusInGuard(e: FocusEvent) {
  if (performance.now() >= suppressSegmentFocusUntil) return
  const root = fieldEl.value
  if (!root) return
  const t = e.target as HTMLElement | null
  if (t && root.contains(t) && t.hasAttribute?.('data-reka-date-field-segment')) {
    t.blur()
  }
}

onMounted(() => {
  document.addEventListener('focusin', onDocFocusIn)
  document.addEventListener('focusout', onDocFocusOut)
  document.addEventListener('pointerdown', onDocPointerDown, true)
  document.addEventListener('focusin', onDocFocusInGuard, true)
})
onBeforeUnmount(() => {
  document.removeEventListener('focusin', onDocFocusIn)
  document.removeEventListener('focusout', onDocFocusOut)
  document.removeEventListener('pointerdown', onDocPointerDown, true)
  document.removeEventListener('focusin', onDocFocusInGuard, true)
})

// Track data-filled synchronously from the rendered segments — defaultValue +
// isFilled from modelValue misses the uncontrolled case and the partially-typed
// case. After each value/segment render, sniff any non-literal segment that
// carries data-placeholder="false".
const segmentsFilled = ref(false)
function recomputeFilled() {
  const root = fieldEl.value
  if (!root || typeof root.querySelectorAll !== 'function') {
    segmentsFilled.value = false
    return
  }
  const segs = root.querySelectorAll('[data-reka-date-field-segment]:not([data-reka-date-field-segment="literal"])')
  let anyFilled = false
  segs.forEach((el) => {
    if ((el as HTMLElement).dataset.placeholder === 'false') anyFilled = true
  })
  segmentsFilled.value = anyFilled
}
watch([modelValue, () => props.defaultValue, () => props.granularity], () => {
  queueMicrotask(recomputeFilled)
}, { immediate: true })

const effectiveFilled = computed(() => isFilled.value || segmentsFilled.value)

// Only intervene on the INITIAL click that enters the field. Once a segment
// already holds focus, leave subsequent mousedowns alone so the user can
// blur naturally (clicking elsewhere) without focus snapping back to a
// segment and requiring a second click.
function handleFieldMousedown(e: MouseEvent) {
  const target = e.target as HTMLElement | null
  if (!target) return
  if (target.closest('[data-reka-date-field-segment]')) return
  if (target.closest('[data-slot="start-content"]')) return
  if (target.closest('[data-slot="end-content"]')) return
  if (target.closest('button, [role="button"]')) return
  const root = fieldEl.value
  if (!root) return
  const active = (root.ownerDocument ?? document).activeElement as HTMLElement | null
  if (active && root.contains(active) && active.hasAttribute('data-reka-date-field-segment')) {
    return
  }
  const first = root.querySelector<HTMLElement>(
    '[data-reka-date-field-segment]:not([data-reka-date-field-segment="literal"])',
  )
  if (first) {
    e.preventDefault()
    first.focus()
  }
}

const slotFns = computed(() =>
  dateInputVariants({
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
    :data-readonly="isReadOnly || undefined"
    :data-required="isRequired || undefined"
    :data-has-label="hasLabel || undefined"
    :data-has-helper="hasHelper || undefined"
  >
    <label
      v-if="showOutsideLabel"
      :id="labelId"
      :for="fieldId"
      :class="composeClassName(slotFns.label(), props.classNames?.label)"
    >{{ label }}<span
      v-if="isRequired"
      aria-hidden="true"
    > *</span></label>

    <div :class="composeClassName(slotFns.mainWrapper(), props.classNames?.mainWrapper)">
      <DateFieldRoot
        :id="fieldId"
        ref="fieldRef"
        v-model="modelValue"
        :default-value="defaultValue"
        :default-placeholder="defaultPlaceholder"
        :placeholder="placeholderValue"
        :min-value="minValue"
        :max-value="maxValue"
        :granularity="granularity"
        :hour-cycle="hourCycle"
        :step="step"
        :locale="locale"
        :disabled="isDisabled"
        :readonly="isReadOnly"
        :name="name"
        :hide-time-zone="hideTimeZone"
        :is-date-unavailable="isDateUnavailable"
        :required="required"
        :dir="dir"
        :as="as"
        :as-child="asChild"
        :aria-labelledby="hasLabel ? labelId : undefined"
        :aria-describedby="ariaDescribedBy"
        :aria-required="isRequired || undefined"
        :aria-invalid="isInvalid || undefined"
        :class="composeClassName(slotFns.inputWrapper(), props.classNames?.inputWrapper)"
        :data-filled="hasLabel ? (effectiveFilled || undefined) : undefined"
        :data-focused="isFocused || undefined"
        :data-invalid="isInvalid || undefined"
        :data-disabled="isDisabled || undefined"
        :data-readonly="isReadOnly || undefined"
        @mousedown="handleFieldMousedown"
      >
        <template #default="{ segments }">
          <label
            v-if="showInsideLabel"
            :id="labelId"
            :for="fieldId"
            :class="composeClassName(slotFns.label(), props.classNames?.label)"
          >{{ label }}<span
            v-if="isRequired"
            aria-hidden="true"
          > *</span></label>

          <span
            v-if="$slots.startContent"
            :class="composeClassName(slotFns.startContent(), props.classNames?.startContent)"
            data-slot="start-content"
          >
            <slot name="startContent" />
          </span>

          <div
            :class="composeClassName(slotFns.segmentList(), props.classNames?.segmentList)"
            data-slot="segment-list"
          >
            <template
              v-for="(segment, _i) in segments"
              :key="_i"
            >
              <DateFieldInput
                :part="segment.part"
                :class="composeClassName(slotFns.segment(), props.classNames?.segment)"
              >
                {{ segment.value }}
              </DateFieldInput>
            </template>
          </div>

          <span
            v-if="$slots.endContent"
            :class="composeClassName(slotFns.endContent(), props.classNames?.endContent)"
            data-slot="end-content"
          >
            <slot name="endContent" />
          </span>
        </template>
      </DateFieldRoot>

      <div
        v-if="hasHelper"
        :class="composeClassName(slotFns.helperWrapper(), props.classNames?.helperWrapper)"
      >
        <div
          v-if="showError"
          :id="errorMessageId"
          :class="composeClassName(slotFns.errorMessage(), props.classNames?.errorMessage)"
          role="alert"
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
