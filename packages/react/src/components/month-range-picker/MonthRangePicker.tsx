import { useCallback, useRef, useState, type ReactNode } from "react";
import { monthRangePickerVariants } from "@auronui/styles";
import { today, getLocalTimeZone, type DateValue } from "@internationalized/date";
import { composeClassName, dataAttr, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import { chunkRows, formatMonthLabel, formatYear, getMonthsOfYear, isSameMonthAs } from "../calendar/date-grid-math";
import { nextGridIndex } from "../calendar/grid-keyboard";

export interface DateRange {
  start: DateValue;
  end: DateValue;
}

export interface MonthRangePickerClassNames {
  base?: ClassValue;
  header?: ClassValue;
  navButton?: ClassValue;
  navButtonIcon?: ClassValue;
  heading?: ClassValue;
  grid?: ClassValue;
  gridBody?: ClassValue;
  gridRow?: ClassValue;
  cell?: ClassValue;
}

export interface MonthRangePickerProps {
  value?: DateRange | null;
  defaultValue?: DateRange | null;
  onValueChange?: (range: DateRange | null) => void;
  placeholder?: DateValue;
  defaultPlaceholder?: DateValue;
  onPlaceholderChange?: (value: DateValue) => void;
  minValue?: DateValue;
  maxValue?: DateValue;
  isMonthDisabled?: (date: DateValue) => boolean;
  isMonthUnavailable?: (date: DateValue) => boolean;
  locale?: string;
  /**
   * Caps the number of months (inclusive) a completed range can span. When the
   * second click would exceed this, the far end is clamped instead of extended.
   */
  maximumMonths?: number;
  isReadOnly?: boolean;
  /** @deprecated Use isReadOnly instead. */
  readonly?: boolean;
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  calendarLabel?: string;
  className?: ClassValue;
  classNames?: MonthRangePickerClassNames;
  /** Render override for the heading (receives the formatted year, e.g. "2024"). */
  renderHeading?: (headingValue: string) => ReactNode;
}

/**
 * Standalone month-RANGE-selection grid (3x4 months of a year). Mirrors `MonthPicker`'s
 * DOM/keyboard-nav shape (a `<table role="grid">` of `<td>`-wrapped `<button>` cells with
 * roving-tabindex arrow-key navigation), but tracks a two-click start/end range instead of
 * a single date. Ported from `packages/vue/src/components/month-range-picker/MonthRangePicker.vue`,
 * which delegates range state to reka-ui's `MonthRangePickerRoot`; this port reimplements that
 * state machine directly since there is no React equivalent primitive to lean on.
 *
 * Deliberately dropped vs. the Vue source (out of scope for this port, none are load-bearing
 * for the grid/range UX): `allowNonContiguousRanges`, `fixedDate`, `preventDeselect`, `dir`,
 * `nextPage`/`prevPage` overrides, `initialFocus`, `as`/`asChild`. `maximumMonths` is kept but
 * simplified to a clamp (see above) rather than reka-ui's full constraint-propagation behavior.
 */
export function MonthRangePicker({
  value,
  defaultValue,
  onValueChange,
  placeholder,
  defaultPlaceholder,
  onPlaceholderChange,
  minValue,
  maxValue,
  isMonthDisabled,
  isMonthUnavailable,
  locale = "en-US",
  maximumMonths,
  isReadOnly,
  readonly,
  isDisabled,
  disabled,
  calendarLabel,
  className,
  classNames,
  renderHeading,
}: MonthRangePickerProps) {
  const resolvedReadOnly = resolveDeprecatedBooleanProp(
    "MonthRangePicker",
    "isReadOnly",
    isReadOnly,
    "readonly",
    readonly,
  );
  const resolvedDisabled = resolveDeprecatedBooleanProp(
    "MonthRangePicker",
    "isDisabled",
    isDisabled,
    "disabled",
    disabled,
  );

  const [internalValue, setInternalValue] = useState<DateRange | null>(defaultValue ?? null);
  const selectedValue = value !== undefined ? value : internalValue;

  // The first click of a two-click range selection. `null` when no selection is in
  // progress (either nothing picked yet, or the previous range already completed).
  const [anchor, setAnchor] = useState<DateValue | null>(null);

  const [internalPlaceholder, setInternalPlaceholder] = useState<DateValue>(
    placeholder ?? defaultPlaceholder ?? selectedValue?.start ?? today(getLocalTimeZone()),
  );
  const currentPlaceholder = placeholder ?? internalPlaceholder;

  const setPlaceholder = useCallback(
    (next: DateValue) => {
      setInternalPlaceholder(next);
      onPlaceholderChange?.(next);
    },
    [onPlaceholderChange],
  );

  const slotFns = monthRangePickerVariants();

  const months = getMonthsOfYear(currentPlaceholder);
  const rows = chunkRows(months, 3);
  const headingValue = formatYear(currentPlaceholder, locale);

  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);

  // While a selection is in progress (anchor set), display it as a single-month
  // range so the clicked cell highlights immediately. Otherwise show the committed value.
  const displayRange: DateRange | null = anchor ? { start: anchor, end: anchor } : selectedValue ?? null;

  function isDisabledMonth(date: DateValue): boolean {
    if (resolvedDisabled) return true;
    if (minValue && date.set({ day: date.calendar.getDaysInMonth(date) }).compare(minValue) < 0) return true;
    if (maxValue && date.set({ day: 1 }).compare(maxValue) > 0) return true;
    return isMonthDisabled?.(date) ?? false;
  }

  function clampRange(range: DateRange): DateRange {
    if (!maximumMonths || maximumMonths < 1) return range;
    const monthCount = (range.end.year - range.start.year) * 12 + (range.end.month - range.start.month) + 1;
    if (monthCount <= maximumMonths) return range;
    return { start: range.start, end: range.start.add({ months: maximumMonths - 1 }) };
  }

  function selectMonth(date: DateValue) {
    if (resolvedReadOnly || isDisabledMonth(date)) return;

    if (anchor === null) {
      // Start a new range.
      setAnchor(date);
      setPlaceholder(date);
      return;
    }

    const start = date.compare(anchor) <= 0 ? date : anchor;
    const end = date.compare(anchor) <= 0 ? anchor : date;
    const range = clampRange({ start, end });

    setInternalValue(range);
    onValueChange?.(range);
    setAnchor(null);
    setPlaceholder(date);
  }

  function goToYear(offset: number) {
    setPlaceholder(currentPlaceholder.add({ years: offset }));
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = nextGridIndex(event.key, index, months.length, 3);
    if (next === null) return;
    event.preventDefault();
    setFocusedIndex(next);
    buttonRefs.current[next]?.focus();
  }

  return (
    <div
      className={composeClassName(slotFns.base(), className, classNames?.base)}
      aria-label={calendarLabel}
    >
      <div className={composeClassName(slotFns.header(), classNames?.header)}>
        <button
          type="button"
          className={composeClassName(slotFns.navButton(), classNames?.navButton)}
          aria-label="Previous year"
          disabled={resolvedDisabled || undefined}
          onClick={() => goToYear(-1)}
        >
          <svg
            className={composeClassName(slotFns.navButtonIcon(), classNames?.navButtonIcon)}
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
        </button>

        <div className={composeClassName(slotFns.heading(), classNames?.heading)}>
          {renderHeading ? renderHeading(headingValue) : headingValue}
        </div>

        <button
          type="button"
          className={composeClassName(slotFns.navButton(), classNames?.navButton)}
          aria-label="Next year"
          disabled={resolvedDisabled || undefined}
          onClick={() => goToYear(1)}
        >
          <svg
            className={composeClassName(slotFns.navButtonIcon(), classNames?.navButtonIcon)}
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
        </button>
      </div>

      <table
        role="grid"
        className={composeClassName(slotFns.grid(), classNames?.grid)}
        aria-readonly={resolvedReadOnly || undefined}
      >
        <tbody className={composeClassName(slotFns.gridBody(), classNames?.gridBody)}>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              role="row"
              className={composeClassName(slotFns.gridRow(), classNames?.gridRow)}
            >
              {row.map((monthValue) => {
                const index = months.indexOf(monthValue);
                const selected =
                  displayRange !== null &&
                  monthValue.compare(displayRange.start) >= 0 &&
                  monthValue.compare(displayRange.end) <= 0;
                const isStart = displayRange !== null && isSameMonthAs(monthValue, displayRange.start);
                const isEnd = displayRange !== null && isSameMonthAs(monthValue, displayRange.end);
                const cellDisabled = isDisabledMonth(monthValue);
                const unavailable = isMonthUnavailable?.(monthValue) ?? false;
                return (
                  <td key={monthValue.toString()} role="gridcell">
                    <button
                      type="button"
                      ref={(el) => {
                        buttonRefs.current[index] = el;
                      }}
                      className={composeClassName(slotFns.cell(), classNames?.cell)}
                      tabIndex={index === focusedIndex ? 0 : -1}
                      disabled={(cellDisabled && !unavailable) || undefined}
                      aria-selected={selected || undefined}
                      data-selected={dataAttr(selected)}
                      data-selection-start={dataAttr(isStart)}
                      data-selection-end={dataAttr(isEnd)}
                      data-disabled={dataAttr(cellDisabled)}
                      data-unavailable={dataAttr(unavailable)}
                      onClick={() => selectMonth(monthValue)}
                      onFocus={() => setFocusedIndex(index)}
                      onKeyDown={(event) => handleKeyDown(event, index)}
                    >
                      {formatMonthLabel(monthValue, locale)}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
