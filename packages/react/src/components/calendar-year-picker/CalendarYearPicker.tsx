import { useCallback, useRef, useState, type ReactNode } from "react";
import { calendarVariants } from "@auronui/styles";
import { today, getLocalTimeZone, type DateValue } from "@internationalized/date";
import { composeClassName, dataAttr, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import { chunkRows, formatYearRange, getYearsPage, isSameYearAs } from "../calendar/date-grid-math";
import { nextGridIndex } from "../calendar/grid-keyboard";

export interface CalendarYearPickerClassNames {
  base?: ClassValue;
  header?: ClassValue;
  navButton?: ClassValue;
  navButtonIcon?: ClassValue;
  heading?: ClassValue;
  yearGrid?: ClassValue;
  yearGridBody?: ClassValue;
  yearGridRow?: ClassValue;
  yearCell?: ClassValue;
}

export interface CalendarYearPickerProps {
  value?: DateValue | undefined;
  defaultValue?: DateValue;
  onValueChange?: (value: DateValue | undefined) => void;
  placeholder?: DateValue;
  defaultPlaceholder?: DateValue;
  onPlaceholderChange?: (value: DateValue) => void;
  minValue?: DateValue;
  maxValue?: DateValue;
  isYearDisabled?: (date: DateValue) => boolean;
  isYearUnavailable?: (date: DateValue) => boolean;
  locale?: string;
  yearsPerPage?: number;
  isReadOnly?: boolean;
  /** @deprecated Use isReadOnly instead. */
  readonly?: boolean;
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  calendarLabel?: string;
  className?: ClassValue;
  classNames?: CalendarYearPickerClassNames;
  /** Render override for the heading (receives the formatted "start - end" year range). */
  renderHeading?: (headingValue: string) => ReactNode;
}

/**
 * Standalone year-selection grid (3x4). Used both on its own and as the "year" drill-up
 * view inside `Calendar`/`RangeCalendar`. Mirrors reka-ui's `YearPickerRoot` DOM shape:
 * a `<table role="grid">` of `<td>`-wrapped `<button>` cells, with keyboard arrow-key
 * navigation per the WAI-ARIA grid pattern.
 */
export function CalendarYearPicker({
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
  isReadOnly,
  readonly,
  isDisabled,
  disabled,
  calendarLabel,
  className,
  classNames,
  renderHeading,
}: CalendarYearPickerProps) {
  const resolvedReadOnly = resolveDeprecatedBooleanProp(
    "CalendarYearPicker",
    "isReadOnly",
    isReadOnly,
    "readonly",
    readonly,
  );
  const resolvedDisabled = resolveDeprecatedBooleanProp(
    "CalendarYearPicker",
    "isDisabled",
    isDisabled,
    "disabled",
    disabled,
  );

  const [internalValue, setInternalValue] = useState<DateValue | undefined>(defaultValue);
  const selectedValue = value !== undefined ? value : internalValue;

  const [internalPlaceholder, setInternalPlaceholder] = useState<DateValue>(
    placeholder ?? defaultPlaceholder ?? selectedValue ?? today(getLocalTimeZone()),
  );
  const currentPlaceholder = placeholder ?? internalPlaceholder;

  const setPlaceholder = useCallback(
    (next: DateValue) => {
      setInternalPlaceholder(next);
      onPlaceholderChange?.(next);
    },
    [onPlaceholderChange],
  );

  const slotFns = calendarVariants();

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

  function selectYear(date: DateValue) {
    if (resolvedReadOnly || isDisabledYear(date)) return;
    setInternalValue(date);
    onValueChange?.(date);
    setPlaceholder(date);
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
        className={composeClassName(slotFns.yearGrid(), classNames?.yearGrid)}
        aria-readonly={resolvedReadOnly || undefined}
      >
        <tbody className={composeClassName(slotFns.yearGridBody(), classNames?.yearGridBody)}>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              role="row"
              className={composeClassName(slotFns.yearGridRow(), classNames?.yearGridRow)}
            >
              {row.map((yearValue) => {
                const index = years.indexOf(yearValue);
                const selected = selectedValue !== undefined && isSameYearAs(selectedValue, yearValue);
                const cellDisabled = isDisabledYear(yearValue);
                const unavailable = isYearUnavailable?.(yearValue) ?? false;
                return (
                  <td key={yearValue.toString()} role="gridcell">
                    <button
                      type="button"
                      ref={(el) => {
                        buttonRefs.current[index] = el;
                      }}
                      className={composeClassName(slotFns.yearCell(), classNames?.yearCell)}
                      tabIndex={index === focusedIndex ? 0 : -1}
                      disabled={(cellDisabled && !unavailable) || undefined}
                      aria-selected={selected || undefined}
                      data-selected={dataAttr(selected)}
                      data-disabled={dataAttr(cellDisabled)}
                      data-unavailable={dataAttr(unavailable)}
                      onClick={() => selectYear(yearValue)}
                      onFocus={() => setFocusedIndex(index)}
                      onKeyDown={(event) => handleKeyDown(event, index)}
                    >
                      <span className={composeClassName(slotFns.yearCellLabel())}>
                        {yearValue.year}
                      </span>
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
