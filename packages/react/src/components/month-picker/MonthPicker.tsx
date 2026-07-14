import { useCallback, useRef, useState, type ReactNode } from "react";
import { calendarVariants } from "@auronui/styles";
import { today, getLocalTimeZone, type DateValue } from "@internationalized/date";
import { composeClassName, dataAttr, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import { chunkRows, formatMonthLabel, formatYear, getMonthsOfYear, isSameMonthAs } from "../calendar/date-grid-math";
import { nextGridIndex } from "../calendar/grid-keyboard";

export interface MonthPickerClassNames {
  base?: ClassValue;
  header?: ClassValue;
  navButton?: ClassValue;
  navButtonIcon?: ClassValue;
  heading?: ClassValue;
  monthGrid?: ClassValue;
  monthGridBody?: ClassValue;
  monthGridRow?: ClassValue;
  monthCell?: ClassValue;
}

export interface MonthPickerProps {
  value?: DateValue | undefined;
  defaultValue?: DateValue;
  onValueChange?: (value: DateValue | undefined) => void;
  placeholder?: DateValue;
  defaultPlaceholder?: DateValue;
  onPlaceholderChange?: (value: DateValue) => void;
  minValue?: DateValue;
  maxValue?: DateValue;
  isMonthDisabled?: (date: DateValue) => boolean;
  isMonthUnavailable?: (date: DateValue) => boolean;
  locale?: string;
  isReadOnly?: boolean;
  /** @deprecated Use isReadOnly instead. */
  readonly?: boolean;
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  calendarLabel?: string;
  className?: ClassValue;
  classNames?: MonthPickerClassNames;
  /** Render override for the heading (receives the formatted year, e.g. "2024"). */
  renderHeading?: (headingValue: string) => ReactNode;
}

/**
 * Standalone month-selection grid (3x4 months of a year). Used both on its own and as
 * the "month" drill-up view inside `Calendar`/`RangeCalendar`. Mirrors reka-ui's
 * `MonthPickerRoot` DOM shape: a `<table role="grid">` of `<td>`-wrapped `<button>`
 * cells, with keyboard arrow-key navigation per the WAI-ARIA grid pattern.
 */
export function MonthPicker({
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
  isReadOnly,
  readonly,
  isDisabled,
  disabled,
  calendarLabel,
  className,
  classNames,
  renderHeading,
}: MonthPickerProps) {
  const resolvedReadOnly = resolveDeprecatedBooleanProp(
    "MonthPicker",
    "isReadOnly",
    isReadOnly,
    "readonly",
    readonly,
  );
  const resolvedDisabled = resolveDeprecatedBooleanProp(
    "MonthPicker",
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

  const months = getMonthsOfYear(currentPlaceholder);
  const rows = chunkRows(months, 3);
  const headingValue = formatYear(currentPlaceholder, locale);

  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);

  function isDisabledMonth(date: DateValue): boolean {
    if (resolvedDisabled) return true;
    if (minValue && date.set({ day: date.calendar.getDaysInMonth(date) }).compare(minValue) < 0) return true;
    if (maxValue && date.set({ day: 1 }).compare(maxValue) > 0) return true;
    return isMonthDisabled?.(date) ?? false;
  }

  function selectMonth(date: DateValue) {
    if (resolvedReadOnly || isDisabledMonth(date)) return;
    setInternalValue(date);
    onValueChange?.(date);
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
        className={composeClassName(slotFns.monthGrid(), classNames?.monthGrid)}
        aria-readonly={resolvedReadOnly || undefined}
      >
        <tbody className={composeClassName(slotFns.monthGridBody(), classNames?.monthGridBody)}>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              role="row"
              className={composeClassName(slotFns.monthGridRow(), classNames?.monthGridRow)}
            >
              {row.map((monthValue) => {
                const index = months.indexOf(monthValue);
                const selected = selectedValue !== undefined && isSameMonthAs(selectedValue, monthValue);
                const cellDisabled = isDisabledMonth(monthValue);
                const unavailable = isMonthUnavailable?.(monthValue) ?? false;
                return (
                  <td key={monthValue.toString()} role="gridcell">
                    <button
                      type="button"
                      ref={(el) => {
                        buttonRefs.current[index] = el;
                      }}
                      className={composeClassName(slotFns.monthCell(), classNames?.monthCell)}
                      tabIndex={index === focusedIndex ? 0 : -1}
                      disabled={(cellDisabled && !unavailable) || undefined}
                      aria-selected={selected || undefined}
                      data-selected={dataAttr(selected)}
                      data-disabled={dataAttr(cellDisabled)}
                      data-unavailable={dataAttr(unavailable)}
                      onClick={() => selectMonth(monthValue)}
                      onFocus={() => setFocusedIndex(index)}
                      onKeyDown={(event) => handleKeyDown(event, index)}
                    >
                      <span className={composeClassName(slotFns.monthCellLabel())}>
                        {formatMonthLabel(monthValue, locale)}
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
