import { useId, useLayoutEffect, useMemo, useRef, type ReactNode, type RefObject } from "react";
import {
  DatePicker as RACDatePicker,
  DateInput as RACDateInput,
  DateSegment,
  Group,
  Button as RACButton,
  Popover,
  Dialog,
  I18nProvider,
} from "react-aria-components";
import { CalendarDateTime, Time, type DateValue } from "@internationalized/date";
import { dateTimePickerVariants, dateInputVariants, type DateInputVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { useFormField } from "../../hooks";
import { FieldLabel } from "../_shared/FieldLabel";
import { FormFieldHelper } from "../_shared/FormFieldHelper";
import { TimeScroller } from "../_shared/TimeScroller";
import { Calendar, type CalendarClassNames } from "../calendar";
import { Button } from "../button";

/**
 * DateTimePicker — DateInput segments (date + time) + a popover with a
 * Calendar (date) and TimeScroller wheel (time) side by side, plus a Done
 * button. Ports @auronui/vue's DateTimePicker.vue. Same RAC-context
 * composition as DatePicker.tsx, with the time-of-day wired through
 * `state.timeValue`/`state.setTimeValue` alongside `state.dateValue`.
 */

export interface DateTimePickerOwnProps {
  variant?: "flat" | "bordered" | "faded" | "underlined";
  size?: DateInputVariants["size"];
  color?: DateInputVariants["color"];
  labelPlacement?: DateInputVariants["labelPlacement"];
  fullWidth?: boolean;
  label?: string;
  description?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  name?: string;
  granularity?: "minute" | "second";
  hourCycle?: 12 | 24;
  hideTimeZone?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  doneLabel?: string;
  locale?: string;
  value?: CalendarDateTime | null;
  defaultValue?: CalendarDateTime;
  placeholderValue?: DateValue;
  minValue?: CalendarDateTime;
  maxValue?: CalendarDateTime;
  isDateUnavailable?: (date: DateValue) => boolean;
  id?: string;
  onChange?: (value: CalendarDateTime | null) => void;

  className?: ClassValue;
  classNames?: Partial<{
    base: ClassValue;
    trigger: ClassValue;
    triggerIndicator: ClassValue;
    popover: ClassValue;
    panel: ClassValue;
    divider: ClassValue;
    calendar: CalendarClassNames;
    dateInput: Partial<{
      label: ClassValue;
      mainWrapper: ClassValue;
      inputWrapper: ClassValue;
      startContent: ClassValue;
      segmentList: ClassValue;
      segment: ClassValue;
      endContent: ClassValue;
      helperWrapper: ClassValue;
      errorMessage: ClassValue;
      description: ClassValue;
    }>;
    timeScroller: Partial<{
      scrollerWrap: ClassValue;
      scrollerColumn: ClassValue;
      scrollerItem: ClassValue;
    }>;
  }>;
  selectorIcon?: ReactNode;
  footer?: (opts: { close: () => void }) => ReactNode;
}

export type DateTimePickerProps = DateTimePickerOwnProps;

function DefaultCalendarIcon({ className }: { className: string }) {
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
 * date-input.css's focused-state block — gated on `[data-focused="true"]`,
 * reka-ui's convention — applies unchanged. RAC's `Group` exposes the same info
 * as `isFocusWithin` (selector `[data-focus-within]`, no `="true"` value, so it
 * never matches). Mirrors `DatePicker.tsx`'s `DateInputGroupStateAttrs`.
 */
function DateTimeGroupStateAttrs({
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

export function DateTimePicker({
  size = "md",
  color = "default",
  labelPlacement = "inside",
  fullWidth = false,
  label,
  description,
  errorMessage,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  name,
  granularity = "minute",
  hourCycle,
  hideTimeZone = false,
  open,
  defaultOpen = false,
  onOpenChange,
  doneLabel = "Done",
  locale,
  value,
  defaultValue,
  placeholderValue,
  minValue,
  maxValue,
  isDateUnavailable,
  id,
  onChange,
  className,
  classNames,
  selectorIcon,
  footer,
}: DateTimePickerProps) {
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
      dateInputVariants({
        variant: "flat",
        size,
        color,
        fullWidth,
        isInvalid,
        isDisabled,
        isReadonly: isReadOnly,
        hasLabel,
        labelPlacement,
      }),
    [size, color, fullWidth, isInvalid, isDisabled, isReadOnly, hasLabel, labelPlacement],
  );

  const pickerSlots = useMemo(
    () => dateTimePickerVariants({ isInvalid, isDisabled, fullWidth }),
    [isInvalid, isDisabled, fullWidth],
  );

  const content = (
    <RACDatePicker
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
        onChange: (v: CalendarDateTime | null) => onChange?.(v ?? null),
      } as any)}
      isOpen={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      // Unlike the plain DatePicker, RAC's default (auto-close the popover the
      // instant a calendar date is picked) is wrong here — this picker also has
      // a time wheel and a Done button, so the popover must stay open after a
      // date pick until the user explicitly presses Done. Matches
      // DateTimePicker.vue, whose calendar-value setter never closes the
      // popover (unlike DatePicker.vue's, which does) — only the Done button does.
      shouldCloseOnSelect={false}
      granularity={granularity}
      hourCycle={hourCycle}
      hideTimeZone={hideTimeZone}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      isInvalid={isInvalid}
      name={name}
      aria-labelledby={hasLabel ? labelId : undefined}
      aria-describedby={ariaDescribedBy}
      className={composeClassName(pickerSlots.base(), className, classNames?.base)}
      data-slot="date-time-picker"
    >
      {({ state }) => {
        const timeValue = (state.timeValue as Time | null) ?? new Time(0, 0);
        return (
          <>
            <div className={composeClassName(fieldSlots.mainWrapper())}>
              <Group ref={groupRef} className={composeClassName(fieldSlots.inputWrapper(), classNames?.dateInput?.inputWrapper)} data-slot="date-input">
                {({ isFocusWithin }) => (
                  <>
                    <DateTimeGroupStateAttrs elementRef={groupRef} isFocusWithin={isFocusWithin} />
                    {showInsideLabel && (
                      <FieldLabel
                        id={labelId}
                        htmlFor={fieldId}
                        label={label}
                        isRequired={isRequired}
                        className={composeClassName(fieldSlots.label(), classNames?.dateInput?.label)}
                      />
                    )}

                    <RACDateInput
                      className={composeClassName(fieldSlots.segmentList(), classNames?.dateInput?.segmentList)}
                      data-slot="segment-list"
                    >
                      {(segment) => (
                        <DateSegment
                          segment={segment}
                          className={composeClassName(fieldSlots.segment(), classNames?.dateInput?.segment)}
                          data-slot="segment"
                        />
                      )}
                    </RACDateInput>

                    <RACButton className={composeClassName(pickerSlots.trigger(), classNames?.trigger)} aria-label="Open date time picker">
                      {selectorIcon ?? (
                        <DefaultCalendarIcon className={composeClassName(pickerSlots.triggerIndicator(), classNames?.triggerIndicator)} />
                      )}
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
                wrapperClassName={composeClassName(fieldSlots.helperWrapper(), classNames?.dateInput?.helperWrapper)}
                errorClassName={composeClassName(fieldSlots.errorMessage(), classNames?.dateInput?.errorMessage)}
                descriptionClassName={composeClassName(fieldSlots.description(), classNames?.dateInput?.description)}
              />
            </div>

            <Popover className={composeClassName(pickerSlots.popover(), classNames?.popover)} data-slot="popover">
              <Dialog>
                <div className={composeClassName(pickerSlots.panel(), classNames?.panel)} data-slot="panel">
                  <div className={pickerSlots.calendarPane()} data-slot="calendar-pane">
                    <Calendar
                      {...({
                        value: state.dateValue ?? undefined,
                        onValueChange: (v: DateValue | undefined) => v && state.setDateValue(v as any),
                        minValue,
                        maxValue,
                        isDateUnavailable,
                      } as any)}
                      isReadOnly={isReadOnly}
                      isDisabled={isDisabled}
                      classNames={classNames?.calendar}
                    />
                  </div>

                  <div className={composeClassName(pickerSlots.divider(), classNames?.divider)} data-slot="divider" aria-hidden="true" />

                  <div className={pickerSlots.timePane()} data-slot="time-pane">
                    <TimeScroller
                      value={timeValue}
                      onChange={(v) => (state.setTimeValue as (v: unknown) => void)(v)}
                      granularity={granularity}
                      hourCycle={hourCycle ?? 24}
                      classNames={classNames?.timeScroller}
                    />

                    <div className={pickerSlots.timeDone()} data-slot="time-done">
                      {footer ? (
                        footer({ close: () => state.setOpen(false) })
                      ) : (
                        <Button size="sm" color="primary" data-slot="done-button" onClick={() => state.setOpen(false)}>
                          {doneLabel}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Dialog>
            </Popover>
          </>
        );
      }}
    </RACDatePicker>
  );

  return (
    <div data-slot="date-time-picker-root" {...rootDataAttrs}>
      {showOutsideLabel && (
        <FieldLabel
          id={labelId}
          htmlFor={fieldId}
          label={label}
          isRequired={isRequired}
          className={composeClassName(fieldSlots.label(), classNames?.dateInput?.label)}
        />
      )}
      {locale ? <I18nProvider locale={locale}>{content}</I18nProvider> : content}
    </div>
  );
}
