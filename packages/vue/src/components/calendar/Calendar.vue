<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import {
  CalendarRoot,
  CalendarHeader,
  CalendarHeading,
  CalendarGrid,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarGridBody,
  CalendarCell,
  CalendarCellTrigger,
  CalendarNext,
  CalendarPrev,
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
import { today, getLocalTimeZone, type DateValue } from '@internationalized/date'
import { calendarVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import CalendarYearPicker from '../calendar-year-picker/CalendarYearPicker.vue'

const props = withDefaults(defineProps<{
  defaultValue?: DateValue
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
  readonly?: boolean
  disabled?: boolean
  calendarLabel?: string
  /** Initial focus state. */
  initialFocus?: boolean
  /** Text direction. */
  dir?: 'ltr' | 'rtl'
  /** Navigate to next page. */
  nextPage?: (placeholder: DateValue) => DateValue
  /** Navigate to previous page. */
  prevPage?: (placeholder: DateValue) => DateValue
  /** Allow multiple date selections. */
  multiple?: boolean
  /** Disable days outside the current view. */
  disableDaysOutsideCurrentView?: boolean
  /** Render as a different element or component. */
  as?: string
  /** Render child as root element. */
  asChild?: boolean
  /** MonthPicker: disable specific months. */
  isMonthDisabled?: (date: DateValue) => boolean
  /** MonthPicker: mark specific months as unavailable. */
  isMonthUnavailable?: (date: DateValue) => boolean
  class?: ClassValue
  /** Override classes on any named slot */
  classNames?: Partial<{
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
  }>
}>(), {
  weekdayFormat: 'narrow',
  fixedWeeks: false,
  numberOfMonths: 1,
  pagedNavigation: false,
  preventDeselect: false,
  readonly: false,
  disabled: false,
})

const modelValue = defineModel<DateValue>()

const slotFns = computed(() => calendarVariants())

// View-switcher state: 'date' (default 7-col calendar), 'month' (3x4 months), 'year' (3x4 years)
type View = 'date' | 'month' | 'year'
const view = ref<View>('date')

// Shared placeholder synced with CalendarRoot/MonthPickerRoot/YearPickerRoot.
// NOTE: shallowRef preserves reka-ui's `DateValue` discriminated-union without
// deep reactive unwrapping that would break structural type matching on bind sites.
const placeholder = shallowRef<DateValue>(
  (props.defaultValue ?? props.defaultPlaceholder ?? today(getLocalTimeZone())) as DateValue
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
  <CalendarRoot
    v-model="modelValue"
    v-model:placeholder="placeholder"
    :default-value="defaultValue"
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
    :readonly="readonly"
    :disabled="disabled"
    :calendar-label="calendarLabel"
    :initial-focus="initialFocus"
    :dir="dir"
    :next-page="nextPage"
    :prev-page="prevPage"
    :multiple="multiple"
    :disable-days-outside-current-view="disableDaysOutsideCurrentView"
    :as="as"
    :as-child="asChild"
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
  >
    <template #default="{ grid, weekDays }">
      <template v-if="view === 'date'">
        <CalendarHeader :class="composeClassName(slotFns.header(), props.classNames?.header)">
          <CalendarPrev
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
          </CalendarPrev>

          <CalendarHeading
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
          </CalendarHeading>

          <CalendarNext
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
          </CalendarNext>
        </CalendarHeader>

        <CalendarGrid
          v-for="month in grid"
          :key="month.value.toString()"
          :class="composeClassName(slotFns.grid(), props.classNames?.grid)"
        >
          <CalendarGridHead :class="composeClassName(slotFns.gridHeader(), props.classNames?.gridHeader)">
            <CalendarGridRow :class="composeClassName(slotFns.gridRow(), props.classNames?.gridRow)">
              <CalendarHeadCell
                v-for="day in weekDays"
                :key="day"
                :class="composeClassName(slotFns.headerCell(), props.classNames?.headerCell)"
              >
                {{ day }}
              </CalendarHeadCell>
            </CalendarGridRow>
          </CalendarGridHead>
          <CalendarGridBody :class="composeClassName(slotFns.gridBody(), props.classNames?.gridBody)">
            <CalendarGridRow
              v-for="(week, weekIndex) in month.rows"
              :key="weekIndex"
              :class="composeClassName(slotFns.gridRow(), props.classNames?.gridRow)"
            >
              <CalendarCell
                v-for="day in week"
                :key="day.toString()"
                :date="day"
                :class="composeClassName(slotFns.cell(), props.classNames?.cell)"
              >
                <CalendarCellTrigger
                  :day="day"
                  :month="month.value"
                  :class="composeClassName(slotFns.cellButton(), props.classNames?.cellButton)"
                />
              </CalendarCell>
            </CalendarGridRow>
          </CalendarGridBody>
        </CalendarGrid>
      </template>
    </template>
  </CalendarRoot>

  <MonthPickerRoot
    v-if="view === 'month'"
    :placeholder="placeholder"
    :locale="locale"
    :min-value="minValue"
    :max-value="maxValue"
    :readonly="readonly"
    :disabled="disabled"
    :initial-focus="initialFocus"
    :dir="dir"
    :next-page="nextPage"
    :prev-page="prevPage"
    :multiple="multiple"
    :is-month-disabled="isMonthDisabled"
    :is-month-unavailable="isMonthUnavailable"
    :as="as"
    :as-child="asChild"
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

  <CalendarYearPicker
    v-if="view === 'year'"
    v-model:placeholder="placeholder"
    :locale="locale"
    :min-value="minValue"
    :max-value="maxValue"
    :readonly="readonly"
    :disabled="disabled"
    :class="composeClassName(props.class, props.classNames?.base)"
    @update:model-value="onYearSelect"
  >
    <template #heading="{ headingValue }">
      <button
        type="button"
        :class="composeClassName(slotFns.headingButton(), props.classNames?.headingButton)"
        :aria-label="`Switch to ${nextViewLabel} view`"
        @click="cycleView"
      >
        {{ headingValue }}
      </button>
    </template>
  </CalendarYearPicker>
</template>
