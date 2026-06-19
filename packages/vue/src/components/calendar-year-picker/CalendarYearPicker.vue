<script setup lang="ts">
import { computed } from 'vue'
import {
  YearPickerRoot,
  YearPickerHeader,
  YearPickerHeading,
  YearPickerPrev,
  YearPickerNext,
  YearPickerGrid,
  YearPickerGridBody,
  YearPickerGridRow,
  YearPickerCell,
  YearPickerCellTrigger,
} from 'reka-ui'
import type { DateValue } from '@internationalized/date'
import { calendarVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  defaultValue?: DateValue
  defaultPlaceholder?: DateValue
  minValue?: DateValue
  maxValue?: DateValue
  isYearDisabled?: (date: DateValue) => boolean
  isYearUnavailable?: (date: DateValue) => boolean
  locale?: string
  yearsPerPage?: number
  preventDeselect?: boolean
  readonly?: boolean
  disabled?: boolean
  calendarLabel?: string
  class?: ClassValue
  /** Per-slot class overrides */
  classNames?: Partial<{
    base: ClassValue
    header: ClassValue
    navButton: ClassValue
    navButtonIcon: ClassValue
    heading: ClassValue
    yearGrid: ClassValue
    yearGridBody: ClassValue
    yearGridRow: ClassValue
    yearCell: ClassValue
  }>
}>(), {
  yearsPerPage: 12,
  preventDeselect: false,
  readonly: false,
  disabled: false,
})

const modelValue = defineModel<DateValue | undefined>()
const placeholderModel = defineModel<DateValue | undefined>('placeholder')

const slotFns = computed(() => calendarVariants())
</script>

<template>
  <YearPickerRoot
    v-model="modelValue"
    v-model:placeholder="placeholderModel"
    :default-value="defaultValue"
    :default-placeholder="defaultPlaceholder"
    :min-value="minValue"
    :max-value="maxValue"
    :is-year-disabled="isYearDisabled"
    :is-year-unavailable="isYearUnavailable"
    :locale="locale"
    :years-per-page="yearsPerPage"
    :prevent-deselect="preventDeselect"
    :readonly="readonly"
    :disabled="disabled"
    :calendar-label="calendarLabel"
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
  >
    <template #default="{ grid }">
      <YearPickerHeader :class="composeClassName(slotFns.header(), props.classNames?.header)">
        <YearPickerPrev
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
        </YearPickerPrev>

        <YearPickerHeading
          v-slot="{ headingValue }"
          :class="composeClassName(slotFns.heading(), props.classNames?.heading)"
        >
          <slot
            name="heading"
            :heading-value="headingValue"
          >
            {{ headingValue }}
          </slot>
        </YearPickerHeading>

        <YearPickerNext
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
        </YearPickerNext>
      </YearPickerHeader>

      <YearPickerGrid :class="composeClassName(slotFns.yearGrid(), props.classNames?.yearGrid)">
        <YearPickerGridBody :class="composeClassName(slotFns.yearGridBody(), props.classNames?.yearGridBody)">
          <YearPickerGridRow
            v-for="(row, rowIndex) in grid.rows"
            :key="rowIndex"
            :class="composeClassName(slotFns.yearGridRow(), props.classNames?.yearGridRow)"
          >
            <YearPickerCell
              v-for="yearValue in row"
              :key="yearValue.toString()"
              :date="yearValue"
            >
              <YearPickerCellTrigger
                :year="yearValue"
                as="button"
                :class="composeClassName(slotFns.yearCell(), props.classNames?.yearCell)"
              />
            </YearPickerCell>
          </YearPickerGridRow>
        </YearPickerGridBody>
      </YearPickerGrid>
    </template>
  </YearPickerRoot>
</template>
