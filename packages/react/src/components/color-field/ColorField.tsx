import { forwardRef, useEffect, useId, useRef, useState, type ChangeEvent, type FocusEvent } from "react";
import { colorFieldVariants, type ColorFieldVariants } from "@auronui/styles";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import { parseColor } from "react-stately";
import { useColorState, type Color } from "../../hooks";
import { useColorPickerContext } from "../color-picker/color-picker.context";

export interface ColorFieldOwnProps {
  value?: Color | string;
  defaultValue?: Color | string;
  label?: string;
  description?: string;
  errorMessage?: string;
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  isReadOnly?: boolean;
  /** @deprecated Use isReadOnly instead. */
  readonly?: boolean;
  placeholder?: string;
  fullWidth?: ColorFieldVariants["fullWidth"];
  className?: ClassValue;
  ariaLabel?: string;
  name?: string;
  isRequired?: boolean;
  /** @deprecated Use isRequired instead. */
  required?: boolean;
  classNames?: Partial<{
    label: ClassValue;
    input: ClassValue;
    description: ClassValue;
    errorMessage: ClassValue;
  }>;
  onChange?: (color: Color) => void;
}

export type ColorFieldProps = ColorFieldOwnProps;

/**
 * ColorField — a minimal styled text input for typing a color value
 * (hex/rgb/hsl/...). Built inline rather than composing the generic `Input`
 * component: the Vue source's `ColorFieldRoot`/`ColorFieldInput` anatomy and
 * `color-field.css` classes are self-contained and don't map onto Input's
 * slot set (no clear button, password toggle, etc. apply here).
 */
export const ColorField = forwardRef<HTMLInputElement, ColorFieldProps>(function ColorField(
  {
    value,
    defaultValue,
    label,
    description,
    errorMessage,
    isDisabled,
    disabled,
    isReadOnly,
    readonly,
    placeholder,
    fullWidth = false,
    className,
    ariaLabel,
    name,
    isRequired,
    required,
    classNames,
    onChange,
  },
  forwardedRef,
) {
  const resolvedDisabled = resolveDeprecatedBooleanProp("ColorField", "isDisabled", isDisabled, "disabled", disabled);
  const resolvedReadOnly = resolveDeprecatedBooleanProp("ColorField", "isReadOnly", isReadOnly, "readonly", readonly);
  const resolvedRequired = resolveDeprecatedBooleanProp("ColorField", "isRequired", isRequired, "required", required);

  const id = useId();

  const pickerCtx = useColorPickerContext();
  const local = useColorState(pickerCtx ? {} : { value, defaultValue });
  const color = pickerCtx ? pickerCtx.color : local.color;

  const styles = colorFieldVariants({ fullWidth });

  const [text, setText] = useState(() => color.toString("hex"));
  const isFocusedRef = useRef(false);

  // Keep the text in sync when the color changes externally (context, controlled value)
  // but not while the user is actively typing — otherwise each keystroke's own
  // resulting color update would re-render `text` from the canonical hex string
  // mid-edit and corrupt whatever the user is still typing.
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
      // Revert to the last valid color's string form.
      setText(color.toString("hex"));
    }
  }

  return (
    <div className={composeClassName(styles.base(), className)} data-invalid={errorMessage ? "true" : undefined}>
      {label && (
        <label htmlFor={id} className={composeClassName(styles.label(), classNames?.label)}>
          {label}
        </label>
      )}
      <input
        ref={forwardedRef}
        id={id}
        type="text"
        name={name}
        placeholder={placeholder}
        value={text}
        disabled={resolvedDisabled || undefined}
        readOnly={resolvedReadOnly || undefined}
        required={resolvedRequired || undefined}
        aria-label={label ? undefined : (ariaLabel ?? "Color value")}
        aria-invalid={errorMessage ? true : undefined}
        className={composeClassName(styles.input(), classNames?.input)}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
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
