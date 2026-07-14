import { useId, useLayoutEffect, useMemo, useRef, type ReactNode } from "react";
import { TimeField as RACTimeField, DateInput as RACDateInput, DateSegment } from "react-aria-components";
import type { Time } from "@internationalized/date";
import { timeFieldVariants, type TimeFieldVariants } from "@auronui/styles";
import { composeClassName, dataAttr, type ClassValue } from "../../utils";
import { useFieldFocusWithin, useFormField } from "../../hooks";
import { FieldLabel } from "../_shared/FieldLabel";
import { FormFieldHelper } from "../_shared/FormFieldHelper";

/**
 * Writes `data-filled="true"` onto the field root (the same element that
 * already carries `.time-field--label-inside` and `data-focused`) so
 * time-field.css's floating-label up-state — gated on the compound selector
 * `.time-field--label-inside[data-filled="true"]` (both on the SAME element)
 * — actually matches. `state.value` is only available inside RACTimeField's
 * render-prop children function, which runs after the root element itself
 * has already been created, so it can't be set as a plain prop there; this
 * bridges it onto the root via ref instead. Previously `data-filled` was set
 * on the inner segment-list element instead of the root, so the compound
 * selector never matched and the label always looked "unfilled" — collapsing
 * back down (losing its floated-up state) the moment the field blurred, even
 * with a value present.
 */
function TimeFieldStateAttrs({
  elementRef,
  isFilled,
}: {
  elementRef: React.RefObject<HTMLElement | null>;
  isFilled: boolean;
}) {
  useLayoutEffect(() => {
    if (isFilled) elementRef.current?.setAttribute("data-filled", "true");
    else elementRef.current?.removeAttribute("data-filled");
  });
  return null;
}

/**
 * TimeField — form-field mirror of Input.tsx for `@internationalized/date`
 * `Time` values. Ports @auronui/vue's TimeField.vue (reka-ui's
 * `TimeFieldRoot`/`TimeFieldInput`) onto RAC's `TimeField` +
 * `DateInput`/`DateSegment` (RAC reuses the same segment renderer for both
 * date and time fields), same approach as DateInput.tsx.
 */

export interface TimeFieldOwnProps {
  variant?: TimeFieldVariants["variant"];
  size?: TimeFieldVariants["size"];
  color?: TimeFieldVariants["color"];
  labelPlacement?: TimeFieldVariants["labelPlacement"];
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

  value?: Time | null;
  defaultValue?: Time | null;
  placeholderValue?: Time;
  minValue?: Time;
  maxValue?: Time;
  granularity?: "hour" | "minute" | "second";
  hourCycle?: 12 | 24;
  locale?: string;
  name?: string;
  hideTimeZone?: boolean;
  onChange?: (value: Time | null) => void;

  startContent?: ReactNode;
  endContent?: ReactNode;
  id?: string;
}

export type TimeFieldProps = TimeFieldOwnProps;

export function TimeField({
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
}: TimeFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? `${generatedId}-field`;
  const labelId = `${generatedId}-label`;
  const { isFocused, onFocus, onBlur } = useFieldFocusWithin();
  const fieldRef = useRef<HTMLDivElement | null>(null);

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
      timeFieldVariants({
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
        <RACTimeField
          ref={fieldRef}
          id={fieldId}
          // See DateInput.tsx: bridges the two independently-resolved
          // `@internationalized/date` package instances in this workspace.
          {...({
            // See DateInput.tsx: only pass `value` when truly controlled.
            ...(value !== undefined ? { value: value ?? null } : { defaultValue }),
            placeholderValue,
            minValue,
            maxValue,
            onChange: (v: Time | null) => onChange?.(v ?? null),
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
          data-slot="time-field"
          data-focused={dataAttr(isFocused)}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          {({ state }) => (
            <>
              <TimeFieldStateAttrs elementRef={fieldRef} isFilled={hasLabel && !!state.value} />
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
        </RACTimeField>

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
