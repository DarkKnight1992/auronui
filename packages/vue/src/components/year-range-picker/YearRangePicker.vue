<script setup lang="ts">
import { computed } from 'vue'
import {
  YearRangePickerRoot,
  YearRangePickerHeader,
  YearRangePickerHeading,
  YearRangePickerPrev,
  YearRangePickerNext,
  YearRangePickerGrid,
  YearRangePickerGridBody,
  YearRangePickerGridRow,
  YearRangePickerCell,
  YearRangePickerCellTrigger,
} from 'reka-ui'
import type { DateValue } from '@internationalized/date'
import { yearRangePickerVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'

export interface DateRange {
  start: DateValue
  end: DateValue
}

const props = withDefaults(defineProps<{
  defaultValue?: DateRange | null
  defaultPlaceholder?: DateValue
  minValue?: DateValue
  maxValue?: DateValue
  isYearDisabled?: (date: DateValue) => boolean
  isYearUnavailable?: (date: DateValue) => boolean
  locale?: string
  yearsPerPage?: number
  preventDeselect?: boolean
  allowNonContiguousRanges?: boolean
  maximumYears?: number
  readonly?: boolean
  disabled?: boolean
  calendarLabel?: string
  /** Initial focus state. @default false */
  initialFocus?: boolean
  /** Text direction. */
  dir?: 'ltr' | 'rtl'
  /** Navigate to next page. */
  nextPage?: (placeholder: DateValue) => DateValue
  /** Navigate to previous page. */
  prevPage?: (placeholder: DateValue) => DateValue
  /** Fix one end of the range. */
  fixedDate?: 'start' | 'end'
  /** Render as a different element or component. */
  as?: string
  /** Render child as root element. */
  asChild?: boolean
  class?: ClassValue
  /** Per-slot class overrides */
  classNames?: Partial<{
    base: ClassValue
    header: ClassValue
    navButton: ClassValue
    navButtonIcon: ClassValue
    heading: ClassValue
    grid: ClassValue
    gridBody: ClassValue
    gridRow: ClassValue
    cell: ClassValue
  }>
}>(), {
  yearsPerPage: 12,
  preventDeselect: false,
  allowNonContiguousRanges: false,
  readonly: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:start-value': [value: DateValue | undefined]
}>()

const modelValue = defineModel<DateRange | null>()
const placeholderModel = defineModel<DateValue | undefined>('placeholder')

const slotFns = computed(() => yearRangePickerVariants())
</script>

<template>
  <YearRangePickerRoot
    v-model="modelValue"
    v-model:placeholder="placeholderModel"
    :default-value="defaultValue ?? undefined"
    :default-placeholder="defaultPlaceholder"
    :min-value="minValue"
    :max-value="maxValue"
    :is-year-disabled="isYearDisabled"
    :is-year-unavailable="isYearUnavailable"
    :locale="locale"
    :years-per-page="yearsPerPage"
    :prevent-deselect="preventDeselect"
    :allow-non-contiguous-ranges="allowNonContiguousRanges"
    :maximum-years="maximumYears"
    :readonly="readonly"
    :disabled="disabled"
    :calendar-label="calendarLabel"
    :initial-focus="initialFocus"
    :dir="dir"
    :next-page="nextPage"
    :prev-page="prevPage"
    :fixed-date="fixedDate"
    :as="as"
    :as-child="asChild"
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    @update:start-value="emit('update:start-value', $event)"
  >
    <template #default="{ grid }">
      <YearRangePickerHeader :class="composeClassName(slotFns.header(), props.classNames?.header)">
        <YearRangePickerPrev
          :class="composeClassName(slotFns.navButton(), props.classNames?.navButton)"
          aria-label="Previous years"
        >
          <svg
            :class="composeClassName(slotFns.navButtonIcon(), props.classNames?.navButtonIcon)"
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
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </YearRangePickerPrev>

        <YearRangePickerHeading
          v-slot="{ headingValue }"
          :class="composeClassName(slotFns.heading(), props.classNames?.heading)"
        >
          <slot
            name="heading"
            :heading-value="headingValue"
          >
            {{ headingValue }}
          </slot>
        </YearRangePickerHeading>

        <YearRangePickerNext
          :class="composeClassName(slotFns.navButton(), props.classNames?.navButton)"
          aria-label="Next years"
        >
          <svg
            :class="composeClassName(slotFns.navButtonIcon(), props.classNames?.navButtonIcon)"
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
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </YearRangePickerNext>
      </YearRangePickerHeader>

      <YearRangePickerGrid :class="composeClassName(slotFns.grid(), props.classNames?.grid)">
        <YearRangePickerGridBody :class="composeClassName(slotFns.gridBody(), props.classNames?.gridBody)">
          <YearRangePickerGridRow
            v-for="(row, rowIndex) in grid.rows"
            :key="rowIndex"
            :class="composeClassName(slotFns.gridRow(), props.classNames?.gridRow)"
          >
            <YearRangePickerCell
              v-for="yearValue in row"
              :key="yearValue.toString()"
              :date="yearValue"
            >
              <YearRangePickerCellTrigger
                :year="yearValue"
                as="button"
                :class="composeClassName(slotFns.cell(), props.classNames?.cell)"
              />
            </YearRangePickerCell>
          </YearRangePickerGridRow>
        </YearRangePickerGridBody>
      </YearRangePickerGrid>
    </template>
  </YearRangePickerRoot>
</template>
