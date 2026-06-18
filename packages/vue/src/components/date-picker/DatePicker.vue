<script setup lang="ts">
import { computed } from 'vue'
import {
  DatePickerRoot,
  DatePickerTrigger,
  DatePickerContent,
} from 'reka-ui'
import type { DateValue } from '@internationalized/date'
import type { CalendarDateTime, ZonedDateTime } from '@internationalized/date'
import { datePickerVariants, type DateInputVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
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
  placeholderValue?: DateValue
  minValue?: DateValue
  maxValue?: DateValue
  isDateUnavailable?: (date: DateValue) => boolean
  isDateDisabled?: (date: DateValue) => boolean
  locale?: string
  granularity?: 'day' | 'hour' | 'minute' | 'second'
  hourCycle?: 12 | 24
  label?: string
  description?: string
  errorMessage?: string
  isInvalid?: boolean
  isDisabled?: boolean
  isReadOnly?: boolean
  isRequired?: boolean
  name?: string
  hideTimeZone?: boolean
  visibleMonths?: number
  pageBehavior?: 'visible' | 'single'
  closeOnSelect?: boolean
  modal?: boolean
  class?: string
  /** Override classes for individual slots (base, trigger, triggerIndicator, popover) */
  classNames?: Partial<{
    base: string
    trigger: string
    triggerIndicator: string
    popover: string
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
  closeOnSelect: true,
  modal: false,
  visibleMonths: 1,
  defaultOpen: false,
})

const modelValue = defineModel<DateValue | null | undefined>('modelValue')
const openModel = defineModel<boolean>('open')

const slotFns = computed(() => datePickerVariants())

// Sync Calendar's `DateValue` v-model with DatePicker's `DateValue | null` model,
// and close the popover on selection when closeOnSelect is enabled.
// When the current value carries a time component (CalendarDateTime / ZonedDateTime),
// preserve it so clicking a date in the calendar doesn't wipe out the time the user
// typed into the field segments.
const calendarValue = computed<DateValue | undefined>({
  get: () => modelValue.value ?? undefined,
  set: (val) => {
    if (val != null && modelValue.value != null && 'hour' in modelValue.value) {
      const existing = modelValue.value as CalendarDateTime | ZonedDateTime
      modelValue.value = existing.set({ year: val.year, month: val.month, day: val.day })
    } else {
      modelValue.value = val ?? null
    }
    if (props.closeOnSelect && val != null) {
      openModel.value = false
    }
  },
})
</script>

<template>
  <DatePickerRoot
    v-model="modelValue"
    v-model:open="openModel"
    :default-value="defaultValue"
    :default-open="defaultOpen"
    :placeholder-value="placeholderValue"
    :min-value="minValue"
    :max-value="maxValue"
    :is-date-unavailable="isDateUnavailable"
    :is-date-disabled="isDateDisabled"
    :locale="locale"
    :granularity="granularity"
    :hour-cycle="hourCycle"
    :disabled="isDisabled"
    :readonly="isReadOnly"
    :name="name"
    :number-of-months="visibleMonths"
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
      :hide-time-zone="hideTimeZone"
    >
      <template #endContent>
        <DatePickerTrigger
          :class="composeClassName(slotFns.trigger(), props.classNames?.trigger)"
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
      :side-offset="8"
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
      />

      <slot name="calendarBottomContent" />
    </DatePickerContent>
  </DatePickerRoot>
</template>
