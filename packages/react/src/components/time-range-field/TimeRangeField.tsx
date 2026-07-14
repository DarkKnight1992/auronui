import { useId, useMemo, useRef, type ReactNode } from "react";
import { TimeField as RACTimeField, DateInput as RACDateInput, DateSegment } from "react-aria-components";
import type { Time } from "@internationalized/date";
import { timeRangeFieldVariants, type TimeRangeFieldVariants } from "@auronui/styles";
import { composeClassName, dataAttr, type ClassValue } from "../../utils";
import { useFieldFocusWithin, useFormField } from "../../hooks";
import { FieldLabel } from "../_shared/FieldLabel";
import { FormFieldHelper } from "../_shared/FormFieldHelper";

export interface TimeRange {
  start: Time;
  end: Time;
}

/**
 * TimeRangeField — form-field mirror of TimeRangeField.vue for a time
 * range. Same "two independent RAC fields, no calendar" composition as
 * DateRangeField.tsx.
 */

export interface TimeRangeFieldOwnProps {
  variant?: TimeRangeFieldVariants["variant"];
  size?: TimeRangeFieldVariants["size"];
  color?: TimeRangeFieldVariants["color"];
  labelPlacement?: TimeRangeFieldVariants["labelPlacement"];
  fullWidth?: boolean;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  label?: string;
  description?: string;
  errorMessage?: string;
  className?: ClassValue;
  classNames?: Partial<{
    base: ClassValue;
    label: ClassValue;
    mainWrapper: ClassValue;
    inputWrapper: ClassValue;
    startContent: ClassValue;
    segmentList: ClassValue;
    segment: ClassValue;
    separator: ClassValue;
    endContent: ClassValue;
    helperWrapper: ClassValue;
    errorMessage: ClassValue;
    description: ClassValue;
  }>;

  value?: TimeRange | null;
  defaultValue?: TimeRange;
  placeholderValue?: Time;
  minValue?: Time;
  maxValue?: Time;
  granularity?: "hour" | "minute" | "second";
  hourCycle?: 12 | 24;
  locale?: string;
  name?: string;
  hideTimeZone?: boolean;
  onChange?: (value: TimeRange | null) => void;

  startContent?: ReactNode;
  endContent?: ReactNode;
  id?: string;
}

export type TimeRangeFieldProps = TimeRangeFieldOwnProps;

export function TimeRangeField({
  variant = "flat",
  size = "md",
  color = "default",
  labelPlacement = "inside",
  fullWidth = false,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  label,
  description,
  errorMessage,
  className,
  classNames,
  value,
  defaultValue,
  placeholderValue,
  minValue,
  maxValue,
  granularity = "minute",
  hourCycle,
  locale,
  name,
  hideTimeZone = false,
  onChange,
  startContent,
  endContent,
  id,
}: TimeRangeFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? `${generatedId}-field`;
  const labelId = `${generatedId}-label`;
  const { isFocused, onFocus, onBlur } = useFieldFocusWithin();

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

  const startRef = useRef<Time | null>(value?.start ?? defaultValue?.start ?? null);
  const endRef = useRef<Time | null>(value?.end ?? defaultValue?.end ?? null);
  function emitIfComplete() {
    if (startRef.current && endRef.current) onChange?.({ start: startRef.current, end: endRef.current });
  }

  const slotFns = useMemo(
    () =>
      timeRangeFieldVariants({
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

  return (
    <div className={composeClassName(slotFns.base(), className, classNames?.base)} {...rootDataAttrs} data-slot="time-range-field">
      {showOutsideLabel && (
        <FieldLabel
          id={labelId}
          htmlFor={fieldId}
          label={label}
          isRequired={isRequired}
          className={composeClassName(slotFns.label(), classNames?.label)}
        />
      )}

      <div className={composeClassName(slotFns.mainWrapper(), classNames?.mainWrapper)}>
        <div
          id={fieldId}
          className={composeClassName(slotFns.inputWrapper(), classNames?.inputWrapper)}
          data-slot="time-range-field-input"
          data-invalid={dataAttr(isInvalid)}
          data-disabled={dataAttr(isDisabled)}
          data-readonly={dataAttr(isReadOnly)}
          data-focused={dataAttr(isFocused)}
          onFocus={onFocus}
          onBlur={onBlur}
          role="group"
          aria-labelledby={hasLabel ? labelId : undefined}
          aria-describedby={ariaDescribedBy}
          aria-required={isRequired || undefined}
          aria-invalid={isInvalid || undefined}
        >
          {showInsideLabel && (
            <FieldLabel
              id={labelId}
              htmlFor={fieldId}
              label={label}
              isRequired={isRequired}
              className={composeClassName(slotFns.label(), classNames?.label)}
            />
          )}

          {startContent && (
            <span className={composeClassName(slotFns.startContent(), classNames?.startContent)} data-slot="start-content">
              {startContent}
            </span>
          )}

          <RACTimeField
            aria-label="Start time"
            // See DateInput.tsx: bridges the two independently-resolved
            // `@internationalized/date` package instances in this workspace.
            {...({
              // See DateInput.tsx: only pass `value` when truly controlled.
              ...(value !== undefined ? { value: value?.start ?? null } : { defaultValue: defaultValue?.start }),
              placeholderValue,
              minValue,
              maxValue,
              onChange: (v: Time | null) => {
                startRef.current = v ?? null;
                emitIfComplete();
              },
            } as any)}
            granularity={granularity}
            hourCycle={hourCycle}
            hideTimeZone={hideTimeZone}
            locale={locale}
            name={name ? `${name}.start` : undefined}
            isDisabled={isDisabled}
            isReadOnly={isReadOnly}
            isInvalid={isInvalid}
          >
            <RACDateInput
              className={composeClassName(slotFns.segmentList(), classNames?.segmentList)}
              data-slot="segment-list"
              data-type="start"
            >
              {(segment) => (
                <DateSegment segment={segment} className={composeClassName(slotFns.segment(), classNames?.segment)} data-slot="segment" />
              )}
            </RACDateInput>
          </RACTimeField>

          <span className={composeClassName(slotFns.separator(), classNames?.separator)} aria-hidden="true" data-slot="separator">
            –
          </span>

          <RACTimeField
            aria-label="End time"
            {...({
              // See DateInput.tsx: only pass `value` when truly controlled.
              ...(value !== undefined ? { value: value?.end ?? null } : { defaultValue: defaultValue?.end }),
              placeholderValue,
              minValue,
              maxValue,
              onChange: (v: Time | null) => {
                endRef.current = v ?? null;
                emitIfComplete();
              },
            } as any)}
            granularity={granularity}
            hourCycle={hourCycle}
            hideTimeZone={hideTimeZone}
            locale={locale}
            name={name ? `${name}.end` : undefined}
            isDisabled={isDisabled}
            isReadOnly={isReadOnly}
            isInvalid={isInvalid}
          >
            <RACDateInput
              className={composeClassName(slotFns.segmentList(), classNames?.segmentList)}
              data-slot="segment-list"
              data-type="end"
            >
              {(segment) => (
                <DateSegment segment={segment} className={composeClassName(slotFns.segment(), classNames?.segment)} data-slot="segment" />
              )}
            </RACDateInput>
          </RACTimeField>

          {endContent && (
            <span className={composeClassName(slotFns.endContent(), classNames?.endContent)} data-slot="end-content">
              {endContent}
            </span>
          )}
        </div>

        <FormFieldHelper
          hasHelper={hasHelper}
          showError={showError}
          showDescription={showDescription}
          errorMessage={errorMessage}
          description={description}
          errorMessageId={errorMessageId}
          descriptionId={descriptionId}
          errorRole="alert"
          wrapperClassName={composeClassName(slotFns.helperWrapper(), classNames?.helperWrapper)}
          errorClassName={composeClassName(slotFns.errorMessage(), classNames?.errorMessage)}
          descriptionClassName={composeClassName(slotFns.description(), classNames?.description)}
        />
      </div>
    </div>
  );
}
