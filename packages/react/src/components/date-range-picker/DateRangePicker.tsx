import { useId, useLayoutEffect, useMemo, useRef, type ReactNode, type RefObject } from "react";
import {
  DateRangePicker as RACDateRangePicker,
  DateInput as RACDateInput,
  DateSegment,
  Group,
  Button as RACButton,
  Popover,
  Dialog,
  I18nProvider,
} from "react-aria-components";
import type { DateValue } from "@internationalized/date";
import { dateRangePickerVariants, dateRangeFieldVariants, type DateRangeFieldVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { useFormField } from "../../hooks";
import { FieldLabel } from "../_shared/FieldLabel";
import { FormFieldHelper } from "../_shared/FormFieldHelper";
// `../range-calendar` is being ported in a parallel batch and is not yet present
// in this package. This import path matches where it lands (mirrors `Calendar`'s
// path in DatePicker.tsx) — until it exists this file will fail to resolve; that
// is the one expected typecheck failure for this component, called out in the
// port report.
import { RangeCalendar, type RangeCalendarClassNames } from "../range-calendar";

export interface DateRange {
  start: DateValue;
  end: DateValue;
}

/**
 * DateRangePicker — segmented DateRangeField-style dual input + a
 * RangeCalendar popover. Ports @auronui/vue's DateRangePicker.vue (reka-ui's
 * `DateRangePickerRoot`). Same RAC-context-based composition approach as
 * DatePicker.tsx: the field anatomy is inlined (two `DateInput`s sharing
 * `DateRangePicker`'s own field context) rather than reusing our standalone
 * `DateRangeField` component.
 */

export interface DateRangePickerOwnProps {
  variant?: DateRangeFieldVariants["variant"];
  size?: DateRangeFieldVariants["size"];
  color?: DateRangeFieldVariants["color"];
  labelPlacement?: DateRangeFieldVariants["labelPlacement"];
  fullWidth?: boolean;

  value?: DateRange | null;
  defaultValue?: DateRange;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholderValue?: DateValue;
  minValue?: DateValue;
  maxValue?: DateValue;
  isDateUnavailable?: (date: DateValue) => boolean;
  locale?: string;
  granularity?: "day" | "hour" | "minute" | "second";
  hourCycle?: 12 | 24;
  label?: string;
  description?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  name?: string;
  hideTimeZone?: boolean;
  visibleMonths?: number;
  closeOnSelect?: boolean;
  id?: string;
  onChange?: (value: DateRange | null) => void;

  className?: ClassValue;
  classNames?: Partial<{
    base: ClassValue;
    trigger: ClassValue;
    triggerIndicator: ClassValue;
    popover: ClassValue;
    calendar: RangeCalendarClassNames;
  }>;
  selectorIcon?: ReactNode;
}

export type DateRangePickerProps = DateRangePickerOwnProps;

function DefaultRangeIcon({ className }: { className: string }) {
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
      focusable="false"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

/**
 * Writes `data-focused="true"` onto the field group's DOM node so
 * date-range-field.css's focused-state block — gated on `[data-focused="true"]`,
 * reka-ui's convention — applies unchanged. RAC's `Group` exposes the same info
 * as `isFocusWithin` (selector `[data-focus-within]`, no `="true"` value, so it
 * never matches). Mirrors `DatePicker.tsx`'s `DateInputGroupStateAttrs`.
 */
function DateRangeGroupStateAttrs({
  elementRef,
  isFocusWithin,
}: {
  elementRef: RefObject<HTMLElement | null>;
  isFocusWithin: boolean;
}) {
  useLayoutEffect(() => {
    if (isFocusWithin) elementRef.current?.setAttribute("data-focused", "true");
    else elementRef.current?.removeAttribute("data-focused");
  });
  return null;
}

export function DateRangePicker({
  variant = "flat",
  size = "md",
  color = "default",
  labelPlacement = "inside",
  fullWidth = false,
  value,
  defaultValue,
  open,
  defaultOpen = false,
  onOpenChange,
  placeholderValue,
  minValue,
  maxValue,
  isDateUnavailable,
  locale,
  granularity,
  hourCycle,
  label,
  description,
  errorMessage,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  name,
  hideTimeZone = false,
  visibleMonths = 1,
  closeOnSelect = true,
  id,
  onChange,
  className,
  classNames,
  selectorIcon,
}: DateRangePickerProps) {
  const generatedId = useId();
  const fieldId = id ?? `${generatedId}-field`;
  const labelId = `${generatedId}-label`;
  const groupRef = useRef<HTMLDivElement | null>(null);

  const {
    descriptionId,
    errorMessageId,
    showError,
    showDescription,
    hasHelper,
    ariaDescribedBy,
    hasLabel,
    showOutsideLabel,
    showInsideLabel,
    rootDataAttrs,
  } = useFormField({
    fieldId,
    label,
    description,
    errorMessage,
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
    labelPlacement,
  });

  const fieldSlots = useMemo(
    () =>
      dateRangeFieldVariants({
        variant,
        size,
        color,
        fullWidth,
        isInvalid,
        isDisabled,
        isReadonly: isReadOnly,
        hasLabel,
        labelPlacement,
      }),
    [variant, size, color, fullWidth, isInvalid, isDisabled, isReadOnly, hasLabel, labelPlacement],
  );

  const pickerSlots = useMemo(() => dateRangePickerVariants(), []);

  const content = (
    <RACDateRangePicker
      id={fieldId}
      // See DateInput.tsx: bridges the two independently-resolved
      // `@internationalized/date` package instances in this workspace.
      {...({
        // See DatePicker.tsx: only pass `value` when truly controlled.
        ...(value !== undefined ? { value: value ?? null } : { defaultValue }),
        placeholderValue,
        minValue,
        maxValue,
        isDateUnavailable,
        onChange: (v: DateRange | null) => onChange?.(v ?? null),
      } as any)}
      isOpen={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      granularity={granularity}
      hourCycle={hourCycle}
      hideTimeZone={hideTimeZone}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      isInvalid={isInvalid}
      name={name}
      shouldCloseOnSelect={closeOnSelect}
      aria-labelledby={hasLabel ? labelId : undefined}
      aria-describedby={ariaDescribedBy}
      className={composeClassName(pickerSlots.base(), className, classNames?.base)}
      data-slot="date-range-picker"
    >
      {({ state }) => (
        <>
          <div className={composeClassName(fieldSlots.mainWrapper())}>
            <Group ref={groupRef} className={composeClassName(fieldSlots.inputWrapper())} data-slot="date-range-field-input">
              {({ isFocusWithin }) => (
                <>
                  <DateRangeGroupStateAttrs elementRef={groupRef} isFocusWithin={isFocusWithin} />
                  {showInsideLabel && (
                    <FieldLabel
                      id={labelId}
                      htmlFor={fieldId}
                      label={label}
                      isRequired={isRequired}
                      className={fieldSlots.label()}
                    />
                  )}

                  <RACDateInput slot="start" className={composeClassName(fieldSlots.segmentList())} data-slot="segment-list" data-type="start">
                    {(segment) => <DateSegment segment={segment} className={fieldSlots.segment()} data-slot="segment" />}
                  </RACDateInput>

                  <span className={fieldSlots.separator()} aria-hidden="true" data-slot="separator">
                    –
                  </span>

                  <RACDateInput slot="end" className={composeClassName(fieldSlots.segmentList())} data-slot="segment-list" data-type="end">
                    {(segment) => <DateSegment segment={segment} className={fieldSlots.segment()} data-slot="segment" />}
                  </RACDateInput>

                  <RACButton
                    className={composeClassName(pickerSlots.trigger(), classNames?.trigger)}
                    aria-label="Open date range picker"
                  >
                    {selectorIcon ?? <DefaultRangeIcon className={composeClassName(pickerSlots.triggerIndicator(), classNames?.triggerIndicator)} />}
                  </RACButton>
                </>
              )}
            </Group>

            <FormFieldHelper
              hasHelper={hasHelper}
              showError={showError}
              showDescription={showDescription}
              errorMessage={errorMessage}
              description={description}
              errorMessageId={errorMessageId}
              descriptionId={descriptionId}
              errorRole="alert"
              wrapperClassName={fieldSlots.helperWrapper()}
              errorClassName={fieldSlots.errorMessage()}
              descriptionClassName={fieldSlots.description()}
            />
          </div>

          <Popover className={composeClassName(pickerSlots.popover(), classNames?.popover)} data-slot="popover">
            <Dialog>
              <RangeCalendar
                {...({
                  value: state.dateRange ?? undefined,
                  onValueChange: (v: DateRange | undefined) => v && state.setDateRange(v as any),
                  minValue,
                  maxValue,
                  isDateUnavailable,
                } as any)}
                numberOfMonths={visibleMonths}
                isReadOnly={isReadOnly}
                isDisabled={isDisabled}
                classNames={classNames?.calendar}
              />
            </Dialog>
          </Popover>
        </>
      )}
    </RACDateRangePicker>
  );

  return (
    <div data-slot="date-range-picker-root" {...rootDataAttrs}>
      {showOutsideLabel && (
        <FieldLabel id={labelId} htmlFor={fieldId} label={label} isRequired={isRequired} className={fieldSlots.label()} />
      )}
      {locale ? <I18nProvider locale={locale}>{content}</I18nProvider> : content}
    </div>
  );
}
