<script setup lang="ts">
import { computed } from 'vue'
import {
  DatePickerRoot,
  DatePickerTrigger,
  DatePickerContent,
} from 'reka-ui'
import type { DateValue } from '@internationalized/date'
import { datePickerVariants, type DateInputVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import Calendar from '../calendar/Calendar.vue'
import DateInput from '../date-input/DateInput.vue'

const props = withDefaults(defineProps<{
  /* Field appearance — forwarded to DateInput */
  variant?: DateInputVariants['variant']
  size?: DateInputVariants['size']
  color?: DateInputVariants['color']
  labelPlacement?: DateInputVariants['labelPlacement']
  fullWidth?: boolean

  defaultValue?: DateValue
  defaultOpen?: boolean
  defaultPlaceholder?: DateValue
  placeholderValue?: DateValue
  minValue?: DateValue
  maxValue?: DateValue
  isDateUnavailable?: (date: DateValue) => boolean
  isDateDisabled?: (date: DateValue) => boolean
  locale?: string
  granularity?: 'day' | 'hour' | 'minute' | 'second'
  hourCycle?: 12 | 24
  /** Steps for segment keyboard navigation. */
  step?: Partial<Record<'hour' | 'minute' | 'second' | 'millisecond', number>>
  hideTimeZone?: boolean
  label?: string
  description?: string
  errorMessage?: string
  isInvalid?: boolean
  isDisabled?: boolean
  isReadOnly?: boolean
  isRequired?: boolean
  name?: string
  visibleMonths?: number
  pageBehavior?: 'visible' | 'single'
  closeOnSelect?: boolean
  modal?: boolean
  /** Text direction. */
  dir?: 'ltr' | 'rtl'
  /** HTML id attribute forwarded to the root DatePickerRoot element. */
  id?: string
  /** Marks the field as required. */
  required?: boolean
  /** Use paged navigation (advance by numberOfMonths). */
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
  class?: ClassValue
  /** Override classes for specific slots */
  classNames?: Partial<{
    base: ClassValue
    trigger: ClassValue
    triggerIndicator: ClassValue
    popover: ClassValue
    calendar: Partial<{
      base: ClassValue
      header: ClassValue
      navButton: ClassValue
      navButtonIcon: ClassValue
      heading: ClassValue
      headingButton: ClassValue
      grid: ClassValue
      gridHeader: ClassValue
      gridRow: ClassValue
      headerCell: ClassValue
      gridBody: ClassValue
      cell: ClassValue
      cellButton: ClassValue
      monthGrid: ClassValue
      monthGridBody: ClassValue
      monthGridRow: ClassValue
      monthCell: ClassValue
      yearView: Partial<{
        header: ClassValue
        navButton: ClassValue
        navButtonIcon: ClassValue
        heading: ClassValue
        yearGrid: ClassValue
        yearGridBody: ClassValue
        yearGridRow: ClassValue
        yearCell: ClassValue
      }>
    }>
    dateInput: Partial<{
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
  closeOnSelect: true,
  modal: false,
  visibleMonths: 1,
  defaultOpen: false,
  avoidCollisions: true,
  collisionPadding: 8,
  prioritizePosition: true,
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

const modelValue = defineModel<DateValue | null | undefined>('modelValue')
const openModel = defineModel<boolean>('open')

const slotFns = computed(() => datePickerVariants())

// Reka treats `undefined` as "uncontrolled mode" — always pass null (controlled + empty) instead.
const rekaModelValue = computed<DateValue | null>({
  get: () => modelValue.value ?? null,
  set: (val: DateValue | null) => { modelValue.value = val ?? null },
})

// Sync Calendar's `DateValue` v-model with DatePicker's `DateValue | null` model,
// and close the popover on selection when closeOnSelect is enabled.
const calendarValue = computed<DateValue | undefined>({
  get: () => modelValue.value ?? undefined,
  set: (val) => {
    modelValue.value = val ?? null
    if (props.closeOnSelect && val != null) {
      openModel.value = false
    }
  },
})
</script>

<template>
  <DatePickerRoot
    v-model="rekaModelValue"
    v-model:open="openModel"
    :default-value="defaultValue"
    :default-open="defaultOpen"
    :default-placeholder="defaultPlaceholder"
    :placeholder-value="placeholderValue"
    :min-value="minValue"
    :max-value="maxValue"
    :is-date-unavailable="isDateUnavailable"
    :id="id"
    :is-date-disabled="isDateDisabled"
    :locale="locale"
    :granularity="granularity"
    :hour-cycle="hourCycle"
    :step="step"
    :hide-time-zone="hideTimeZone"
    :disabled="isDisabled"
    :readonly="isReadOnly"
    :name="name"
    :dir="dir"
    :required="required"
    :paged-navigation="pagedNavigation"
    :week-starts-on="weekStartsOn"
    :weekday-format="weekdayFormat"
    :fixed-weeks="fixedWeeks"
    :number-of-months="numberOfMonths ?? visibleMonths"
    :prevent-deselect="preventDeselect"
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    data-slot="date-picker"
  >
    <!-- DateInput hosts label/helper/field; trigger sits in its endContent slot -->
    <DateInput
      v-model="modelValue"
      :variant="variant"
      :size="size"
      :color="color"
      :label-placement="labelPlacement"
      :full-width="fullWidth"
      :default-value="defaultValue"
      :placeholder-value="placeholderValue"
      :min-value="minValue"
      :max-value="maxValue"
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
      :class-names="props.classNames?.dateInput"
    >
      <template #endContent>
        <DatePickerTrigger
          :class="composeClassName(slotFns.trigger(), props.classNames?.trigger)"
          :as="triggerAs"
          :as-child="triggerAsChild"
          aria-label="Open date picker"
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

    <!-- Popover (portaled + positioned by Reka) -->
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
      <slot name="calendarTopContent" />

      <Calendar
        v-model="calendarValue"
        :default-value="defaultValue"
        :default-placeholder="placeholderValue ?? defaultValue"
        :min-value="minValue"
        :max-value="maxValue"
        :is-date-disabled="isDateDisabled"
        :is-date-unavailable="isDateUnavailable"
        :locale="locale"
        :number-of-months="visibleMonths"
        :readonly="isReadOnly"
        :disabled="isDisabled"
        :class-names="props.classNames?.calendar"
      />

      <slot name="calendarBottomContent" />
    </DatePickerContent>
  </DatePickerRoot>
</template>
