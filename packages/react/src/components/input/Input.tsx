import {
  forwardRef,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { inputVariants, type InputVariants } from "@auronui/styles";
import { composeClassName, dataAttr, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import { FieldLabel } from "../_shared/FieldLabel";
import { FormFieldHelper } from "../_shared/FormFieldHelper";
import { useFieldFocusWithin, useFormField } from "../../hooks";

/**
 * Input — reference form-field component for @auronui/react.
 *
 * Mirrors @auronui/vue's Input.vue anatomy, prop surface, slot layout,
 * data-attribute contract, CSS selector pairing, and a11y wiring. See
 * that file's header comment for the full anatomy diagram — this is the
 * canonical template for every ported field (Textarea, SearchField, …).
 */

export interface InputOwnProps {
  /** Visual style of the field. @default 'flat' */
  variant?: InputVariants["variant"];
  /** Field height. @default 'md' */
  size?: InputVariants["size"];
  /** Accent color applied to focus ring + floating label. @default 'default' */
  color?: InputVariants["color"];
  /**
   * Where the `label` is rendered relative to the field.
   * - `inside`: floats above the input (shrinks when focused/filled)
   * - `outside`: sits above the field, static
   * - `outside-left`: sits to the left, horizontal layout
   * @default 'inside'
   */
  labelPlacement?: InputVariants["labelPlacement"];
  /** Stretches root wrapper to 100% width. @default false */
  fullWidth?: boolean;
  /** Marks the field as invalid. Triggers danger styling and enables `errorMessage`. @default false */
  isInvalid?: boolean;
  /** Disables the field. @default false */
  isDisabled?: boolean;
  /** Makes the field read-only. @default false */
  isReadOnly?: boolean;
  /** @deprecated Use isReadOnly instead. */
  isReadonly?: boolean;
  /** Adds a required asterisk next to the label and the `required` attribute on the input. @default false */
  isRequired?: boolean;
  /** Shows an × button that clears the value and refocuses the input when value is non-empty. @default false */
  isClearable?: boolean;
  /** Shows a show/hide eye button. Only active when `type === 'password'`. @default false */
  showPasswordToggle?: boolean;
  /** Field label. When omitted, the floating-label behavior is skipped. */
  label?: string;
  /** Helper text displayed below the field. Suppressed when `isInvalid && errorMessage` is shown. */
  description?: string;
  /** Error text displayed below the field. Only rendered when `isInvalid` is also true. Takes precedence over `description`. */
  errorMessage?: string;
  /** Extra classes merged onto the root wrapper via `composeClassName`. */
  className?: ClassValue;
  /**
   * Per-slot class overrides. Available slots: `base`, `mainWrapper`,
   * `inputWrapper`, `input`, `label`, `startContent`, `endContent`,
   * `clearButton`, `passwordToggle`, `helperWrapper`, `description`,
   * `errorMessage`.
   */
  classNames?: Partial<{
    base: ClassValue;
    mainWrapper: ClassValue;
    inputWrapper: ClassValue;
    input: ClassValue;
    label: ClassValue;
    startContent: ClassValue;
    endContent: ClassValue;
    clearButton: ClassValue;
    passwordToggle: ClassValue;
    helperWrapper: ClassValue;
    description: ClassValue;
    errorMessage: ClassValue;
  }>;
  startContent?: ReactNode;
  endContent?: ReactNode;
  /**
   * Fired when the user activates the clear (×) button. At the time this
   * fires the value is already cleared and focus has been returned to the
   * input element.
   */
  onClear?: () => void;
}

export type InputProps = InputOwnProps &
  Omit<ComponentPropsWithoutRef<"input">, keyof InputOwnProps | "size">;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    variant = "flat",
    size = "md",
    color = "default",
    labelPlacement = "inside",
    fullWidth = false,
    isInvalid = false,
    isDisabled = false,
    isReadOnly,
    isReadonly,
    isRequired = false,
    isClearable = false,
    showPasswordToggle = false,
    type = "text",
    id,
    placeholder,
    name,
    label,
    description,
    errorMessage,
    className,
    classNames,
    startContent,
    endContent,
    value,
    defaultValue,
    onChange,
    onClear,
    ...rest
  },
  forwardedRef,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);

  const resolvedIsReadOnly = resolveDeprecatedBooleanProp(
    "Input",
    "isReadOnly",
    isReadOnly,
    "isReadonly",
    isReadonly,
  );

  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? "");
  const currentValue = isControlled ? value : uncontrolledValue;
  const isFilled = currentValue !== null && currentValue !== undefined && String(currentValue) !== "";
  const { isFocused, onFocus: onWrapperFocus, onBlur: onWrapperBlur } = useFieldFocusWithin();

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
    fieldId: inputId,
    label,
    description,
    errorMessage,
    isInvalid,
    isDisabled,
    isReadOnly: resolvedIsReadOnly,
    isRequired,
    labelPlacement,
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordField = type === "password";
  const effectiveType = isPasswordField && isPasswordVisible ? "text" : type;

  const isInteractive = !isDisabled && !resolvedIsReadOnly;
  const showClearButton = isClearable && isFilled && isInteractive;
  const showPasswordToggleButton = showPasswordToggle && isPasswordField && isInteractive;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (!isControlled) setUncontrolledValue(event.target.value);
    onChange?.(event);
  }

  function handleClear() {
    const input = inputRef.current;
    if (isControlled) {
      // Controlled consumers own the value; simulate a native change event
      // carrying an empty string so their onChange handler can clear it.
      if (input) {
        const nativeSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;
        nativeSetter?.call(input, "");
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    } else {
      // Uncontrolled: React only applies `defaultValue` on mount, so state
      // alone won't clear the rendered DOM value — mutate it directly too.
      if (input) input.value = "";
      setUncontrolledValue("");
    }
    onClear?.();
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function togglePasswordVisibility() {
    setIsPasswordVisible((v) => !v);
  }

  const slotFns = useMemo(
    () =>
      inputVariants({
        variant,
        size,
        color,
        fullWidth,
        isInvalid,
        isDisabled,
        isReadonly: resolvedIsReadOnly,
        hasLabel,
        labelPlacement,
      }),
    [variant, size, color, fullWidth, isInvalid, isDisabled, resolvedIsReadOnly, hasLabel, labelPlacement],
  );

  return (
    <div className={composeClassName(slotFns.base(), className, classNames?.base)} {...rootDataAttrs}>
      {showOutsideLabel && (
        <FieldLabel
          htmlFor={inputId}
          label={label}
          isRequired={isRequired}
          className={composeClassName(slotFns.label(), classNames?.label)}
        />
      )}

      <div className={composeClassName(slotFns.mainWrapper(), classNames?.mainWrapper)}>
        <div
          className={composeClassName(slotFns.inputWrapper(), classNames?.inputWrapper)}
          data-filled={hasLabel ? isFilled || undefined : undefined}
          data-focused={dataAttr(isFocused)}
          onFocus={onWrapperFocus}
          onBlur={onWrapperBlur}
        >
          {showInsideLabel && (
            <FieldLabel
              htmlFor={inputId}
              label={label}
              isRequired={isRequired}
              className={composeClassName(slotFns.label(), classNames?.label)}
            />
          )}
          {startContent && (
            <span className={composeClassName(slotFns.startContent(), classNames?.startContent)}>
              {startContent}
            </span>
          )}
          <input
            {...rest}
            id={inputId}
            ref={(node) => {
              inputRef.current = node;
              if (typeof forwardedRef === "function") forwardedRef(node);
              else if (forwardedRef) forwardedRef.current = node;
            }}
            type={effectiveType}
            placeholder={placeholder}
            name={name}
            disabled={isDisabled || undefined}
            readOnly={resolvedIsReadOnly || undefined}
            required={isRequired || undefined}
            aria-invalid={isInvalid || undefined}
            aria-describedby={ariaDescribedBy}
            value={isControlled ? (value ?? "") : undefined}
            defaultValue={isControlled ? undefined : defaultValue}
            onChange={handleChange}
            className={composeClassName(slotFns.input(), classNames?.input)}
          />
          {endContent && (
            <span className={composeClassName(slotFns.endContent(), classNames?.endContent)}>
              {endContent}
            </span>
          )}
          {showClearButton && (
            <button
              type="button"
              tabIndex={-1}
              className={composeClassName(slotFns.clearButton(), classNames?.clearButton)}
              aria-label="Clear input"
              onClick={handleClear}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </button>
          )}
          {showPasswordToggleButton && (
            <button
              type="button"
              className={composeClassName(slotFns.passwordToggle(), classNames?.passwordToggle)}
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
              aria-pressed={isPasswordVisible}
              onClick={togglePasswordVisibility}
            >
              {isPasswordVisible ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
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
          wrapperClassName={composeClassName(slotFns.helperWrapper(), classNames?.helperWrapper)}
          errorClassName={composeClassName(slotFns.errorMessage(), classNames?.errorMessage)}
          descriptionClassName={composeClassName(slotFns.description(), classNames?.description)}
        />
      </div>
    </div>
  );
});
