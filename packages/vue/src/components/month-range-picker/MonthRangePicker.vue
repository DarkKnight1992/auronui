<script setup lang="ts">
import { computed } from 'vue'
import {
  MonthRangePickerRoot,
  MonthRangePickerHeader,
  MonthRangePickerHeading,
  MonthRangePickerPrev,
  MonthRangePickerNext,
  MonthRangePickerGrid,
  MonthRangePickerGridBody,
  MonthRangePickerGridRow,
  MonthRangePickerCell,
  MonthRangePickerCellTrigger,
} from 'reka-ui'
import type { DateValue } from '@internationalized/date'
import { monthRangePickerVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

export interface DateRange {
  start: DateValue
  end: DateValue
}

const props = withDefaults(defineProps<{
  defaultValue?: DateRange | null
  defaultPlaceholder?: DateValue
  minValue?: DateValue
  maxValue?: DateValue
  isMonthDisabled?: (date: DateValue) => boolean
  isMonthUnavailable?: (date: DateValue) => boolean
  locale?: string
  preventDeselect?: boolean
  allowNonContiguousRanges?: boolean
  maximumMonths?: number
  readonly?: boolean
  isDisabled?: boolean
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean
  calendarLabel?: string
  /** Initial focus state. @default false */
  initialFocus?: boolean
  /** Text direction. */
  dir?: 'ltr' | 'rtl'
  /** Navigate to next page (next year). */
  nextPage?: (placeholder: DateValue) => DateValue
  /** Navigate to previous page (previous year). */
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
  preventDeselect: false,
  allowNonContiguousRanges: false,
  readonly: false,
  isDisabled: undefined,
  disabled: undefined,
})

const emit = defineEmits<{
  'update:start-value': [value: DateValue | undefined]
}>()

const modelValue = defineModel<DateRange | null>()
const placeholderModel = defineModel<DateValue | undefined>('placeholder')

const isDisabled = useDeprecatedBooleanProp(
  'MonthRangePicker', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)

const slotFns = computed(() => monthRangePickerVariants())
</script>

<template>
  <MonthRangePickerRoot
    v-model="modelValue"
    v-model:placeholder="placeholderModel"
    :default-value="defaultValue ?? undefined"
    :default-placeholder="defaultPlaceholder"
    :min-value="minValue"
    :max-value="maxValue"
    :is-month-disabled="isMonthDisabled"
    :is-month-unavailable="isMonthUnavailable"
    :locale="locale"
    :prevent-deselect="preventDeselect"
    :allow-non-contiguous-ranges="allowNonContiguousRanges"
    :maximum-months="maximumMonths"
    :readonly="readonly"
    :disabled="isDisabled"
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
      <MonthRangePickerHeader :class="composeClassName(slotFns.header(), props.classNames?.header)">
        <MonthRangePickerPrev
          :class="composeClassName(slotFns.navButton(), props.classNames?.navButton)"
          aria-label="Previous year"
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
        </MonthRangePickerPrev>

        <MonthRangePickerHeading
          v-slot="{ headingValue }"
          :class="composeClassName(slotFns.heading(), props.classNames?.heading)"
        >
          <slot
            name="heading"
            :heading-value="headingValue"
          >
            {{ headingValue }}
          </slot>
        </MonthRangePickerHeading>

        <MonthRangePickerNext
          :class="composeClassName(slotFns.navButton(), props.classNames?.navButton)"
          aria-label="Next year"
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
        </MonthRangePickerNext>
      </MonthRangePickerHeader>

      <MonthRangePickerGrid :class="composeClassName(slotFns.grid(), props.classNames?.grid)">
        <MonthRangePickerGridBody :class="composeClassName(slotFns.gridBody(), props.classNames?.gridBody)">
          <MonthRangePickerGridRow
            v-for="(row, rowIndex) in grid.rows"
            :key="rowIndex"
            :class="composeClassName(slotFns.gridRow(), props.classNames?.gridRow)"
          >
            <MonthRangePickerCell
              v-for="monthValue in row"
              :key="monthValue.toString()"
              :date="monthValue"
            >
              <MonthRangePickerCellTrigger
                :month="monthValue"
                as="button"
                :class="composeClassName(slotFns.cell(), props.classNames?.cell)"
              />
            </MonthRangePickerCell>
          </MonthRangePickerGridRow>
        </MonthRangePickerGridBody>
      </MonthRangePickerGrid>
    </template>
  </MonthRangePickerRoot>
</template>
