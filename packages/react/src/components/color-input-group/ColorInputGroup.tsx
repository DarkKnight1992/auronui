import { forwardRef, useEffect, useId, useRef, useState, type ChangeEvent, type FocusEvent } from "react";
import { colorInputGroupVariants, type ColorInputGroupVariants } from "@auronui/styles";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import { parseColor } from "react-stately";
import { useColorState, type Color } from "../../hooks";
import { ColorSwatch } from "../color-swatch";
import { useColorPickerContext } from "../color-picker/color-picker.context";

export interface ColorInputGroupOwnProps {
  value?: Color | string;
  defaultValue?: Color | string;
  label?: string;
  description?: string;
  errorMessage?: string;
  placeholder?: string;
  suffixLabel?: string;
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  isReadOnly?: boolean;
  /** @deprecated Use isReadOnly instead. */
  readonly?: boolean;
  fullWidth?: ColorInputGroupVariants["fullWidth"];
  variant?: ColorInputGroupVariants["variant"];
  className?: ClassValue;
  name?: string;
  isRequired?: boolean;
  /** @deprecated Use isRequired instead. */
  required?: boolean;
  classNames?: Partial<{
    wrapper: ClassValue;
    label: ClassValue;
    description: ClassValue;
    errorMessage: ClassValue;
  }>;
  onChange?: (color: Color) => void;
}

export type ColorInputGroupProps = ColorInputGroupOwnProps;

/**
 * ColorInputGroup — a swatch + hex text field, combined into one field-styled
 * unit. Mirrors the Vue source exactly: it does NOT open a popover (that
 * composition — swatch trigger opening a full ColorPicker — is left to
 * ColorPicker's own consumers; ColorInputGroup itself is just a styled row).
 */
export const ColorInputGroup = forwardRef<HTMLInputElement, ColorInputGroupProps>(function ColorInputGroup(
  {
    value,
    defaultValue,
    label,
    description,
    errorMessage,
    placeholder,
    suffixLabel = "HEX",
    isDisabled,
    disabled,
    isReadOnly,
    readonly,
    fullWidth = false,
    variant = "primary",
    className,
    name,
    isRequired,
    required,
    classNames,
    onChange,
  },
  forwardedRef,
) {
  const resolvedDisabled = resolveDeprecatedBooleanProp("ColorInputGroup", "isDisabled", isDisabled, "disabled", disabled);
  const resolvedReadOnly = resolveDeprecatedBooleanProp("ColorInputGroup", "isReadOnly", isReadOnly, "readonly", readonly);
  const resolvedRequired = resolveDeprecatedBooleanProp("ColorInputGroup", "isRequired", isRequired, "required", required);

  const id = useId();

  const pickerCtx = useColorPickerContext();
  const local = useColorState(pickerCtx ? {} : { value, defaultValue });
  const color = pickerCtx ? pickerCtx.color : local.color;

  const styles = colorInputGroupVariants({ fullWidth, variant });

  const [text, setText] = useState(() => color.toString("hex"));
  const isFocusedRef = useRef(false);

  // See ColorField.tsx's identical effect for why this skips while focused.
  useEffect(() => {
    if (isFocusedRef.current) return;
    setText(color.toString("hex"));
     
  }, [color]);

  function applyColor(next: Color) {
    if (pickerCtx) {
      pickerCtx.setChannels([
        { channel: "red", value: next.getChannelValue("red") },
        { channel: "green", value: next.getChannelValue("green") },
        { channel: "blue", value: next.getChannelValue("blue") },
        { channel: "alpha", value: next.getChannelValue("alpha") },
      ]);
    } else {
      local.setColor(next);
    }
    onChange?.(next);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const raw = event.target.value;
    setText(raw);
    try {
      applyColor(parseColor(raw));
    } catch {
      // Invalid/in-progress input — keep the raw text, don't propagate.
    }
  }

  function handleFocus(): void {
    isFocusedRef.current = true;
  }

  function handleBlur(_event: FocusEvent<HTMLInputElement>) {
    isFocusedRef.current = false;
    try {
      parseColor(text);
    } catch {
      setText(color.toString("hex"));
    }
  }

  return (
    <div className={composeClassName(styles.wrapper(), classNames?.wrapper)}>
      {label && (
        <label htmlFor={id} className={composeClassName(styles.label(), classNames?.label)}>
          {label}
        </label>
      )}
      <div className={composeClassName(styles.base(), className)} data-invalid={errorMessage ? "true" : undefined}>
        <span data-slot="color-input-group-prefix" className={styles.prefix()} aria-hidden="true">
          <ColorSwatch color={color} size="sm" />
        </span>
        <input
          ref={forwardedRef}
          id={id}
          data-slot="color-input-group-input"
          type="text"
          name={name}
          placeholder={placeholder}
          value={text}
          disabled={resolvedDisabled || undefined}
          readOnly={resolvedReadOnly || undefined}
          required={resolvedRequired || undefined}
          aria-label={label ? undefined : "Color value"}
          aria-invalid={errorMessage ? true : undefined}
          className={styles.input()}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {suffixLabel && (
          <span data-slot="color-input-group-suffix" className={styles.suffix()}>
            {suffixLabel}
          </span>
        )}
      </div>
      {description && !errorMessage && (
        <span className={composeClassName(styles.description(), classNames?.description)}>{description}</span>
      )}
      {errorMessage && (
        <span className={composeClassName(styles.errorMessage(), classNames?.errorMessage)} role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  );
});
