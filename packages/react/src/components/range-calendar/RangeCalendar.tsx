import { useContext, useState, type ReactNode } from "react";
import {
  RangeCalendar as AriaRangeCalendar,
  CalendarGrid,
  CalendarGridHeader,
  CalendarGridBody,
  CalendarHeaderCell,
  CalendarCell,
  RangeCalendarStateContext,
  Button as RACButton,
  I18nProvider,
} from "react-aria-components";
import { rangeCalendarVariants } from "@auronui/styles";
import { today, getLocalTimeZone, type DateValue } from "@internationalized/date";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import { CalendarYearPicker } from "../calendar-year-picker";
import { MonthPicker } from "../month-picker";

const WEEKDAY_MAP = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

export interface DateRange {
  start: DateValue;
  end: DateValue;
}

export interface RangeCalendarClassNames {
  base?: ClassValue;
  header?: ClassValue;
  navButton?: ClassValue;
  navButtonIcon?: ClassValue;
  heading?: ClassValue;
  headingButton?: ClassValue;
  grid?: ClassValue;
  gridHeader?: ClassValue;
  gridRow?: ClassValue;
  headerCell?: ClassValue;
  gridBody?: ClassValue;
  cell?: ClassValue;
  cellButton?: ClassValue;
  monthGrid?: ClassValue;
  monthGridBody?: ClassValue;
  monthGridRow?: ClassValue;
  monthCell?: ClassValue;
  yearGrid?: ClassValue;
  yearGridBody?: ClassValue;
  yearGridRow?: ClassValue;
  yearCell?: ClassValue;
}

export interface RangeCalendarProps {
  value?: DateRange | null;
  defaultValue?: DateRange | null;
  onValueChange?: (range: DateRange | null) => void;
  defaultPlaceholder?: DateValue;
  minValue?: DateValue;
  maxValue?: DateValue;
  /**
   * Returns true for dates that should be disabled. Note: react-aria-components'
   * `RangeCalendar` has no separate "disabled date" predicate (only
   * `isDateUnavailable`), so on the day-grid view this is folded into
   * `isDateUnavailable` (shown, not selectable) rather than reka-ui's distinct
   * treatment — same deviation `Calendar.tsx` documents.
   */
  isDateDisabled?: (date: DateValue) => boolean;
  isDateUnavailable?: (date: DateValue) => boolean;
  locale?: string;
  weekdayFormat?: "narrow" | "short" | "long";
  numberOfMonths?: number;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  isReadOnly?: boolean;
  /** @deprecated Use isReadOnly instead. */
  readonly?: boolean;
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  calendarLabel?: string;
  /** Initial focus state. */
  initialFocus?: boolean;
  className?: ClassValue;
  classNames?: RangeCalendarClassNames;
}

function PrevIcon({ className }: { className: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function NextIcon({ className }: { className: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

/** Reads RAC's range-calendar state to format the same title `CalendarHeading` would,
 *  but as a plain string so it can drive our own clickable view-switcher button. */
function RangeCalendarHeadingText({
  className,
  children,
}: {
  className: string;
  children: (headingValue: string) => ReactNode;
}) {
  const state = useContext(RangeCalendarStateContext);
  const headingValue = state
    ? new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(
        state.visibleRange.start.toDate(getLocalTimeZone()),
      )
    : "";
  return <div className={className}>{children(headingValue)}</div>;
}

type View = "date" | "month" | "year";

/**
 * Two-endpoint date range grid picker. Day-view grid/keyboard-navigation/focus
 * management is delegated to react-aria-components' `RangeCalendar` (the closest
 * React equivalent to reka-ui's `RangeCalendarRoot`), whose `CalendarCell` exposes
 * the same `data-selected`/`data-selection-start`/`data-selection-end`/`data-today`/
 * `data-outside-month`/`data-disabled`/`data-unavailable` attribute contract that
 * `range-calendar.css` targets.
 *
 * The month/year "drill-up" views reuse the single-select `MonthPicker` and
 * `CalendarYearPicker` purely as navigation aids — selecting a month/year moves the
 * day-view placeholder and switches back, it does not set the actual range value.
 * This mirrors `RangeCalendar.vue`, which uses reka-ui's single-select
 * `MonthPickerRoot`/`YearPickerRoot` (not range pickers) for the same sub-views.
 *
 * Deviation: RAC's `CalendarCell` only exposes a `className` hook on the inner
 * clickable element, not the outer `<td>` (same limitation `Calendar.tsx` documents)
 * — `cell`/`cellButton` styles are both applied to that inner element.
 */
export function RangeCalendar({
  value,
  defaultValue,
  onValueChange,
  defaultPlaceholder,
  minValue,
  maxValue,
  isDateDisabled,
  isDateUnavailable,
  locale = "en-US",
  weekdayFormat = "narrow",
  numberOfMonths = 1,
  weekStartsOn,
  isReadOnly,
  readonly,
  isDisabled,
  disabled,
  calendarLabel,
  initialFocus,
  className,
  classNames,
}: RangeCalendarProps) {
  const resolvedReadOnly = resolveDeprecatedBooleanProp(
    "RangeCalendar",
    "isReadOnly",
    isReadOnly,
    "readonly",
    readonly,
  );
  const resolvedDisabled = resolveDeprecatedBooleanProp(
    "RangeCalendar",
    "isDisabled",
    isDisabled,
    "disabled",
    disabled,
  );

  const slotFns = rangeCalendarVariants();

  const [view, setView] = useState<View>("date");
  const [internalValue, setInternalValue] = useState<DateRange | null>(defaultValue ?? null);
  const selectedValue = value !== undefined ? value : internalValue;
  const [placeholder, setPlaceholder] = useState<DateValue>(
    defaultValue?.start ?? defaultPlaceholder ?? today(getLocalTimeZone()),
  );

  function cycleView() {
    setView((v) => (v === "date" ? "month" : v === "month" ? "year" : "date"));
  }

  function handleChange(range: { start: DateValue; end: DateValue } | null) {
    setInternalValue(range);
    onValueChange?.(range);
    if (range) setPlaceholder(range.start);
  }

  function onMonthSelect(date: DateValue | undefined) {
    if (!date) return;
    setPlaceholder(date);
    setView("date");
  }

  function onYearSelect(date: DateValue | undefined) {
    if (!date) return;
    setPlaceholder(date);
    setView("month");
  }

  const nextViewLabel = view === "date" ? "month" : view === "month" ? "year" : "date";

  const heading = (headingValue: string): ReactNode => (
    <button
      type="button"
      className={composeClassName(slotFns.headingButton(), classNames?.headingButton)}
      aria-label={`Switch to ${nextViewLabel} view`}
      onClick={cycleView}
    >
      {headingValue}
    </button>
  );

  return (
    <I18nProvider locale={locale}>
      {view === "date" && (
        <AriaRangeCalendar
          // Two independently-resolved copies of `@internationalized/date` exist in this
          // workspace (see Calendar.tsx for the full explanation), so their `DateValue`
          // classes are nominally distinct even though structurally identical. Bridged
          // with a cast here rather than editing package.json (out of scope).
          {...({
            value: selectedValue ?? null,
            onChange: handleChange,
            focusedValue: placeholder,
            onFocusChange: (date: DateValue) => setPlaceholder(date),
            minValue,
            maxValue,
            isDateUnavailable: (date: DateValue) =>
              (isDateUnavailable?.(date) ?? false) || (isDateDisabled?.(date) ?? false),
          } as any)}
          aria-label={calendarLabel ?? "Range calendar"}
          isReadOnly={resolvedReadOnly}
          isDisabled={resolvedDisabled}
          autoFocus={initialFocus}
          firstDayOfWeek={weekStartsOn !== undefined ? WEEKDAY_MAP[weekStartsOn] : undefined}
          visibleDuration={{ months: numberOfMonths }}
          className={composeClassName(slotFns.base(), className, classNames?.base)}
        >
          <div className={composeClassName(slotFns.header(), classNames?.header)}>
            <RACButton
              slot="previous"
              className={composeClassName(slotFns.navButton(), classNames?.navButton)}
              aria-label="Previous month"
            >
              <PrevIcon className={composeClassName(slotFns.navButtonIcon(), classNames?.navButtonIcon)} />
            </RACButton>

            <RangeCalendarHeadingText className={composeClassName(slotFns.heading(), classNames?.heading)}>
              {heading}
            </RangeCalendarHeadingText>

            <RACButton
              slot="next"
              className={composeClassName(slotFns.navButton(), classNames?.navButton)}
              aria-label="Next month"
            >
              <NextIcon className={composeClassName(slotFns.navButtonIcon(), classNames?.navButtonIcon)} />
            </RACButton>
          </div>

          <CalendarGrid
            weekdayStyle={weekdayFormat}
            className={composeClassName(slotFns.grid(), classNames?.grid)}
          >
            <CalendarGridHeader className={composeClassName(slotFns.gridHeader(), classNames?.gridHeader)}>
              {(day) => (
                <CalendarHeaderCell className={composeClassName(slotFns.headerCell(), classNames?.headerCell)}>
                  {day}
                </CalendarHeaderCell>
              )}
            </CalendarGridHeader>
            <CalendarGridBody className={composeClassName(slotFns.gridBody(), classNames?.gridBody)}>
              {(date) => (
                <CalendarCell
                  date={date}
                  // Unlike Calendar.tsx, range-calendar.css's `.range-calendar__cell` /
                  // `.range-calendar__cell-button` split is a genuine two-level design
                  // (an outer track shape whose rounding depends on range position, plus
                  // an inner fixed-size circle carrying the actual background color) —
                  // not just an artifact of reka-ui's DOM shape. `cellButton()` renders on
                  // a real nested child below, not merged onto this outer element.
                  className={composeClassName(slotFns.cell(), classNames?.cell)}
                >
                  {({ formattedDate, isToday, isOutsideMonth, isUnavailable, isSelected, isSelectionStart, isSelectionEnd }) => (
                    <>
                      {/* range-calendar.css's today/outside-month/unavailable/selected/
                          selection-start/selection-end rules are all `:has([data-x])`
                          selectors on `.range-calendar__cell` expecting these attributes on
                          a child (reka-ui's inner CalendarCellTrigger) — RAC sets them on
                          the cell itself instead, so this marker mirrors that shape. Uses
                          `data-outside-view`, the exact name the CSS looks for, not RAC's
                          own `data-outside-month`. */}
                      <span
                        aria-hidden="true"
                        className="hidden"
                        data-today={isToday || undefined}
                        data-outside-view={isOutsideMonth || undefined}
                        data-unavailable={isUnavailable || undefined}
                        data-selected={isSelected || undefined}
                        data-selection-start={isSelectionStart || undefined}
                        data-selection-end={isSelectionEnd || undefined}
                      />
                      <span className={composeClassName(slotFns.cellButton(), classNames?.cellButton)}>
                        {formattedDate}
                      </span>
                    </>
                  )}
                </CalendarCell>
              )}
            </CalendarGridBody>
          </CalendarGrid>
        </AriaRangeCalendar>
      )}

      {view === "month" && (
        <MonthPicker
          placeholder={placeholder}
          onPlaceholderChange={setPlaceholder}
          locale={locale}
          minValue={minValue}
          maxValue={maxValue}
          isReadOnly={resolvedReadOnly}
          isDisabled={resolvedDisabled}
          calendarLabel={calendarLabel}
          className={composeClassName(slotFns.base(), className, classNames?.base)}
          classNames={classNames}
          onValueChange={onMonthSelect}
          renderHeading={heading}
        />
      )}

      {view === "year" && (
        <CalendarYearPicker
          placeholder={placeholder}
          onPlaceholderChange={setPlaceholder}
          locale={locale}
          minValue={minValue}
          maxValue={maxValue}
          isReadOnly={resolvedReadOnly}
          isDisabled={resolvedDisabled}
          className={composeClassName(slotFns.base(), className, classNames?.base)}
          classNames={classNames}
          onValueChange={onYearSelect}
          renderHeading={heading}
        />
      )}
    </I18nProvider>
  );
}
