import { forwardRef, useId, useMemo, useRef, type ComponentPropsWithoutRef } from "react";
import { useButton, useNumberField } from "react-aria";
import { useNumberFieldState } from "react-stately";
import { numberFieldVariants, type NumberFieldVariants } from "@auronui/styles";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";

/**
 * NumberField — numeric stepper input.
 *
 * @auronui/vue's NumberField.vue is built on reka-ui's NumberFieldRoot /
 * NumberFieldInput / NumberFieldIncrement / NumberFieldDecrement, a thin
 * wrapper around exactly the same state machine React Aria ships as
 * `useNumberFieldState` (react-stately) + `useNumberField` (react-aria) —
 * both already peer dependencies of this package, so this port calls them
 * directly instead of introducing react-aria-components' higher-level
 * `<NumberField>` (which has no dedicated increment/decrement button
 * components, unlike reka-ui — using the low-level hooks keeps this a
 * 1:1 structural port of the Vue anatomy: root/group/input/inc/dec).
 */

export interface NumberFieldOwnProps {
  variant?: NumberFieldVariants["variant"];
  size?: NumberFieldVariants["size"];
  color?: NumberFieldVariants["color"];
  fullWidth?: boolean;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  /** @deprecated Use isReadOnly instead. */
  isReadonly?: boolean;
  min?: number;
  max?: number;
  step?: number;
  formatOptions?: Intl.NumberFormatOptions;
  locale?: string;
  name?: string;
  id?: string;
  placeholder?: string;
  label?: string;
  /** Helper text under the field. Hidden while an error message is shown. */
  description?: string;
  /** Error text under the field, shown while `isInvalid`. */
  errorMessage?: string;
  ariaLabel?: string;
  /** Controlled value. */
  value?: number;
  /** Default value when uncontrolled. */
  defaultValue?: number;
  /** Fired when the value changes (both controlled and uncontrolled). */
  onChange?: (value: number) => void;
  isRequired?: boolean;
  /** @deprecated Use isRequired instead. */
  required?: boolean;
  className?: ClassValue;
  /** Per-slot classNames override object for custom styling */
  classNames?: Partial<{
    base: ClassValue;
    group: ClassValue;
    decrementButton: ClassValue;
    input: ClassValue;
    incrementButton: ClassValue;
    description: ClassValue;
    errorMessage: ClassValue;
  }>;
}

export type NumberFieldProps = NumberFieldOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof NumberFieldOwnProps | "onChange" | "color">;

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(function NumberField(
  {
    variant = "flat",
    size = "md",
    color = "default",
    fullWidth = false,
    isInvalid = false,
    isDisabled = false,
    isReadOnly,
    isReadonly,
    min,
    max,
    step = 1,
    formatOptions,
    locale = "en-US",
    name,
    id,
    placeholder,
    label,
    description,
    errorMessage,
    ariaLabel,
    value,
    defaultValue,
    onChange,
    isRequired,
    required,
    className,
    classNames,
    ...rest
  },
  forwardedRef,
) {
  const resolvedIsReadOnly = resolveDeprecatedBooleanProp(
    "NumberField",
    "isReadOnly",
    isReadOnly,
    "isReadonly",
    isReadonly,
  );
  const resolvedIsRequired = resolveDeprecatedBooleanProp(
    "NumberField",
    "isRequired",
    isRequired,
    "required",
    required,
  );

  const generatedInputId = useId();
  const resolvedInputId = id ?? generatedInputId;

  const hasLabel = !!(label || ariaLabel);
  const isLabelVisible = !!label;

  const inputRef = useRef<HTMLInputElement>(null);
  const incrementRef = useRef<HTMLButtonElement>(null);
  const decrementRef = useRef<HTMLButtonElement>(null);

  const state = useNumberFieldState({
    locale,
    value,
    defaultValue,
    onChange,
    minValue: min,
    maxValue: max,
    step,
    formatOptions,
    isDisabled,
    isReadOnly: resolvedIsReadOnly,
    isRequired: resolvedIsRequired,
  });

  const showError = isInvalid && !!errorMessage;
  const showDescription = !showError && !!description;

  const { groupProps, inputProps, incrementButtonProps, decrementButtonProps, descriptionProps, errorMessageProps } = useNumberField(
    {
      "aria-label": ariaLabel,
      "aria-labelledby": isLabelVisible ? resolvedInputId + "-label" : undefined,
      id: resolvedInputId,
      placeholder,
      description: showDescription ? description : undefined,
      errorMessage: showError ? errorMessage : undefined,
      isInvalid,
      isDisabled,
      isReadOnly: resolvedIsReadOnly,
      isRequired: resolvedIsRequired,
      minValue: min,
      maxValue: max,
      step,
      formatOptions,
    },
    state,
    inputRef,
  );

  const { buttonProps: incrementProps } = useButton(incrementButtonProps, incrementRef);
  const { buttonProps: decrementProps } = useButton(decrementButtonProps, decrementRef);

  const slotFns = useMemo(
    () =>
      numberFieldVariants({
        variant,
        size,
        color,
        fullWidth,
        isInvalid,
        isDisabled,
        isReadonly: resolvedIsReadOnly,
      }),
    [variant, size, color, fullWidth, isInvalid, isDisabled, resolvedIsReadOnly],
  );

  return (
    <div
      {...rest}
      className={composeClassName(slotFns.base(), className, classNames?.base)}
      data-invalid={isInvalid || undefined}
      data-disabled={isDisabled || undefined}
      data-readonly={resolvedIsReadOnly || undefined}
    >
      {hasLabel && (
        <label
          id={resolvedInputId + "-label"}
          htmlFor={resolvedInputId}
          className={isLabelVisible ? undefined : "sr-only"}
          data-slot="label"
        >
          {label || ariaLabel}
        </label>
      )}

      <div {...groupProps} className={composeClassName(slotFns.group(), classNames?.group)} data-slot="group">
        <button
          {...decrementProps}
          ref={decrementRef}
          className={composeClassName(slotFns.decrementButton(), classNames?.decrementButton)}
        >
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            data-slot="number-field-decrement-button-icon"
          >
            <path d="M5 12h14" />
          </svg>
        </button>

        <input
          {...inputProps}
          name={name}
          ref={(node) => {
            inputRef.current = node;
            if (typeof forwardedRef === "function") forwardedRef(node);
            else if (forwardedRef) forwardedRef.current = node;
          }}
          className={composeClassName(slotFns.input(), classNames?.input)}
        />

        <button
          {...incrementProps}
          ref={incrementRef}
          className={composeClassName(slotFns.incrementButton(), classNames?.incrementButton)}
        >
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            data-slot="number-field-increment-button-icon"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </button>
      </div>

      {showError ? (
        <span
          {...errorMessageProps}
          data-slot="error-message"
          className={composeClassName(slotFns.errorMessage(), classNames?.errorMessage)}
        >
          {errorMessage}
        </span>
      ) : showDescription ? (
        <span
          {...descriptionProps}
          data-slot="description"
          className={composeClassName(slotFns.description(), classNames?.description)}
        >
          {description}
        </span>
      ) : null}
    </div>
  );
});
