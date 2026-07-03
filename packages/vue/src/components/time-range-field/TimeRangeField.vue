<!--
  TimeRangeField — form-field mirror of DateRangeField.vue for a time range.

  Same prop surface, data-attribute contract, floating-label behavior,
  start/end content slots, and a11y wiring as DateRangeField. Renders TWO
  segment lists (start + end) separated by a visible "–" glyph, using
  @internationalized/date TimeValue instead of DateValue.
-->
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useAttrs, useId, watch } from 'vue'
import { TimeRangeFieldRoot, TimeRangeFieldInput } from 'reka-ui'
import type { TimeValue } from 'reka-ui'
import { timeRangeFieldVariants, type TimeRangeFieldVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
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
  granularity: 'minute',
  hideTimeZone: false,
})

const modelValue = defineModel<TimeRange | null | undefined>()

export interface TimeRange {
  start: TimeValue
  end: TimeValue
}

type Props = {
  /** Visual style of the field. @default 'flat' */
  variant?: TimeRangeFieldVariants['variant']
  /** Field height. @default 'md' */
  size?: TimeRangeFieldVariants['size']
  /** Accent color applied to focus ring + floating label. @default 'default' */
  color?: TimeRangeFieldVariants['color']
  /** Label placement relative to the field. @default 'inside' */
  labelPlacement?: TimeRangeFieldVariants['labelPlacement']
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
  /** Per-slot class overrides. Merged with tailwind-variants styles. */
  classNames?: Partial<{
    base: ClassValue
    label: ClassValue
    mainWrapper: ClassValue
    inputWrapper: ClassValue
    startContent: ClassValue
    segmentList: ClassValue
    segment: ClassValue
    separator: ClassValue
    endContent: ClassValue
    helperWrapper: ClassValue
    errorMessage: ClassValue
    description: ClassValue
  }>

  /* ─── TimeRangeField-specific ─────────────────────────────────── */
  defaultValue?: TimeRange
  defaultPlaceholder?: TimeValue
  placeholderValue?: TimeValue
  minValue?: TimeValue
  maxValue?: TimeValue
  granularity?: 'hour' | 'minute' | 'second'
  hourCycle?: 12 | 24
  /** Steps for segment keyboard navigation. */
  step?: Partial<Record<'hour' | 'minute' | 'second' | 'millisecond', number>>
  hideTimeZone?: boolean
  locale?: string
  name?: string
  /** Marks the field as required for form submission. */
  required?: boolean
  /** Text direction for the field. */
  dir?: 'ltr' | 'rtl'
  /** Render root as a different element or component. */
  as?: string
  /** Render root child as root element. */
  asChild?: boolean
}

const attrs = useAttrs()
const generatedId = useId()
const fieldId = computed(() => (attrs.id as string | undefined) ?? `${generatedId}-field`)
const labelId = computed(() => `${generatedId}-label`)

const isFilled = computed(() => modelValue.value?.start != null || modelValue.value?.end != null)

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
  fieldId: () => fieldId.value,
  label: () => props.label,
  description: () => props.description,
  errorMessage: () => props.errorMessage,
  isInvalid: () => props.isInvalid,
  isDisabled: () => props.isDisabled,
  isReadOnly: () => props.isReadOnly,
  isRequired: () => props.isRequired,
  labelPlacement: () => props.labelPlacement,
})

const fieldRef = ref<HTMLElement | null>(null)
// Reka components expose their root DOM node via $el — unwrap before using DOM APIs.
const fieldEl = computed<HTMLElement | null>(() => {
  const r = fieldRef.value as unknown as { $el?: HTMLElement } | HTMLElement | null
  if (!r) return null
  if (r instanceof HTMLElement) return r
  return r.$el ?? null
})

// `isFocused` tracks focus on a TIME SEGMENT specifically — not any descendant.
const isFocused = ref(false)
function updateSegmentFocus() {
  const root = fieldEl.value
  if (!root) { isFocused.value = false; return }
  const active = (root.ownerDocument ?? document).activeElement as HTMLElement | null
  isFocused.value = !!active
    && root.contains(active)
    && active.hasAttribute('data-reka-time-field-segment')
}
function onDocFocusIn() { updateSegmentFocus() }
function onDocFocusOut() { queueMicrotask(updateSegmentFocus) }

// Guard against focus snap-back after an outside click.
let suppressSegmentFocusUntil = 0
function onDocPointerDown(e: PointerEvent) {
  const root = fieldEl.value
  if (!root) return
  const target = e.target as Node | null
  if (!target || root.contains(target)) return
  suppressSegmentFocusUntil = performance.now() + 250
  const active = (root.ownerDocument ?? document).activeElement as HTMLElement | null
  if (active && root.contains(active) && active.hasAttribute('data-reka-time-field-segment')) {
    active.blur()
  }
}
function onDocFocusInGuard(e: FocusEvent) {
  if (performance.now() >= suppressSegmentFocusUntil) return
  const root = fieldEl.value
  if (!root) return
  const t = e.target as HTMLElement | null
  if (t && root.contains(t) && t.hasAttribute?.('data-reka-time-field-segment')) {
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

// Track data-filled by sniffing rendered segments across BOTH segment lists.
const segmentsFilled = ref(false)
function recomputeFilled() {
  const root = fieldEl.value
  if (!root || typeof root.querySelectorAll !== 'function') {
    segmentsFilled.value = false
    return
  }
  const segs = root.querySelectorAll('[data-reka-time-field-segment]:not([data-reka-time-field-segment="literal"])')
  let anyFilled = false
  segs.forEach((el) => {
    if ((el as HTMLElement).dataset.placeholder === 'false') anyFilled = true
  })
  segmentsFilled.value = anyFilled
}
watch([modelValue, () => props.defaultValue, () => props.granularity, () => props.hourCycle], () => {
  queueMicrotask(recomputeFilled)
}, { immediate: true })

const effectiveFilled = computed(() => isFilled.value || segmentsFilled.value)

function handleFieldMousedown(e: MouseEvent) {
  const target = e.target as HTMLElement | null
  if (!target) return
  if (target.closest('[data-reka-time-field-segment]')) return
  if (target.closest('[data-slot="start-content"]')) return
  if (target.closest('[data-slot="end-content"]')) return
  if (target.closest('button, [role="button"]')) return
  const root = fieldEl.value
  if (!root) return
  const active = (root.ownerDocument ?? document).activeElement as HTMLElement | null
  if (active && root.contains(active) && active.hasAttribute('data-reka-time-field-segment')) {
    return
  }
  const first = root.querySelector<HTMLElement>(
    '[data-reka-time-field-segment]:not([data-reka-time-field-segment="literal"])',
  )
  if (first) {
    e.preventDefault()
    first.focus()
  }
}

const slotFns = computed(() =>
  timeRangeFieldVariants({
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
    data-slot="time-range-field"
  >
    <FieldLabel
      v-if="showOutsideLabel"
      :id="labelId"
      :for="fieldId"
      :label="label"
      :is-required="isRequired"
      :class="composeClassName(slotFns.label(), props.classNames?.label)"
    />

    <div :class="composeClassName(slotFns.mainWrapper(), props.classNames?.mainWrapper)">
      <TimeRangeFieldRoot
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
          <FieldLabel
            v-if="showInsideLabel"
            :id="labelId"
            :for="fieldId"
            :label="label"
            :is-required="isRequired"
            :class="composeClassName(slotFns.label(), props.classNames?.label)"
          />

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
            data-type="start"
          >
            <template
              v-for="(segment, _i) in segments.start"
              :key="`start-${_i}`"
            >
              <TimeRangeFieldInput
                :part="segment.part"
                type="start"
                :class="composeClassName(slotFns.segment(), props.classNames?.segment)"
              >
                {{ segment.value }}
              </TimeRangeFieldInput>
            </template>
          </div>

          <span
            :class="composeClassName(slotFns.separator(), props.classNames?.separator)"
            aria-hidden="true"
            data-slot="separator"
          >–</span>

          <div
            :class="composeClassName(slotFns.segmentList(), props.classNames?.segmentList)"
            data-slot="segment-list"
            data-type="end"
          >
            <template
              v-for="(segment, _i) in segments.end"
              :key="`end-${_i}`"
            >
              <TimeRangeFieldInput
                :part="segment.part"
                type="end"
                :class="composeClassName(slotFns.segment(), props.classNames?.segment)"
              >
                {{ segment.value }}
              </TimeRangeFieldInput>
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
      </TimeRangeFieldRoot>

      <FormFieldHelper
        :has-helper="hasHelper"
        :show-error="showError"
        :show-description="showDescription"
        :error-message="errorMessage"
        :description="description"
        :error-message-id="errorMessageId"
        :description-id="descriptionId"
        error-role="alert"
        :wrapper-class="composeClassName(slotFns.helperWrapper(), props.classNames?.helperWrapper)"
        :error-class="composeClassName(slotFns.errorMessage(), props.classNames?.errorMessage)"
        :description-class="composeClassName(slotFns.description(), props.classNames?.description)"
      />
    </div>
  </div>
</template>
