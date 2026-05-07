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
    :class="composeClassName(slotFns.base(), props.class)"
  >
    <template #default="{ grid, weekDays }">
      <template v-if="view === 'date'">
        <RangeCalendarHeader :class="slotFns.header()">
          <RangeCalendarPrev
            :class="slotFns.navButton()"
            aria-label="Previous month"
          >
            <svg
              :class="slotFns.navButtonIcon()"
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
            :class="slotFns.heading()"
          >
            <button
              type="button"
              :class="slotFns.headingButton()"
              :aria-label="`Switch to ${nextViewLabel} view`"
              @click="cycleView"
            >
              {{ headingValue }}
            </button>
          </RangeCalendarHeading>

          <RangeCalendarNext
            :class="slotFns.navButton()"
            aria-label="Next month"
          >
            <svg
              :class="slotFns.navButtonIcon()"
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
          :class="slotFns.grid()"
        >
          <RangeCalendarGridHead :class="slotFns.gridHeader()">
            <RangeCalendarGridRow :class="slotFns.gridRow()">
              <RangeCalendarHeadCell
                v-for="day in weekDays"
                :key="day"
                :class="slotFns.headerCell()"
              >
                {{ day }}
              </RangeCalendarHeadCell>
            </RangeCalendarGridRow>
          </RangeCalendarGridHead>
          <RangeCalendarGridBody :class="slotFns.gridBody()">
            <RangeCalendarGridRow
              v-for="(week, weekIndex) in month.rows"
              :key="weekIndex"
              :class="slotFns.gridRow()"
            >
              <RangeCalendarCell
                v-for="day in week"
                :key="day.toString()"
                :date="day"
                :class="slotFns.cell()"
              >
                <RangeCalendarCellTrigger
                  :day="day"
                  :month="month.value"
                  :class="slotFns.cellButton()"
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
    :class="composeClassName(slotFns.base(), props.class)"
    @update:model-value="onMonthSelect"
    @update:placeholder="(val: DateValue | undefined) => { if (val) placeholder = val }"
  >
    <template #default="{ grid: monthGrid }">
      <MonthPickerHeader :class="slotFns.header()">
        <MonthPickerPrev
          :class="slotFns.navButton()"
          aria-label="Previous year"
        >
          <svg
            :class="slotFns.navButtonIcon()"
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
          :class="slotFns.heading()"
        >
          <button
            type="button"
            :class="slotFns.headingButton()"
            :aria-label="`Switch to ${nextViewLabel} view`"
            @click="cycleView"
          >
            {{ headingValue }}
          </button>
        </MonthPickerHeading>

        <MonthPickerNext
          :class="slotFns.navButton()"
          aria-label="Next year"
        >
          <svg
            :class="slotFns.navButtonIcon()"
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

      <MonthPickerGrid :class="slotFns.monthGrid()">
        <MonthPickerGridBody :class="slotFns.monthGridBody()">
          <MonthPickerGridRow
            v-for="(row, i) in monthGrid.rows"
            :key="i"
            :class="slotFns.monthGridRow()"
          >
            <MonthPickerCell
              v-for="monthValue in row"
              :key="monthValue.toString()"
              :date="monthValue"
            >
              <MonthPickerCellTrigger
                :month="monthValue"
                as="button"
                :class="slotFns.monthCell()"
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
    :class="composeClassName(slotFns.base(), props.class)"
    @update:model-value="onYearSelect"
    @update:placeholder="(val: DateValue | undefined) => { if (val) placeholder = val }"
  >
    <template #default="{ grid: yearGrid }">
      <YearPickerHeader :class="slotFns.header()">
        <YearPickerPrev
          :class="slotFns.navButton()"
          aria-label="Previous decade"
        >
          <svg
            :class="slotFns.navButtonIcon()"
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
          :class="slotFns.heading()"
        >
          <button
            type="button"
            :class="slotFns.headingButton()"
            :aria-label="`Switch to ${nextViewLabel} view`"
            @click="cycleView"
          >
            {{ headingValue }}
          </button>
        </YearPickerHeading>

        <YearPickerNext
          :class="slotFns.navButton()"
          aria-label="Next decade"
        >
          <svg
            :class="slotFns.navButtonIcon()"
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

      <YearPickerGrid :class="slotFns.yearGrid()">
        <YearPickerGridBody :class="slotFns.yearGridBody()">
          <YearPickerGridRow
            v-for="(row, i) in yearGrid.rows"
            :key="i"
            :class="slotFns.yearGridRow()"
          >
            <YearPickerCell
              v-for="yearValue in row"
              :key="yearValue.toString()"
              :date="yearValue"
            >
              <YearPickerCellTrigger
                :year="yearValue"
                as="button"
                :class="slotFns.yearCell()"
              />
            </YearPickerCell>
          </YearPickerGridRow>
        </YearPickerGridBody>
      </YearPickerGrid>
    </template>
  </YearPickerRoot>
</template>
