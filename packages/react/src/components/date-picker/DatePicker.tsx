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
import type { DateValue } from "@internationalized/date";
import { datePickerVariants, dateInputVariants, type DateInputVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { useFormField } from "../../hooks";
import { FieldLabel } from "../_shared/FieldLabel";
import { FormFieldHelper } from "../_shared/FormFieldHelper";
import { Calendar, type CalendarClassNames } from "../calendar";

/**
 * DatePicker — segmented DateInput + a Calendar popover.
 *
 * Ports @auronui/vue's DatePicker.vue (reka-ui's `DatePickerRoot` wrapping
 * a `DateInput` + `Calendar`). RAC's own `DatePicker` already supplies a
 * `DateFieldState`/`DatePickerState` context to a bare `DateInput` +
 * `Group` + `Popover`/`Dialog` — so unlike Vue (which composes the fully
 * independent `DateInput.vue` component via v-model), this inlines the
 * field anatomy directly rather than nesting our `DateInput` component
 * (nesting a second `DateField` inside `DatePicker`'s own field context
 * isn't a supported RAC composition). The `../calendar` `Calendar`
 * component is reused as-is, wired to `state.dateValue`/`setDateValue`.
 */

export interface DatePickerOwnProps {
  variant?: DateInputVariants["variant"];
  size?: DateInputVariants["size"];
  color?: DateInputVariants["color"];
  labelPlacement?: DateInputVariants["labelPlacement"];
  fullWidth?: boolean;

  value?: DateValue | null;
  defaultValue?: DateValue;
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
  onChange?: (value: DateValue | null) => void;

  className?: ClassValue;
  classNames?: Partial<{
    base: ClassValue;
    trigger: ClassValue;
    triggerIndicator: ClassValue;
    popover: ClassValue;
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
  }>;
  selectorIcon?: ReactNode;
}

export type DatePickerProps = DatePickerOwnProps;

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
 * date-input.css's focused-state border/background block — gated on
 * `[data-focused="true"]`, reka-ui's convention — applies unchanged. RAC's
 * `Group` exposes the same info as `isFocusWithin` (selector
 * `[data-focus-within]`, no `="true"` value, so it never matches). Mirrors
 * `PopoverContent`'s `PopoverStateAttrs`.
 */
function DateInputGroupStateAttrs({
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

export function DatePicker({
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
}: DatePickerProps) {
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

  const pickerSlots = useMemo(() => datePickerVariants(), []);

  const content = (
    <RACDatePicker
      id={fieldId}
      // See DateInput.tsx: bridges the two independently-resolved
      // `@internationalized/date` package instances in this workspace.
      {...({
        // Only pass `value` when truly controlled — coalescing an absent `value` to
        // `null` here would force RAC into controlled mode with a fixed empty value,
        // silently discarding `defaultValue` and any user edits.
        ...(value !== undefined ? { value: value ?? null } : { defaultValue }),
        placeholderValue,
        minValue,
        maxValue,
        isDateUnavailable,
        onChange: (v: DateValue | null) => onChange?.(v ?? null),
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
      data-slot="date-picker"
    >
      {({ state }) => (
        <>
          <div className={composeClassName(fieldSlots.mainWrapper(), classNames?.dateInput?.mainWrapper)}>
            <Group
              ref={groupRef}
              className={composeClassName(fieldSlots.inputWrapper(), classNames?.dateInput?.inputWrapper)}
              data-slot="date-input"
            >
              {({ isFocusWithin }) => (
                <>
                  <DateInputGroupStateAttrs elementRef={groupRef} isFocusWithin={isFocusWithin} />
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

                  <RACButton
                    className={composeClassName(pickerSlots.trigger(), classNames?.trigger)}
                    aria-label="Open date picker"
                  >
                    {selectorIcon ?? <DefaultCalendarIcon className={composeClassName(pickerSlots.triggerIndicator(), classNames?.triggerIndicator)} />}
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
              <Calendar
                {...({
                  value: state.dateValue ?? undefined,
                  onValueChange: (v: DateValue | undefined) => v && state.setDateValue(v as any),
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
    </RACDatePicker>
  );

  return (
    <div data-slot="date-picker-root" {...rootDataAttrs}>
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
