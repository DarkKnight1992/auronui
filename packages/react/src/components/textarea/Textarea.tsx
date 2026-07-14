import {
  forwardRef,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { textAreaVariants, type TextAreaVariants } from "@auronui/styles";
import { composeClassName, dataAttr, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import { FieldLabel } from "../_shared/FieldLabel";
import { FormFieldHelper } from "../_shared/FormFieldHelper";
import { useFieldFocusWithin, useFormField } from "../../hooks";

/**
 * Textarea — multi-line form-field component for @auronui/react.
 *
 * Mirrors @auronui/vue's Textarea.vue prop surface, slot architecture, and
 * a11y contract. Textarea-specific additions: `rows` (initial visible
 * rows) and `autoResize` (grows height to fit content — the Vue version
 * wires @vueuse/core's `useTextareaAutosize`; since there's no React
 * equivalent in this package's hooks yet, this ports the same
 * scrollHeight-measuring technique inline via `useLayoutEffect`).
 */

export interface TextareaOwnProps {
  /** Visual style of the field. @default 'flat' */
  variant?: TextAreaVariants["variant"];
  /** Field size. @default 'md' */
  size?: TextAreaVariants["size"];
  /** Accent color applied to focus ring + floating label. @default 'default' */
  color?: TextAreaVariants["color"];
  /** Where the `label` is rendered relative to the field. @default 'inside' */
  labelPlacement?: TextAreaVariants["labelPlacement"];
  /** Stretches root wrapper to 100% width. @default false */
  fullWidth?: boolean;
  /** Marks the field as invalid. Enables `errorMessage`. @default false */
  isInvalid?: boolean;
  /** Disables the field. @default false */
  isDisabled?: boolean;
  /** Makes the field read-only. @default false */
  isReadOnly?: boolean;
  /** @deprecated Use isReadOnly instead. */
  isReadonly?: boolean;
  /** Adds a required asterisk next to the label and the `required` attribute. @default false */
  isRequired?: boolean;
  /** Shows an × button that clears the value and refocuses the field. @default false */
  isClearable?: boolean;
  /** Auto-grow the textarea height to fit content. @default false */
  autoResize?: boolean;
  /** Field label. When omitted, the floating-label behavior is skipped. */
  label?: string;
  /** Helper text displayed below the field. Suppressed when `isInvalid && errorMessage` is shown. */
  description?: string;
  /** Error text displayed below the field. Only rendered when `isInvalid` is also true. */
  errorMessage?: string;
  /** Extra classes merged onto the root wrapper via `composeClassName`. */
  className?: ClassValue;
  /** Per-slot class overrides. */
  classNames?: Partial<{
    base: ClassValue;
    label: ClassValue;
    mainWrapper: ClassValue;
    inputWrapper: ClassValue;
    startContent: ClassValue;
    input: ClassValue;
    endContent: ClassValue;
    clearButton: ClassValue;
    helperWrapper: ClassValue;
    errorMessage: ClassValue;
    description: ClassValue;
  }>;
  startContent?: ReactNode;
  endContent?: ReactNode;
  /** Fired when the user activates the clear (×) button. */
  onClear?: () => void;
}

export type TextareaProps = TextareaOwnProps &
  Omit<ComponentPropsWithoutRef<"textarea">, keyof TextareaOwnProps>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
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
    rows = 3,
    autoResize = false,
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resolvedIsReadOnly = resolveDeprecatedBooleanProp(
    "Textarea",
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

  const isInteractive = !isDisabled && !resolvedIsReadOnly;
  const showClearButton = isClearable && isFilled && isInteractive;

  useLayoutEffect(() => {
    if (!autoResize) return;
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [autoResize, currentValue]);

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    if (!isControlled) setUncontrolledValue(event.target.value);
    onChange?.(event);
  }

  function handleClear() {
    const el = textareaRef.current;
    if (isControlled) {
      if (el) {
        const nativeSetter = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          "value",
        )?.set;
        nativeSetter?.call(el, "");
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }
    } else {
      // Uncontrolled: React only applies `defaultValue` on mount, so state
      // alone won't clear the rendered DOM value — mutate it directly too.
      if (el) el.value = "";
      setUncontrolledValue("");
    }
    onClear?.();
    requestAnimationFrame(() => textareaRef.current?.focus());
  }

  const slotFns = useMemo(
    () =>
      textAreaVariants({
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
          <textarea
            {...rest}
            id={inputId}
            ref={(node) => {
              textareaRef.current = node;
              if (typeof forwardedRef === "function") forwardedRef(node);
              else if (forwardedRef) forwardedRef.current = node;
            }}
            rows={rows}
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
              aria-label="Clear textarea"
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
