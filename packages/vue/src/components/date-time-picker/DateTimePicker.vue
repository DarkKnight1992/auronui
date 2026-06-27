<!-- packages/vue/src/components/date-time-picker/DateTimePicker.vue -->
<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue'
import {
  DatePickerRoot,
  DatePickerTrigger,
  DatePickerContent,
} from 'reka-ui'
import {
  type DateValue,
  CalendarDateTime,
  toCalendarDate,
  today,
  getLocalTimeZone,
} from '@internationalized/date'
import { AnimatePresence, motion } from 'motion-v'
import { dateTimePickerVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import Calendar from '../calendar/Calendar.vue'
import DateInput from '../date-input/DateInput.vue'
import DateTimePickerTimeScroller from './DateTimePickerTimeScroller.vue'

type Step = 'date' | 'time'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  variant?: 'flat' | 'bordered' | 'faded' | 'underlined'
  size?: 'sm' | 'md' | 'lg'
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  labelPlacement?: 'inside' | 'outside' | 'outside-left'
  fullWidth?: boolean
  label?: string
  description?: string
  errorMessage?: string
  isInvalid?: boolean
  isDisabled?: boolean
  isReadOnly?: boolean
  isRequired?: boolean
  name?: string
  class?: ClassValue
  /** Override classes for individual slots */
  classNames?: Partial<{
    base: ClassValue
    trigger: ClassValue
    triggerIndicator: ClassValue
    popover: ClassValue
    stepHeader: ClassValue
    navButton: ClassValue
    stepTitle: ClassValue
    doneLabel: ClassValue
    panelWrap: ClassValue
  }>
  granularity?: 'minute' | 'second'
  hourCycle?: 12 | 24
  hideTimeZone?: boolean
  defaultOpen?: boolean
  closeOnSelect?: boolean
  locale?: string
  defaultValue?: CalendarDateTime
  /** Initial placeholder date for the calendar. */
  defaultPlaceholder?: DateValue
  /** Controlled placeholder date. */
  placeholder?: DateValue
  minValue?: CalendarDateTime
  maxValue?: CalendarDateTime
  isDateUnavailable?: (date: DateValue) => boolean
  isDateDisabled?: (date: DateValue) => boolean
  /** Steps for segment keyboard navigation. */
  step?: Partial<Record<'hour' | 'minute' | 'second' | 'millisecond', number>>
  /** Text direction. */
  dir?: 'ltr' | 'rtl'
  /** HTML id attribute forwarded to the root element. */
  id?: string
  /** Whether the calendar popover is modal (traps focus). */
  modal?: boolean
  /** Marks the field as required. */
  required?: boolean
  /** Use paged navigation in the calendar. */
  pagedNavigation?: boolean
  /** Day the week starts on. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  /** Format for weekday header cells. */
  weekdayFormat?: 'narrow' | 'short' | 'long'
  /** Always show 6 weeks per month. */
  fixedWeeks?: boolean
  /** Number of months shown in the calendar. */
  numberOfMonths?: number
  /** Prevent deselecting a selected date. */
  preventDeselect?: boolean
  /** Render trigger as a different element. */
  triggerAs?: string
  /** Render trigger child as root element. */
  triggerAsChild?: boolean
  /** Portal target for the content. */
  portal?: string | HTMLElement
  /** Force the content to stay mounted. */
  forceMount?: boolean
  /** Side of the anchor the content appears on. */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Distance in px from the anchor. */
  sideOffset?: number
  /** Allow flipping to opposite side. */
  sideFlip?: boolean
  /** Alignment of the content relative to the anchor. */
  align?: 'start' | 'center' | 'end'
  /** Offset along the align axis. */
  alignOffset?: number
  /** Allow flipping alignment. */
  alignFlip?: boolean
  /** Avoid collisions with the viewport. */
  avoidCollisions?: boolean
  /** Elements to use as collision boundaries. */
  collisionBoundary?: Element | null | Array<Element | null>
  /** Padding for collision detection. */
  collisionPadding?: number | Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>
  /** Padding between arrow and content edge. */
  arrowPadding?: number
  /** Hide the arrow when it is shifted. */
  hideShiftedArrow?: boolean
  /** Sticky behavior when overflowing. */
  sticky?: 'partial' | 'always'
  /** Hide content when anchor is detached. */
  hideWhenDetached?: boolean
  /** CSS position strategy. */
  positionStrategy?: 'fixed' | 'absolute'
  /** When to recalculate position. */
  updatePositionStrategy?: 'always' | 'optimized'
  /** Disable position update on layout shift. */
  disableUpdateOnLayoutShift?: boolean
  /** Prioritize keeping content in viewport. */
  prioritizePosition?: boolean
  /** Virtual reference element for positioning. */
  reference?: object | null
  /** Render content as a different element. */
  contentAs?: string
  /** Render content child as root element. */
  contentAsChild?: boolean
  /** Disable pointer events outside the content. */
  disableOutsidePointerEvents?: boolean
}>(), {
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
  defaultOpen: false,
  closeOnSelect: true,
})

const emit = defineEmits<{
  'update:placeholder': [value: DateValue | undefined]
  'escape-key-down': [event: KeyboardEvent]
  'pointer-down-outside': [event: Event]
  'focus-outside': [event: Event]
  'interact-outside': [event: Event]
  'open-auto-focus': [event: Event]
  'close-auto-focus': [event: Event]
}>()

const modelValue = defineModel<CalendarDateTime | null | undefined>('modelValue')
const openModel = defineModel<boolean>('open', { default: undefined })

const STEP_TITLES: Record<Step, string> = {
  date: 'Pick a date',
  time: 'Pick a time',
}
const STEP_ORDER: Step[] = ['date', 'time']

// Seed controlled open state from defaultOpen so portal renders in uncontrolled mode too
if (props.defaultOpen && openModel.value === undefined) {
  openModel.value = true
}

// Seed controlled value from defaultValue so DateFieldRoot is always in controlled
// mode from the start. Without this, an uncontrolled→controlled transition
// happens mid-lifecycle and Reka's DateFieldRoot won't re-render segments.
if (modelValue.value == null && props.defaultValue != null) {
  modelValue.value = props.defaultValue
}

// Internal working value — always a CalendarDateTime, never null/undefined.
const _today = today(getLocalTimeZone())
const internalValue = shallowRef<CalendarDateTime>(
  modelValue.value ?? props.defaultValue ?? new CalendarDateTime(_today.year, _today.month, _today.day, 0, 0),
)

// Sync inbound: parent resets the value → update internalValue.
// Guard on CalendarDateTime: ignore CalendarDate emits (no time info).
watch(modelValue, (v) => {
  if (v instanceof CalendarDateTime) internalValue.value = v
})

// Route segment edits from DateInput back to both internalValue and modelValue.
// DateInput is bound to internalValue (not modelValue) so this is the only place
// that propagates user-typed changes outward.
function onInputChange(v: DateValue | null | undefined) {
  if (!(v instanceof CalendarDateTime)) return
  internalValue.value = v
  modelValue.value = v
}

// ─── Step state ──────────────────────────────────────────────────────────

const activeStep = ref<Step>('date')
const direction = ref<1 | -1>(1)

watch(openModel, (open) => {
  if (open) activeStep.value = 'date'
})

function goTo(step: Step) {
  const from = STEP_ORDER.indexOf(activeStep.value)
  const to = STEP_ORDER.indexOf(step)
  direction.value = to > from ? 1 : -1
  activeStep.value = step
}

function goBack() {
  const idx = STEP_ORDER.indexOf(activeStep.value)
  if (idx > 0) goTo(STEP_ORDER[idx - 1])
}

function goForward() {
  const idx = STEP_ORDER.indexOf(activeStep.value)
  if (idx < STEP_ORDER.length - 1) {
    goTo(STEP_ORDER[idx + 1])
  } else if (props.closeOnSelect) {
    openModel.value = false
  }
}

// ─── Panel animation variants ────────────────────────────────────────────

const panelInitial = computed(() => ({ x: direction.value > 0 ? '100%' : '-100%', opacity: 0 }))
const panelAnimate = { x: '0%', opacity: 1 }
const panelExit = computed(() => ({ x: direction.value > 0 ? '-100%' : '100%', opacity: 0 }))

// ─── Calendar value sync ─────────────────────────────────────────────────

const calendarValue = computed<DateValue | undefined>({
  // Pass CalendarDate to CalendarRoot — Reka always emits CalendarDate from
  // onDateChange. The setter reconstructs the full CalendarDateTime.
  get: () => toCalendarDate(internalValue.value),
  set: (val) => {
    if (!val) return
    internalValue.value = internalValue.value.set({
      year: val.year,
      month: val.month,
      day: val.day,
    })
    modelValue.value = internalValue.value
    goTo('time')
  },
})

// ─── Time update ─────────────────────────────────────────────────────────

function onTimeUpdate(val: CalendarDateTime) {
  internalValue.value = val
  modelValue.value = val
}

// ─── Styles ──────────────────────────────────────────────────────────────

const slotFns = computed(() =>
  dateTimePickerVariants({
    isInvalid: props.isInvalid,
    isDisabled: props.isDisabled,
    fullWidth: props.fullWidth,
  }),
)
</script>

<template>
  <DatePickerRoot
    v-model="modelValue"
    v-model:open="openModel"
    :default-value="defaultValue"
    :default-open="defaultOpen"
    :default-placeholder="defaultPlaceholder"
    :placeholder="placeholder"
    :min-value="minValue"
    :max-value="maxValue"
    :is-date-unavailable="isDateUnavailable"
    :is-date-disabled="isDateDisabled"
    :locale="locale"
    :granularity="granularity"
    :hour-cycle="hourCycle"
    :step="step"
    :disabled="isDisabled"
    :readonly="isReadOnly"
    :name="name"
    :dir="dir"
    :id="id"
    :required="required"
    :modal="modal"
    :paged-navigation="pagedNavigation"
    :week-starts-on="weekStartsOn"
    :weekday-format="weekdayFormat"
    :fixed-weeks="fixedWeeks"
    :number-of-months="numberOfMonths"
    :prevent-deselect="preventDeselect"
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    data-slot="date-time-picker"
  >
    <DateInput
      :model-value="internalValue"
      :variant="variant"
      :size="size"
      :color="color"
      :label-placement="labelPlacement"
      :full-width="fullWidth"
      :default-value="defaultValue"
      :granularity="granularity"
      :hour-cycle="hourCycle"
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
      @update:model-value="onInputChange"
    >
      <template #endContent>
        <DatePickerTrigger
          :class="composeClassName(slotFns.trigger(), props.classNames?.trigger)"
          :as="triggerAs"
          :as-child="triggerAsChild"
          aria-label="Open date time picker"
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
              <rect
                x="3"
                y="4"
                width="18"
                height="18"
                rx="2"
                ry="2"
              />
              <line
                x1="16"
                y1="2"
                x2="16"
                y2="6"
              />
              <line
                x1="8"
                y1="2"
                x2="8"
                y2="6"
              />
              <line
                x1="3"
                y1="10"
                x2="21"
                y2="10"
              />
            </svg>
          </slot>
        </DatePickerTrigger>
      </template>
    </DateInput>

    <DatePickerContent
      :class="composeClassName(slotFns.popover(), props.classNames?.popover)"
      data-slot="popover"
      :side-offset="sideOffset ?? 8"
      :portal="portal != null ? { to: portal } : undefined"
      :force-mount="forceMount"
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
      :reference="(reference as any)"
      :as="contentAs"
      :as-child="contentAsChild"
      :disable-outside-pointer-events="disableOutsidePointerEvents"
      @escape-key-down="emit('escape-key-down', $event)"
      @pointer-down-outside="emit('pointer-down-outside', $event)"
      @focus-outside="emit('focus-outside', $event)"
      @interact-outside="emit('interact-outside', $event)"
      @open-auto-focus="emit('open-auto-focus', $event)"
      @close-auto-focus="emit('close-auto-focus', $event)"
    >
      <!-- Step header -->
      <div
        :class="composeClassName(slotFns.stepHeader(), props.classNames?.stepHeader)"
        data-slot="step-header"
      >
        <button
          type="button"
          :class="composeClassName(slotFns.navButton(), props.classNames?.navButton)"
          :data-hidden="activeStep === 'date' ? 'true' : undefined"
          aria-label="Previous step"
          data-slot="back-button"
          @click="goBack"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <span :class="composeClassName(slotFns.stepTitle(), props.classNames?.stepTitle)">{{ STEP_TITLES[activeStep] }}</span>

        <button
          type="button"
          :class="composeClassName(slotFns.navButton(), props.classNames?.navButton)"
          :aria-label="activeStep === 'time' ? 'Done' : 'Next step'"
          data-slot="forward-button"
          @click="goForward"
        >
          <span
            v-if="activeStep === 'time'"
            :class="composeClassName(slotFns.doneLabel(), props.classNames?.doneLabel)"
          >Done</span>
          <svg
            v-else
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <!-- Sliding panels -->
      <div
        :class="composeClassName(slotFns.panelWrap(), props.classNames?.panelWrap)"
        style="overflow: hidden;"
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            v-if="activeStep === 'date'"
            key="date"
            :initial="panelInitial"
            :animate="panelAnimate"
            :exit="panelExit"
            :transition="{ duration: 0.15 }"
            class="px-3 pb-3"
            data-slot="calendar-panel"
          >
            <Calendar
              v-model="calendarValue"
              :default-value="defaultValue"
              :min-value="minValue"
              :max-value="maxValue"
              :is-date-disabled="isDateDisabled"
              :is-date-unavailable="isDateUnavailable"
              :locale="locale"
              :readonly="isReadOnly"
              :disabled="isDisabled"
            />
          </motion.div>

          <motion.div
            v-else-if="activeStep === 'time'"
            key="time"
            :initial="panelInitial"
            :animate="panelAnimate"
            :exit="panelExit"
            :transition="{ duration: 0.15 }"
          >
            <DateTimePickerTimeScroller
              :model-value="internalValue"
              :granularity="granularity"
              :hour-cycle="hourCycle"
              @update:model-value="onTimeUpdate"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </DatePickerContent>
  </DatePickerRoot>
</template>
