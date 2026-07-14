import { useId, useMemo, type ReactNode } from "react";
import { DateField, DateInput as RACDateInput, DateSegment } from "react-aria-components";
import type { DateValue } from "@internationalized/date";
import { dateInputVariants, type DateInputVariants } from "@auronui/styles";
import { composeClassName, dataAttr, type ClassValue } from "../../utils";
import { useFieldFocusWithin, useFormField } from "../../hooks";
import { FieldLabel } from "../_shared/FieldLabel";
import { FormFieldHelper } from "../_shared/FormFieldHelper";

/**
 * DateInput — form-field mirror of Input.tsx for `@internationalized/date`
 * values.
 *
 * Ports @auronui/vue's DateInput.vue, which is built on reka-ui's
 * `DateFieldRoot`/`DateFieldInput` (itself a Vue port of React Stately's
 * date field state machine). This package already depends on
 * `react-aria-components` for `Calendar` (the direct upstream of that same
 * state machine), so — unlike the Vue port, which had to reimplement
 * segment/keyboard/locale logic from scratch — this component wraps RAC's
 * `DateField`/`DateInput`/`DateSegment` directly rather than reinventing
 * them, keeping only the Auron anatomy (label/helper/slots/data-attrs) on
 * top, same as Input.tsx.
 */

export interface DateInputOwnProps {
  variant?: DateInputVariants["variant"];
  size?: DateInputVariants["size"];
  color?: DateInputVariants["color"];
  labelPlacement?: DateInputVariants["labelPlacement"];
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
    endContent: ClassValue;
    helperWrapper: ClassValue;
    errorMessage: ClassValue;
    description: ClassValue;
  }>;

  value?: DateValue | null;
  defaultValue?: DateValue | null;
  placeholderValue?: DateValue;
  minValue?: DateValue;
  maxValue?: DateValue;
  granularity?: "day" | "hour" | "minute" | "second";
  hourCycle?: 12 | 24;
  locale?: string;
  name?: string;
  hideTimeZone?: boolean;
  isDateUnavailable?: (date: DateValue) => boolean;
  onChange?: (value: DateValue | null) => void;

  startContent?: ReactNode;
  endContent?: ReactNode;
  id?: string;
}

export type DateInputProps = DateInputOwnProps;

export function DateInput({
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
  granularity,
  hourCycle,
  locale,
  name,
  hideTimeZone = false,
  isDateUnavailable,
  onChange,
  startContent,
  endContent,
  id,
}: DateInputProps) {
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

  const slotFns = useMemo(
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

  return (
    <div className={composeClassName(slotFns.base(), className, classNames?.base)} {...rootDataAttrs}>
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
        <DateField
          id={fieldId}
          // Two independently-resolved copies of `@internationalized/date` exist in this
          // workspace (our own devDependency pin vs. the one react-aria/react-stately pull
          // in transitively), so their `DateValue` classes are nominally distinct even
          // though structurally identical. Bridged with a cast here, same as Calendar.tsx.
          {...({
            // Only pass `value` when truly controlled — coalescing an absent `value` to
            // `null` here would force RAC into controlled mode with a fixed empty value,
            // silently discarding `defaultValue` and any user segment edits.
            ...(value !== undefined ? { value: value ?? null } : { defaultValue }),
            placeholderValue,
            minValue,
            maxValue,
            isDateUnavailable,
            onChange: (v: DateValue | null) => onChange?.(v ?? null),
          } as any)}
          granularity={granularity}
          hourCycle={hourCycle}
          hideTimeZone={hideTimeZone}
          locale={locale}
          name={name}
          isDisabled={isDisabled}
          isReadOnly={isReadOnly}
          isRequired={isRequired}
          isInvalid={isInvalid}
          aria-labelledby={hasLabel ? labelId : undefined}
          aria-describedby={ariaDescribedBy}
          className={composeClassName(slotFns.inputWrapper(), classNames?.inputWrapper)}
          data-slot="date-input"
          data-focused={dataAttr(isFocused)}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          {({ state }) => (
            <>
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

              <RACDateInput
                className={composeClassName(slotFns.segmentList(), classNames?.segmentList)}
                data-slot="segment-list"
                data-filled={hasLabel ? (!!state.value || undefined) : undefined}
                data-disabled={dataAttr(isDisabled)}
              >
                {(segment) => (
                  <DateSegment
                    segment={segment}
                    className={composeClassName(slotFns.segment(), classNames?.segment)}
                    data-slot="segment"
                  />
                )}
              </RACDateInput>

              {endContent && (
                <span className={composeClassName(slotFns.endContent(), classNames?.endContent)} data-slot="end-content">
                  {endContent}
                </span>
              )}
            </>
          )}
        </DateField>

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
