import {
  forwardRef,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { inputVariants, type InputVariants } from "@auronui/styles";
import { composeClassName, dataAttr, type ClassValue } from "../../utils";
import { FieldLabel } from "../_shared/FieldLabel";
import { FormFieldHelper } from "../_shared/FormFieldHelper";
import { useFieldFocusWithin, useFormField } from "../../hooks";

/**
 * SearchField — dedicated search/filter input. Mirrors Input's anatomy,
 * prop surface, a11y contract, and CSS classes (reuses `.input`/`.input__*`
 * wholesale — no new stylesheet) but specializes it for search: fixed
 * type="search", a built-in magnifying-glass icon (overridable via
 * `startContent`), and a clear button that's on by default and also
 * responds to Escape.
 *
 * See Input.tsx's header comment for the full anatomy/a11y contract this
 * mirrors. Differences from Input:
 *   - type is fixed to "search", not a prop.
 *   - isClearable defaults to true (Input defaults to false).
 *   - Escape clears the field (in addition to the visible × button).
 *   - No password toggle (not applicable to a search field).
 */

const DefaultSearchIcon = (
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
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export interface SearchFieldOwnProps {
  /** Visual style of the field. @default 'flat' */
  variant?: InputVariants["variant"];
  /** Field height. @default 'md' */
  size?: InputVariants["size"];
  /** Accent color applied to focus ring + floating label. @default 'default' */
  color?: InputVariants["color"];
  /** Where the `label` is rendered relative to the field. @default 'inside' */
  labelPlacement?: InputVariants["labelPlacement"];
  /** Stretches root wrapper to 100% width. @default false */
  fullWidth?: boolean;
  /** Marks the field as invalid. Triggers danger styling and enables `errorMessage`. @default false */
  isInvalid?: boolean;
  /** Disables the field. @default false */
  isDisabled?: boolean;
  /** Makes the field read-only. @default false */
  isReadOnly?: boolean;
  /** Adds a required asterisk next to the label and the `required` attribute on the input. @default false */
  isRequired?: boolean;
  /** Shows the × clear button once the value is non-empty. @default true */
  isClearable?: boolean;
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
   * `clearButton`, `helperWrapper`, `description`, `errorMessage`.
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
    helperWrapper: ClassValue;
    description: ClassValue;
    errorMessage: ClassValue;
  }>;
  /** Overrides the built-in magnifying-glass icon. */
  startContent?: ReactNode;
  endContent?: ReactNode;
  /** Fired when the value is cleared, via the × button or Escape. */
  onClear?: () => void;
}

export type SearchFieldProps = SearchFieldOwnProps &
  Omit<ComponentPropsWithoutRef<"input">, keyof SearchFieldOwnProps | "type" | "size">;

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  {
    variant = "flat",
    size = "md",
    color = "default",
    labelPlacement = "inside",
    fullWidth = false,
    isInvalid = false,
    isDisabled = false,
    isReadOnly = false,
    isRequired = false,
    isClearable = true,
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
    onKeyDown,
    onClear,
    ...rest
  },
  forwardedRef,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? "");
  const currentValue = isControlled ? value : uncontrolledValue;
  const isFilled = String(currentValue ?? "") !== "";
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
    isReadOnly,
    isRequired,
    labelPlacement,
  });

  const isInteractive = !isDisabled && !isReadOnly;
  const showClearButton = isClearable && isFilled && isInteractive;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (!isControlled) setUncontrolledValue(event.target.value);
    onChange?.(event);
  }

  function handleClear() {
    const input = inputRef.current;
    if (isControlled) {
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

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape" && showClearButton) {
      event.stopPropagation();
      handleClear();
    }
    onKeyDown?.(event);
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
          <span className={composeClassName(slotFns.startContent(), classNames?.startContent)}>
            {startContent ?? DefaultSearchIcon}
          </span>
          <input
            {...rest}
            id={inputId}
            ref={(node) => {
              inputRef.current = node;
              if (typeof forwardedRef === "function") forwardedRef(node);
              else if (forwardedRef) forwardedRef.current = node;
            }}
            type="search"
            placeholder={placeholder}
            name={name}
            disabled={isDisabled || undefined}
            readOnly={isReadOnly || undefined}
            required={isRequired || undefined}
            aria-invalid={isInvalid || undefined}
            aria-describedby={ariaDescribedBy}
            value={isControlled ? (value ?? "") : undefined}
            defaultValue={isControlled ? undefined : defaultValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
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
              aria-label="Clear search"
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
