<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import {
  RangeCalendarRoot,
  RangeCalendarHeader,
  RangeCalendarHeading,
  RangeCalendarGrid,
  RangeCalendarGridHead,
  RangeCalendarGridRow,
  RangeCalendarHeadCell,
  RangeCalendarGridBody,
  RangeCalendarCell,
  RangeCalendarCellTrigger,
  RangeCalendarNext,
  RangeCalendarPrev,
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
import { today, getLocalTimeZone, type DateValue } from '@internationalized/date'
import { rangeCalendarVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'

export interface DateRange {
  start: DateValue
  end: DateValue
}

const props = withDefaults(defineProps<{
  defaultValue?: DateRange | null
  defaultPlaceholder?: DateValue
  minValue?: DateValue
  maxValue?: DateValue
  isDateDisabled?: (date: DateValue) => boolean
  isDateUnavailable?: (date: DateValue) => boolean
  locale?: string
  weekdayFormat?: 'narrow' | 'short' | 'long'
  fixedWeeks?: boolean
  numberOfMonths?: number
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  pagedNavigation?: boolean
  preventDeselect?: boolean
  allowNonContiguousRanges?: boolean
  readonly?: boolean
  disabled?: boolean
  calendarLabel?: string
  class?: string
  /** Override classes for named slots */
  classNames?: Partial<{
    base: string
    header: string
    navButton: string
    navButtonIcon: string
    heading: string
    headingButton: string
    grid: string
    gridHeader: string
    gridRow: string
    headerCell: string
    gridBody: string
    cell: string
    cellButton: string
    monthGrid: string
    monthGridBody: string
    monthGridRow: string
    monthCell: string
    yearGrid: string
    yearGridBody: string
    yearGridRow: string
    yearCell: string
  }>
}>(), {
  weekdayFormat: 'narrow',
  fixedWeeks: false,
  numberOfMonths: 1,
  pagedNavigation: false,
  preventDeselect: false,
  allowNonContiguousRanges: false,
  readonly: false,
  disabled: false,
})

const modelValue = defineModel<DateRange | null>()

const slotFns = computed(() => rangeCalendarVariants())

// View-switcher state: 'date' (default 7-col calendar), 'month' (3x4 months), 'year' (3x4 years)
type View = 'date' | 'month' | 'year'
const view = ref<View>('date')

// Shared placeholder synced with RangeCalendarRoot/MonthPickerRoot/YearPickerRoot.
// shallowRef preserves reka-ui's `DateValue` discriminated union.
const placeholder = shallowRef<DateValue>(
  (props.defaultValue?.start ?? props.defaultPlaceholder ?? today(getLocalTimeZone())) as DateValue
)

function cycleView(): void {
  view.value = view.value === 'date' ? 'month' : view.value === 'month' ? 'year' : 'date'
}

function onMonthSelect(val: DateValue | DateValue[] | undefined): void {
  if (!val) return
  const next = Array.isArray(val) ? val[val.length - 1] : val
  if (!next) return
  placeholder.value = next
  view.value = 'date'
}

function onYearSelect(val: DateValue | DateValue[] | undefined): void {
  if (!val) return
  const next = Array.isArray(val) ? val[val.length - 1] : val
  if (!next) return
  placeholder.value = next
  view.value = 'month'
}

const nextViewLabel = computed(() =>
  view.value === 'date' ? 'month' : view.value === 'month' ? 'year' : 'date'
)
</script>

<template>
  <RangeCalendarRoot
    v-model="modelValue"
    v-model:placeholder="placeholder"
    :default-value="defaultValue ?? undefined"
    :default-placeholder="defaultPlaceholder"
    :min-value="minValue"
    :max-value="maxValue"
    :is-date-disabled="isDateDisabled"
    :is-date-unavailable="isDateUnavailable"
    :locale="locale"
    :weekday-format="weekdayFormat"
    :fixed-weeks="fixedWeeks"
    :number-of-months="numberOfMonths"
    :week-starts-on="weekStartsOn"
    :paged-navigation="pagedNavigation"
    :prevent-deselect="preventDeselect"
    :allow-non-contiguous-ranges="allowNonContiguousRanges"
    :readonly="readonly"
    :disabled="disabled"
    :calendar-label="calendarLabel"
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
  >
    <template #default="{ grid, weekDays }">
      <template v-if="view === 'date'">
        <RangeCalendarHeader :class="composeClassName(slotFns.header(), props.classNames?.header)">
          <RangeCalendarPrev
            :class="composeClassName(slotFns.navButton(), props.classNames?.navButton)"
            aria-label="Previous month"
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
          </RangeCalendarPrev>

          <RangeCalendarHeading
            v-slot="{ headingValue }"
            :class="composeClassName(slotFns.heading(), props.classNames?.heading)"
          >
            <button
              type="button"
              :class="composeClassName(slotFns.headingButton(), props.classNames?.headingButton)"
              :aria-label="`Switch to ${nextViewLabel} view`"
              @click="cycleView"
            >
              {{ headingValue }}
            </button>
          </RangeCalendarHeading>

          <RangeCalendarNext
            :class="composeClassName(slotFns.navButton(), props.classNames?.navButton)"
            aria-label="Next month"
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
          </RangeCalendarNext>
        </RangeCalendarHeader>

        <RangeCalendarGrid
          v-for="month in grid"
          :key="month.value.toString()"
          :class="composeClassName(slotFns.grid(), props.classNames?.grid)"
        >
          <RangeCalendarGridHead :class="composeClassName(slotFns.gridHeader(), props.classNames?.gridHeader)">
            <RangeCalendarGridRow :class="composeClassName(slotFns.gridRow(), props.classNames?.gridRow)">
              <RangeCalendarHeadCell
                v-for="day in weekDays"
                :key="day"
                :class="composeClassName(slotFns.headerCell(), props.classNames?.headerCell)"
              >
                {{ day }}
              </RangeCalendarHeadCell>
            </RangeCalendarGridRow>
          </RangeCalendarGridHead>
          <RangeCalendarGridBody :class="composeClassName(slotFns.gridBody(), props.classNames?.gridBody)">
            <RangeCalendarGridRow
              v-for="(week, weekIndex) in month.rows"
              :key="weekIndex"
              :class="composeClassName(slotFns.gridRow(), props.classNames?.gridRow)"
            >
              <RangeCalendarCell
                v-for="day in week"
                :key="day.toString()"
                :date="day"
                :class="composeClassName(slotFns.cell(), props.classNames?.cell)"
              >
                <RangeCalendarCellTrigger
                  :day="day"
                  :month="month.value"
                  :class="composeClassName(slotFns.cellButton(), props.classNames?.cellButton)"
                />
              </RangeCalendarCell>
            </RangeCalendarGridRow>
          </RangeCalendarGridBody>
        </RangeCalendarGrid>
      </template>
    </template>
  </RangeCalendarRoot>

  <MonthPickerRoot
    v-if="view === 'month'"
    :placeholder="placeholder"
    :locale="locale"
    :min-value="minValue"
    :max-value="maxValue"
    :readonly="readonly"
    :disabled="disabled"
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    @update:model-value="onMonthSelect"
    @update:placeholder="(val: DateValue | undefined) => { if (val) placeholder = val }"
  >
    <template #default="{ grid: monthGrid }">
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
          <button
            type="button"
            :class="composeClassName(slotFns.headingButton(), props.classNames?.headingButton)"
            :aria-label="`Switch to ${nextViewLabel} view`"
            @click="cycleView"
          >
            {{ headingValue }}
          </button>
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
            v-for="(row, i) in monthGrid.rows"
            :key="i"
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

  <YearPickerRoot
    v-if="view === 'year'"
    :placeholder="placeholder"
    :locale="locale"
    :min-value="minValue"
    :max-value="maxValue"
    :readonly="readonly"
    :disabled="disabled"
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    @update:model-value="onYearSelect"
    @update:placeholder="(val: DateValue | undefined) => { if (val) placeholder = val }"
  >
    <template #default="{ grid: yearGrid }">
      <YearPickerHeader :class="composeClassName(slotFns.header(), props.classNames?.header)">
        <YearPickerPrev
          :class="composeClassName(slotFns.navButton(), props.classNames?.navButton)"
          aria-label="Previous decade"
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
          <button
            type="button"
            :class="composeClassName(slotFns.headingButton(), props.classNames?.headingButton)"
            :aria-label="`Switch to ${nextViewLabel} view`"
            @click="cycleView"
          >
            {{ headingValue }}
          </button>
        </YearPickerHeading>

        <YearPickerNext
          :class="composeClassName(slotFns.navButton(), props.classNames?.navButton)"
          aria-label="Next decade"
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
            v-for="(row, i) in yearGrid.rows"
            :key="i"
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
