import { useCallback, useRef, useState, type ReactNode } from "react";
import { yearRangePickerVariants } from "@auronui/styles";
import { today, getLocalTimeZone, type DateValue } from "@internationalized/date";
import { composeClassName, dataAttr, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import { chunkRows, formatYearRange, getYearsPage } from "../calendar/date-grid-math";
import { nextGridIndex } from "../calendar/grid-keyboard";

export interface DateRange {
  start: DateValue;
  end: DateValue;
}

export interface YearRangePickerClassNames {
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

export interface YearRangePickerProps {
  value?: DateRange | null;
  defaultValue?: DateRange | null;
  onValueChange?: (range: DateRange | null) => void;
  placeholder?: DateValue;
  defaultPlaceholder?: DateValue;
  onPlaceholderChange?: (value: DateValue) => void;
  minValue?: DateValue;
  maxValue?: DateValue;
  isYearDisabled?: (date: DateValue) => boolean;
  isYearUnavailable?: (date: DateValue) => boolean;
  locale?: string;
  yearsPerPage?: number;
  /** Maximum number of years (inclusive) allowed between start and end. */
  maximumYears?: number;
  /** Fix one end of the range: every subsequent click only moves the other end. */
  fixedDate?: "start" | "end";
  isReadOnly?: boolean;
  /** @deprecated Use isReadOnly instead. */
  readonly?: boolean;
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  calendarLabel?: string;
  className?: ClassValue;
  classNames?: YearRangePickerClassNames;
  /** Render override for the heading (receives the formatted "start - end" year range). */
  renderHeading?: (headingValue: string) => ReactNode;
}

/**
 * Standalone RANGE year-selection grid (3x4). Ported from the Vue `YearRangePicker`,
 * which wraps reka-ui's `YearRangePickerRoot`. React has no equivalent headless
 * primitive, so the two-click range-selection state machine below is hand-rolled,
 * reusing `CalendarYearPicker`'s grid/keyboard-nav shape.
 *
 * Dropped from the Vue source (genuinely out of scope for a React port):
 * - `as` / `asChild` — Vue-only render-delegation props, no React equivalent needed.
 * - `allowNonContiguousRanges` — reka-ui-internal option for disjoint multi-range
 *   selection; this port only supports a single contiguous [start, end] range.
 * - `preventDeselect` — reka-ui option to block clearing a selection; the two-click
 *   model here never clears an existing range on its own, so it doesn't apply.
 * - `initialFocus`, `dir`, `nextPage`, `prevPage` — reka-ui primitive plumbing not
 *   exposed by the sibling `CalendarYearPicker` port either.
 *
 * Kept: `yearsPerPage`, `maximumYears` (clamps the far end so the span never exceeds
 * this many years), and `fixedDate` (pins one end of the range so every subsequent
 * click only moves the other end, instead of the default two-click start/end model).
 */
export function YearRangePicker({
  value,
  defaultValue,
  onValueChange,
  placeholder,
  defaultPlaceholder,
  onPlaceholderChange,
  minValue,
  maxValue,
  isYearDisabled,
  isYearUnavailable,
  locale = "en-US",
  yearsPerPage = 12,
  maximumYears,
  fixedDate,
  isReadOnly,
  readonly,
  isDisabled,
  disabled,
  calendarLabel,
  className,
  classNames,
  renderHeading,
}: YearRangePickerProps) {
  const resolvedReadOnly = resolveDeprecatedBooleanProp(
    "YearRangePicker",
    "isReadOnly",
    isReadOnly,
    "readonly",
    readonly,
  );
  const resolvedDisabled = resolveDeprecatedBooleanProp(
    "YearRangePicker",
    "isDisabled",
    isDisabled,
    "disabled",
    disabled,
  );

  const [internalValue, setInternalValue] = useState<DateRange | null>(defaultValue ?? null);
  const selectedValue = value !== undefined ? value : internalValue;

  // Tracks the anchor year of an in-progress two-click selection. Non-null between
  // the first click (which sets start=end=anchor) and the second click (which
  // normalizes [anchor, secondClick] into the committed range and clears this).
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

  const slotFns = yearRangePickerVariants();

  const years = getYearsPage(currentPlaceholder, yearsPerPage);
  const rows = chunkRows(years, 3);
  const headingValue = formatYearRange(years, locale);

  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);

  function isDisabledYear(date: DateValue): boolean {
    if (resolvedDisabled) return true;
    if (minValue && date.set({ month: 12, day: 31 }).compare(minValue) < 0) return true;
    if (maxValue && date.set({ month: 1, day: 1 }).compare(maxValue) > 0) return true;
    return isYearDisabled?.(date) ?? false;
  }

  function clampToMaximumYears(start: DateValue, end: DateValue): DateValue {
    if (!maximumYears) return end;
    const span = end.year - start.year + 1;
    if (span <= maximumYears) return end;
    return start.add({ years: maximumYears - 1 });
  }

  function commitRange(a: DateValue, b: DateValue) {
    const ascending = a.compare(b) <= 0;
    const start = ascending ? a : b;
    let end = ascending ? b : a;
    end = clampToMaximumYears(start, end);
    const range: DateRange = { start, end };
    setInternalValue(range);
    onValueChange?.(range);
    setPlaceholder(end);
  }

  function selectYear(date: DateValue) {
    if (resolvedReadOnly || isDisabledYear(date)) return;

    if (fixedDate) {
      const fixed = selectedValue
        ? fixedDate === "start"
          ? selectedValue.start
          : selectedValue.end
        : date;
      commitRange(fixed, date);
      return;
    }

    if (anchor === null) {
      // First click of a new selection: start=end=this year.
      setAnchor(date);
      const range: DateRange = { start: date, end: date };
      setInternalValue(range);
      onValueChange?.(range);
      setPlaceholder(date);
    } else {
      // Second click: normalize order and complete the range.
      commitRange(anchor, date);
      setAnchor(null);
    }
  }

  function goToPage(offset: number) {
    setPlaceholder(currentPlaceholder.add({ years: offset * yearsPerPage }));
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = nextGridIndex(event.key, index, years.length, 3);
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
          aria-label="Previous years"
          disabled={resolvedDisabled || undefined}
          onClick={() => goToPage(-1)}
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
          aria-label="Next years"
          disabled={resolvedDisabled || undefined}
          onClick={() => goToPage(1)}
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
              {row.map((yearValue) => {
                const index = years.indexOf(yearValue);
                const isStart = selectedValue !== null && selectedValue !== undefined
                  && yearValue.year === selectedValue.start.year;
                const isEnd = selectedValue !== null && selectedValue !== undefined
                  && yearValue.year === selectedValue.end.year;
                const inRange = selectedValue !== null && selectedValue !== undefined
                  && yearValue.year >= selectedValue.start.year
                  && yearValue.year <= selectedValue.end.year;
                const cellDisabled = isDisabledYear(yearValue);
                const unavailable = isYearUnavailable?.(yearValue) ?? false;
                return (
                  <td key={yearValue.toString()} role="gridcell">
                    <button
                      type="button"
                      ref={(el) => {
                        buttonRefs.current[index] = el;
                      }}
                      className={composeClassName(slotFns.cell(), classNames?.cell)}
                      tabIndex={index === focusedIndex ? 0 : -1}
                      disabled={(cellDisabled && !unavailable) || undefined}
                      aria-selected={inRange || undefined}
                      data-selected={dataAttr(inRange)}
                      data-selection-start={dataAttr(isStart)}
                      data-selection-end={dataAttr(isEnd)}
                      data-disabled={dataAttr(cellDisabled)}
                      data-unavailable={dataAttr(unavailable)}
                      onClick={() => selectYear(yearValue)}
                      onFocus={() => setFocusedIndex(index)}
                      onKeyDown={(event) => handleKeyDown(event, index)}
                    >
                      {yearValue.year}
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
