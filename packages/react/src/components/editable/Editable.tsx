import { useCallback, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { editableVariants } from "@auronui/styles";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import { EditableProvider } from "./editable.context";

/**
 * Editable — inline click(or focus)-to-edit text field, composed of
 * Editable (root, state) + EditableArea (wrapper) + EditablePreview
 * (read-only text) + EditableInput (the text input) + trigger buttons
 * (EditableEditTrigger / EditableSubmitTrigger / EditableCancelTrigger).
 *
 * @auronui/vue's Editable.vue wraps reka-ui's EditableRoot family
 * (a Vue port of Zag.js/Radix-style editable primitives). React has no
 * equivalent headless primitive among this package's dependencies
 * (react-aria-components does not ship an Editable pattern), so this is a
 * hand-rolled state machine mirroring the same anatomy, prop names, and
 * a11y contract: `activationMode` (how EditablePreview enters edit mode),
 * `submitMode` (how EditableInput commits), Escape-to-cancel, and
 * controlled/uncontrolled value support.
 *
 * Deviation from the Vue version: `as`/`asChild` polymorphic rendering
 * (reka-ui's Primitive component pattern) is not ported — each part
 * renders a fixed native element (div/span/input/button). Every other
 * documented prop is preserved.
 */

export interface EditableOwnProps {
  value?: string | null;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string | { edit?: string; preview?: string };
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  isReadOnly?: boolean;
  /** @deprecated Use isReadOnly instead. */
  readonly?: boolean;
  activationMode?: "focus" | "dblclick" | "none";
  selectOnFocus?: boolean;
  submitMode?: "blur" | "enter" | "none" | "both";
  startWithEditMode?: boolean;
  maxLength?: number;
  id?: string;
  name?: string;
  isRequired?: boolean;
  /** @deprecated Use isRequired instead. */
  required?: boolean;
  className?: ClassValue;
  children?: ReactNode;
  /** Fired when the value is committed (submit). */
  onSubmit?: (value: string | null | undefined) => void;
  /** Fired whenever the edit/preview state changes. */
  onStateChange?: (state: "edit" | "submit" | "cancel") => void;
}

export function Editable({
  value,
  defaultValue = "",
  onChange,
  placeholder,
  isDisabled,
  disabled,
  isReadOnly,
  readonly,
  activationMode = "focus",
  selectOnFocus = false,
  submitMode = "blur",
  startWithEditMode = false,
  maxLength,
  id,
  name,
  isRequired,
  required,
  className,
  children,
  onSubmit,
  onStateChange,
}: EditableOwnProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);

  const resolvedIsDisabled = resolveDeprecatedBooleanProp(
    "Editable",
    "isDisabled",
    isDisabled,
    "disabled",
    disabled,
  );
  const resolvedIsReadOnly = resolveDeprecatedBooleanProp(
    "Editable",
    "isReadOnly",
    isReadOnly,
    "readonly",
    readonly,
  );
  const resolvedIsRequired = resolveDeprecatedBooleanProp(
    "Editable",
    "isRequired",
    isRequired,
    "required",
    required,
  );

  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const currentValue = (isControlled ? (value ?? "") : uncontrolledValue) ?? "";
  const previousValueRef = useRef(currentValue);

  const [isEditing, setIsEditing] = useState(startWithEditMode);

  const setInputValue = useCallback(
    (next: string) => {
      if (!isControlled) setUncontrolledValue(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const edit = useCallback(() => {
    if (resolvedIsDisabled || resolvedIsReadOnly) return;
    previousValueRef.current = currentValue;
    setIsEditing(true);
    onStateChange?.("edit");
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      if (selectOnFocus) el.select();
    });
  }, [resolvedIsDisabled, resolvedIsReadOnly, currentValue, onStateChange, selectOnFocus]);

  const submit = useCallback(() => {
    setIsEditing(false);
    onStateChange?.("submit");
    onSubmit?.(currentValue);
  }, [onStateChange, onSubmit, currentValue]);

  const cancel = useCallback(() => {
    setInputValue(previousValueRef.current);
    setIsEditing(false);
    onStateChange?.("cancel");
  }, [setInputValue, onStateChange]);

  const slotFns = useMemo(() => editableVariants(), []);

  const contextValue = useMemo(
    () => ({
      value: currentValue,
      isEditing,
      isDisabled: resolvedIsDisabled,
      isReadOnly: resolvedIsReadOnly,
      placeholder,
      maxLength,
      selectOnFocus,
      activationMode,
      submitMode,
      inputId,
      inputRef,
      setInputValue,
      edit,
      submit,
      cancel,
    }),
    [
      currentValue,
      isEditing,
      resolvedIsDisabled,
      resolvedIsReadOnly,
      placeholder,
      maxLength,
      selectOnFocus,
      activationMode,
      submitMode,
      inputId,
      setInputValue,
      edit,
      submit,
      cancel,
    ],
  );

  return (
    <div
      className={composeClassName(slotFns.base(), className)}
      data-slot="editable-root"
      data-state={isEditing ? "edit" : "preview"}
      data-disabled={resolvedIsDisabled || undefined}
      data-readonly={resolvedIsReadOnly || undefined}
    >
      {/* Hidden native input keeps `name`/`required` participating in native
          form submission the same way reka-ui's EditableRoot forwards them. */}
      {name && <input type="hidden" name={name} value={currentValue} required={resolvedIsRequired || undefined} />}
      <EditableProvider value={contextValue}>{children}</EditableProvider>
    </div>
  );
}
