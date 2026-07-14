/**
 * InputOTP — segmented one-time-passcode input.
 *
 * The Vue port wraps reka-ui's `PinInputRoot`/`PinInputInput`. This package
 * has no equivalent primitive dependency (react-aria-components has no
 * PinInput either), and the actual segment-focus-management logic is
 * simple enough to not warrant adding a new npm dependency: an array of
 * single-char `<input>`s with auto-advance-on-type, backspace-goes-to-
 * previous-segment, and paste-fills-remaining-segments. State is handled
 * by the already-ported `useOTP` hook; this component only owns DOM
 * refs/focus management and per-slot key/paste handling.
 */
import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { inputOTPVariants, type InputOTPVariants } from "@auronui/styles";
import { composeClassName, dataAttr, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import { useOTP } from "../../hooks";

export interface InputOTPProps {
  length?: number;
  /** Controlled value. When provided, InputOTP renders this value and calls onValueChange/onComplete — the parent owns state. */
  value?: string;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  isRequired?: boolean;
  /** @deprecated Use isRequired instead. */
  required?: boolean;
  /** Mask entered characters (e.g. password-style dots). */
  mask?: boolean;
  variant?: InputOTPVariants["variant"];
  name?: string;
  id?: string;
  className?: ClassValue;
  classNames?: Partial<{
    base: ClassValue;
    group: ClassValue;
    slot: ClassValue;
  }>;
  "aria-label"?: string;
}

export function InputOTP({
  length = 6,
  value: controlledValue,
  defaultValue,
  onValueChange,
  onComplete,
  isDisabled,
  disabled,
  isRequired,
  required,
  mask = false,
  variant = "primary",
  name,
  id,
  className,
  classNames,
  "aria-label": ariaLabel,
}: InputOTPProps) {
  const resolvedDisabled = resolveDeprecatedBooleanProp("InputOTP", "isDisabled", isDisabled, "disabled", disabled);
  const resolvedRequired = resolveDeprecatedBooleanProp("InputOTP", "isRequired", isRequired, "required", required);

  const isControlled = controlledValue !== undefined;
  const otp = useOTP({ length, defaultValue, onChange: onValueChange, onComplete });
  const value = isControlled ? controlledValue : otp.value;

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  function updateValue(next: string) {
    if (isControlled) {
      onValueChange?.(next);
      if (next.length === length) onComplete?.(next);
    } else if (next.length === length) {
      otp.onOTPComplete(next);
    } else {
      otp.onValueChange(next);
    }
  }

  function handleChange(index: number, raw: string) {
    const char = raw.replace(/\s/g, "").slice(-1);
    const chars = value.padEnd(length, "\0").split("");
    chars[index] = char || "";
    const next = chars.join("").replace(/\0/g, "").slice(0, length);
    updateValue(next);
    if (char && index < length - 1) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace") {
      if (!value[index] && index > 0) {
        event.preventDefault();
        const chars = value.padEnd(length, "\0").split("");
        chars[index - 1] = "";
        updateValue(
          chars
            .join("")
            .replace(/\0/g, "")
            .slice(0, length),
        );
        inputRefs.current[index - 1]?.focus();
      }
    } else if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < length - 1) {
      event.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData("text").replace(/\s/g, "");
    if (!pasted) return;
    event.preventDefault();
    const chars = value.padEnd(length, "\0").split("");
    for (let i = 0; i < pasted.length && index + i < length; i++) {
      chars[index + i] = pasted[i]!;
    }
    const next = chars.join("").replace(/\0/g, "").slice(0, length);
    updateValue(next);
    const focusIndex = Math.min(index + pasted.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
  }

  const slots = inputOTPVariants({ variant });

  return (
    <div
      id={id}
      role="group"
      aria-label={ariaLabel ?? "One-time passcode"}
      data-disabled={dataAttr(resolvedDisabled)}
      className={composeClassName(slots.base(), className, classNames?.base)}
    >
      <div className={composeClassName(slots.group(), classNames?.group)}>
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type={mask ? "password" : "text"}
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            name={name ? `${name}[${index}]` : undefined}
            aria-label={`Digit ${index + 1} of ${length}`}
            disabled={resolvedDisabled}
            required={resolvedRequired}
            value={value[index] ?? ""}
            data-filled={dataAttr(!!value[index])}
            className={composeClassName(slots.slot(), classNames?.slot)}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={(e) => handlePaste(index, e)}
          />
        ))}
      </div>
    </div>
  );
}
