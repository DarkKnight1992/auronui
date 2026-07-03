<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { Time, getLocalTimeZone, now as internationalizedNow } from '@internationalized/date'
import { timePickerVariants, type TimeFieldVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'
import TimeField from '../time-field/TimeField.vue'
import TimeScroller from '../_shared/TimeScroller.vue'
import Popover from '../popover/Popover.vue'
import PopoverTrigger from '../popover/PopoverTrigger.vue'
import PopoverContent from '../popover/PopoverContent.vue'
import Button from '../button/Button.vue'

const props = withDefaults(defineProps<{
  /* Field appearance — forwarded to TimeField */
  variant?: TimeFieldVariants['variant']
  size?: TimeFieldVariants['size']
  color?: TimeFieldVariants['color']
  labelPlacement?: TimeFieldVariants['labelPlacement']
  fullWidth?: boolean

  defaultValue?: Time
  defaultOpen?: boolean
  defaultPlaceholder?: Time
  placeholderValue?: Time
  minValue?: Time
  maxValue?: Time
  locale?: string
  granularity?: 'hour' | 'minute' | 'second'
  hourCycle?: 12 | 24
  /** Steps for segment keyboard navigation. */
  step?: Partial<Record<'hour' | 'minute' | 'second' | 'millisecond', number>>
  stepSnapping?: boolean
  label?: string
  description?: string
  errorMessage?: string
  isInvalid?: boolean
  isDisabled?: boolean
  isReadOnly?: boolean
  isRequired?: boolean
  name?: string
  hideTimeZone?: boolean
  closeOnSelect?: boolean
  modal?: boolean
  /** Label for the footer button that closes the picker. */
  doneLabel?: string
  /** Text direction. */
  dir?: 'ltr' | 'rtl'
  required?: boolean
  /** Render trigger as a different element. */
  triggerAs?: string
  /** Render trigger child as root element. */
  triggerAsChild?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  sideFlip?: boolean
  align?: 'start' | 'center' | 'end'
  alignOffset?: number
  alignFlip?: boolean
  avoidCollisions?: boolean
  collisionBoundary?: Element | null | Array<Element | null>
  collisionPadding?: number | Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>
  arrowPadding?: number
  hideShiftedArrow?: boolean
  sticky?: 'partial' | 'always'
  hideWhenDetached?: boolean
  positionStrategy?: 'fixed' | 'absolute'
  updatePositionStrategy?: 'always' | 'optimized'
  disableUpdateOnLayoutShift?: boolean
  prioritizePosition?: boolean
  class?: ClassValue
  /** Override classes for individual slots (base, trigger, triggerIndicator, popover, panel, timeDone) */
  classNames?: Partial<{
    base: ClassValue
    trigger: ClassValue
    triggerIndicator: ClassValue
    popover: ClassValue
    panel: ClassValue
    timeDone: ClassValue
  }>
}>(), {
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
  granularity: 'minute',
  hourCycle: 24,
  defaultOpen: false,
  closeOnSelect: true,
  modal: false,
  doneLabel: 'Done',
  avoidCollisions: true,
  collisionPadding: 8,
  prioritizePosition: true,
})

const modelValue = defineModel<Time | null | undefined>()
const openModel = defineModel<boolean>('open', { default: undefined })

// Seed controlled open state from defaultOpen so portal renders in uncontrolled mode too
if (props.defaultOpen && openModel.value === undefined) {
  openModel.value = true
}

// Internal working value — always a Time, never null/undefined, so both the
// TimeField trigger and the TimeScroller panel always have something to render.
// Mirrors DateTimePicker.vue's internalValue seeding pattern exactly.
const _now = internationalizedNow(getLocalTimeZone())
const internalValue = shallowRef<Time>(
  modelValue.value ?? props.defaultValue ?? new Time(_now.hour, _now.minute),
)

// Sync inbound: parent resets the value → update internalValue.
watch(modelValue, (v) => {
  if (v instanceof Time) internalValue.value = v
})

// Route segment edits from TimeField back to both internalValue and modelValue.
function onFieldChange(v: Time | null | undefined) {
  if (!(v instanceof Time)) return
  internalValue.value = v
  modelValue.value = v
}

// Route wheel selections from TimeScroller back to both internalValue and modelValue.
function onScrollerChange(v: Time) {
  internalValue.value = v
  modelValue.value = v
  if (props.closeOnSelect) {
    // Scroller selection is a single-field change (hour OR minute OR second),
    // not a "done" action — do NOT auto-close here. closeOnSelect exists for
    // parity with DateTimePicker's prop surface, matching its own behavior of
    // not auto-closing on a single time-field tap either.
  }
}

const slotFns = computed(() =>
  timePickerVariants({
    isInvalid: props.isInvalid,
    isDisabled: props.isDisabled,
    fullWidth: props.fullWidth,
  }),
)
</script>

<template>
  <div
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    data-slot="time-picker"
  >
    <Popover
      v-model:open="openModel"
      :default-open="defaultOpen"
      :modal="modal"
    >
      <TimeField
        :model-value="internalValue"
        :variant="variant"
        :size="size"
        :color="color"
        :label-placement="labelPlacement"
        :full-width="fullWidth"
        :default-value="defaultValue"
        :default-placeholder="defaultPlaceholder"
        :placeholder-value="placeholderValue"
        :min-value="minValue"
        :max-value="maxValue"
        :granularity="granularity"
        :hour-cycle="hourCycle"
        :step="step"
        :step-snapping="stepSnapping"
        :locale="locale"
        :label="label"
        :description="description"
        :error-message="errorMessage"
        :is-invalid="isInvalid"
        :is-disabled="isDisabled"
        :is-read-only="isReadOnly"
        :is-required="isRequired"
        :name="name"
        :hide-time-zone="hideTimeZone"
        :required="required"
        :dir="dir"
        @update:model-value="(val) => onFieldChange(val as Time | null | undefined)"
      >
        <template #endContent>
          <PopoverTrigger
            :class="composeClassName(slotFns.trigger(), props.classNames?.trigger)"
            :as="triggerAs"
            :as-child="triggerAsChild"
            aria-label="Open time picker"
            @mousedown.prevent
          >
            <slot name="selectorIcon">
              <svg
                :class="composeClassName(slotFns.triggerIndicator(), props.classNames?.triggerIndicator)"
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
                focusable="false"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </slot>
          </PopoverTrigger>
        </template>
      </TimeField>

      <PopoverContent
        :class="composeClassName(slotFns.popover(), props.classNames?.popover)"
        data-slot="popover"
        :side-offset="sideOffset ?? 8"
        :side="side"
        :side-flip="sideFlip"
        :align="align"
        :align-offset="alignOffset"
        :align-flip="alignFlip"
        :avoid-collisions="avoidCollisions"
        :collision-boundary="collisionBoundary"
        :collision-padding="collisionPadding"
        :arrow-padding="arrowPadding"
        :hide-shifted-arrow="hideShiftedArrow"
        :sticky="sticky"
        :hide-when-detached="hideWhenDetached"
        :position-strategy="positionStrategy"
        :update-position-strategy="updatePositionStrategy"
        :disable-update-on-layout-shift="disableUpdateOnLayoutShift"
        :prioritize-position="prioritizePosition"
      >
        <div
          :class="composeClassName(slotFns.panel(), props.classNames?.panel)"
          data-slot="panel"
        >
          <TimeScroller
            :model-value="internalValue"
            :granularity="granularity === 'hour' ? 'minute' : granularity"
            :hour-cycle="hourCycle"
            @update:model-value="(val) => onScrollerChange(val as Time)"
          />

          <div
            :class="composeClassName(slotFns.timeDone(), props.classNames?.timeDone)"
            data-slot="time-done"
          >
            <slot name="footer" :close="() => { openModel = false }">
              <Button
                size="sm"
                color="primary"
                data-slot="done-button"
                @click="openModel = false"
              >
                {{ doneLabel }}
              </Button>
            </slot>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>
