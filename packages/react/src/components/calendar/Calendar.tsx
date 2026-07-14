import { useContext, useState, type ReactNode } from "react";
import {
  Calendar as AriaCalendar,
  CalendarGrid,
  CalendarGridHeader,
  CalendarGridBody,
  CalendarHeaderCell,
  CalendarCell,
  CalendarStateContext,
  Button as RACButton,
  I18nProvider,
} from "react-aria-components";
import { calendarVariants } from "@auronui/styles";
import { today, getLocalTimeZone, type DateValue } from "@internationalized/date";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import { CalendarYearPicker } from "../calendar-year-picker";
import { MonthPicker } from "../month-picker";

const WEEKDAY_MAP = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

export interface CalendarClassNames {
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
  yearView?: Partial<{
    header: ClassValue;
    navButton: ClassValue;
    navButtonIcon: ClassValue;
    heading: ClassValue;
    yearGrid: ClassValue;
    yearGridBody: ClassValue;
    yearGridRow: ClassValue;
    yearCell: ClassValue;
  }>;
}

export interface CalendarProps {
  value?: DateValue | undefined;
  defaultValue?: DateValue;
  onValueChange?: (value: DateValue | undefined) => void;
  defaultPlaceholder?: DateValue;
  minValue?: DateValue;
  maxValue?: DateValue;
  /**
   * Returns true for dates that should be disabled. Note: react-aria-components'
   * `Calendar` has no separate "disabled date" predicate (only `isDateUnavailable`),
   * so on the day-grid view this is folded into `isDateUnavailable` (shown, not
   * selectable) rather than fully hidden/disabled like reka-ui's distinct treatment.
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
  /** MonthPicker: disable specific months (used by the "month" drill-up view). */
  isMonthDisabled?: (date: DateValue) => boolean;
  /** MonthPicker: mark specific months as unavailable (used by the "month" drill-up view). */
  isMonthUnavailable?: (date: DateValue) => boolean;
  className?: ClassValue;
  classNames?: CalendarClassNames;
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

/** Reads RAC's calendar state to format the same title `CalendarHeading` would, but as a
 *  plain string so it can drive our own clickable view-switcher button (mirrors Calendar.vue's
 *  `<CalendarHeading v-slot="{ headingValue }">` pattern). */
function CalendarHeadingText({
  className,
  children,
}: {
  className: string;
  children: (headingValue: string) => ReactNode;
}) {
  const state = useContext(CalendarStateContext);
  const headingValue = state
    ? new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(
        state.visibleRange.start.toDate(getLocalTimeZone()),
      )
    : "";
  return <div className={className}>{children(headingValue)}</div>;
}

type View = "date" | "month" | "year";

/**
 * Single-date grid picker. Day-view grid/keyboard-navigation/focus management is
 * delegated to react-aria-components' `Calendar` (the closest React equivalent to
 * reka-ui's `CalendarRoot`, implementing the same WAI-ARIA grid pattern over
 * `@internationalized/date`), whose `CalendarCell` exposes the same
 * `data-selected`/`data-today`/`data-outside-month`/`data-disabled`/`data-unavailable`
 * attribute contract that `calendar.css` targets. The month/year "drill-up" views reuse
 * `MonthPicker` and `CalendarYearPicker` exactly like `Calendar.vue` reuses
 * `CalendarYearPicker.vue`.
 *
 * Deviation: RAC's `CalendarCell` only exposes a `className` hook on the inner
 * clickable element, not the outer `<td>` — so `cell`/`cellButton` styles are both
 * applied to that inner element instead of the two-level td/button split reka-ui uses.
 * Grid-item sizing still comes from `.calendar__grid`'s CSS Grid layout on the `<td>`s
 * themselves, so the visual grid is unaffected; only the `:has()`-based CSS rules that
 * assumed the two-level split are approximated rather than pixel-exact.
 */
export function Calendar({
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
  isMonthDisabled,
  isMonthUnavailable,
  className,
  classNames,
}: CalendarProps) {
  const resolvedReadOnly = resolveDeprecatedBooleanProp(
    "Calendar",
    "isReadOnly",
    isReadOnly,
    "readonly",
    readonly,
  );
  const resolvedDisabled = resolveDeprecatedBooleanProp(
    "Calendar",
    "isDisabled",
    isDisabled,
    "disabled",
    disabled,
  );

  const slotFns = calendarVariants();

  const [view, setView] = useState<View>("date");
  const [internalValue, setInternalValue] = useState<DateValue | undefined>(defaultValue);
  const selectedValue = value !== undefined ? value : internalValue;
  const [placeholder, setPlaceholder] = useState<DateValue>(
    defaultValue ?? defaultPlaceholder ?? today(getLocalTimeZone()),
  );

  function cycleView() {
    setView((v) => (v === "date" ? "month" : v === "month" ? "year" : "date"));
  }

  function handleChange(date: DateValue | null) {
    const next = date ?? undefined;
    setInternalValue(next);
    onValueChange?.(next);
    if (next) setPlaceholder(next);
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
        <AriaCalendar
          // Two independently-resolved copies of `@internationalized/date` exist in this
          // workspace (our own devDependency pin vs. the one react-aria/react-stately pull
          // in transitively), so their `DateValue` classes are nominally distinct even though
          // structurally identical. Bridged with a cast here rather than editing package.json
          // (out of scope for this port) to force a single deduped version.
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
          aria-label={calendarLabel ?? "Calendar"}
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

            <CalendarHeadingText className={composeClassName(slotFns.heading(), classNames?.heading)}>
              {heading}
            </CalendarHeadingText>

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
                  // Only `.calendar__cell`, NOT `.calendar__cell-button` — the latter is
                  // `position: absolute; inset: 0`, meant to overlay a separate inner
                  // element in reka-ui's two-level td/button split. Applying it to this
                  // single element makes tailwind-merge drop `.calendar__cell`'s
                  // `relative` in favor of `absolute`, which pulls the cell out of the
                  // grid's row-height calculation and collapses the whole calendar grid.
                  //
                  // Selected-state background: calendar.css keys this off
                  // `[aria-selected="true"]` — reka-ui's CalendarCell sets that ARIA
                  // attribute, but RAC's CalendarCell renders `role="button"` and never
                  // sets `aria-selected` at all (only the styling-hook `data-selected`),
                  // so that selector can never match here. Emitting the same utility
                  // classes directly off the `isSelected`/`isPressed` render props instead.
                  className={({ isSelected, isPressed }) =>
                    composeClassName(
                      slotFns.cell(),
                      classNames?.cell,
                      classNames?.cellButton,
                      isSelected && "bg-primary text-primary-foreground",
                      isSelected && isPressed && "bg-primary-hover",
                    )
                  }
                >
                  {({ formattedDate, isToday, isOutsideMonth, isUnavailable }) => (
                    <>
                      {/* calendar.css's today/outside-month/unavailable rules are `:has([data-x])`
                          selectors written for reka-ui's two-level td/button split, where those
                          attributes live on a child of the cell — RAC puts them on the cell itself
                          instead. This zero-size marker mirrors that inner-child shape (and uses
                          `data-outside-view`, the exact attribute name those selectors look for,
                          not RAC's own `data-outside-month`) so the shared, Vue-consumed CSS
                          matches unchanged. */}
                      <span
                        aria-hidden="true"
                        className="hidden"
                        data-today={isToday || undefined}
                        data-outside-view={isOutsideMonth || undefined}
                        data-unavailable={isUnavailable || undefined}
                      />
                      {formattedDate}
                    </>
                  )}
                </CalendarCell>
              )}
            </CalendarGridBody>
          </CalendarGrid>
        </AriaCalendar>
      )}

      {view === "month" && (
        <MonthPicker
          placeholder={placeholder}
          onPlaceholderChange={setPlaceholder}
          locale={locale}
          minValue={minValue}
          maxValue={maxValue}
          isMonthDisabled={isMonthDisabled}
          isMonthUnavailable={isMonthUnavailable}
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
          className={composeClassName(className, classNames?.base)}
          classNames={classNames?.yearView}
          onValueChange={onYearSelect}
          renderHeading={heading}
        />
      )}
    </I18nProvider>
  );
}
