<script setup lang="ts">
import { computed } from 'vue'
import {
  MonthPickerRoot,
  MonthPickerHeader,
  MonthPickerHeading,
  MonthPickerPrev,
  MonthPickerNext,
  MonthPickerGrid,
  MonthPickerGridBody,
  MonthPickerGridRow,
  MonthPickerCell,
  MonthPickerCellTrigger,
} from 'reka-ui'
import type { DateValue } from '@internationalized/date'
import { calendarVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  defaultValue?: DateValue
  defaultPlaceholder?: DateValue
  minValue?: DateValue
  maxValue?: DateValue
  isMonthDisabled?: (date: DateValue) => boolean
  isMonthUnavailable?: (date: DateValue) => boolean
  locale?: string
  preventDeselect?: boolean
  readonly?: boolean
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
  /** Allow multiple selections. */
  multiple?: boolean
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
    monthGrid: ClassValue
    monthGridBody: ClassValue
    monthGridRow: ClassValue
    monthCell: ClassValue
  }>
}>(), {
  preventDeselect: false,
  readonly: false,
  disabled: false,
})

const modelValue = defineModel<DateValue | undefined>()
const placeholderModel = defineModel<DateValue | undefined>('placeholder')

const slotFns = computed(() => calendarVariants())
</script>

<template>
  <MonthPickerRoot
    v-model="modelValue"
    v-model:placeholder="placeholderModel"
    :default-value="defaultValue"
    :default-placeholder="defaultPlaceholder"
    :min-value="minValue"
    :max-value="maxValue"
    :is-month-disabled="isMonthDisabled"
    :is-month-unavailable="isMonthUnavailable"
    :locale="locale"
    :prevent-deselect="preventDeselect"
    :readonly="readonly"
    :disabled="disabled"
    :calendar-label="calendarLabel"
    :initial-focus="initialFocus"
    :dir="dir"
    :next-page="nextPage"
    :prev-page="prevPage"
    :multiple="multiple"
    :as="as"
    :as-child="asChild"
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
  >
    <template #default="{ grid }">
      <MonthPickerHeader :class="composeClassName(slotFns.header(), props.classNames?.header)">
        <MonthPickerPrev
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
        </MonthPickerPrev>

        <MonthPickerHeading
          v-slot="{ headingValue }"
          :class="composeClassName(slotFns.heading(), props.classNames?.heading)"
        >
          <slot
            name="heading"
            :heading-value="headingValue"
          >
            {{ headingValue }}
          </slot>
        </MonthPickerHeading>

        <MonthPickerNext
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
        </MonthPickerNext>
      </MonthPickerHeader>

      <MonthPickerGrid :class="composeClassName(slotFns.monthGrid(), props.classNames?.monthGrid)">
        <MonthPickerGridBody :class="composeClassName(slotFns.monthGridBody(), props.classNames?.monthGridBody)">
          <MonthPickerGridRow
            v-for="(row, rowIndex) in grid.rows"
            :key="rowIndex"
            :class="composeClassName(slotFns.monthGridRow(), props.classNames?.monthGridRow)"
          >
            <MonthPickerCell
              v-for="monthValue in row"
              :key="monthValue.toString()"
              :date="monthValue"
            >
              <MonthPickerCellTrigger
                :month="monthValue"
                as="button"
                :class="composeClassName(slotFns.monthCell(), props.classNames?.monthCell)"
              />
            </MonthPickerCell>
          </MonthPickerGridRow>
        </MonthPickerGridBody>
      </MonthPickerGrid>
    </template>
  </MonthPickerRoot>
</template>
