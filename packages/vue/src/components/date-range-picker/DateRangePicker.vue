<script setup lang="ts">
import { computed } from 'vue'
import {
  DateRangePickerRoot,
  DateRangePickerTrigger,
  DateRangePickerContent,
} from 'reka-ui'
import type { DateValue } from '@internationalized/date'
import { dateRangePickerVariants, type DateRangeFieldVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import RangeCalendar from '../range-calendar/RangeCalendar.vue'
import DateRangeField from '../date-range-field/DateRangeField.vue'

export interface DateRange {
  start: DateValue
  end: DateValue
}

const props = withDefaults(defineProps<{
  /* Field appearance — forwarded to DateRangeField */
  variant?: DateRangeFieldVariants['variant']
  size?: DateRangeFieldVariants['size']
  color?: DateRangeFieldVariants['color']
  labelPlacement?: DateRangeFieldVariants['labelPlacement']
  fullWidth?: boolean

  defaultValue?: DateRange
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

const modelValue = defineModel<DateRange | null | undefined>('modelValue')
const openModel = defineModel<boolean>('open')

const slotFns = computed(() => dateRangePickerVariants())

// Sync RangeCalendar's `DateRange | null` v-model with DateRangePicker's model,
// and close the popover when a complete range is selected (closeOnSelect).
const rangeValue = computed<DateRange | null>({
  get: () => modelValue.value ?? null,
  set: (val) => {
    modelValue.value = val ?? null
    if (props.closeOnSelect && val?.start && val?.end) {
      openModel.value = false
    }
  },
})
</script>

<template>
  <DateRangePickerRoot
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
    :class="composeClassName(slotFns.base(), props.class)"
    data-slot="date-range-picker"
  >
    <!-- DateRangeField hosts label/helper/field; trigger sits in its endContent slot -->
    <DateRangeField
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
        <DateRangePickerTrigger
          :class="slotFns.trigger()"
          aria-label="Open date range picker"
          @mousedown.prevent
        >
          <slot name="selectorIcon">
            <svg
              :class="slotFns.triggerIndicator()"
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
        </DateRangePickerTrigger>
      </template>
    </DateRangeField>

    <!-- Popover (portaled + positioned by Reka) -->
    <DateRangePickerContent
      :class="slotFns.popover()"
      data-slot="popover"
      :side-offset="8"
    >
      <slot name="calendarTopContent" />

      <RangeCalendar
        v-model="rangeValue"
        :default-placeholder="placeholderValue"
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
    </DateRangePickerContent>
  </DateRangePickerRoot>
</template>
