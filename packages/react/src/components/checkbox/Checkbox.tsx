import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type FocusEvent,
  type ReactNode,
} from "react";
import { checkboxVariants, type CheckboxVariants } from "@auronui/styles";
import { composeClassName, dataAttr, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import { DEFAULT_CHECKBOX_GROUP_CONTEXT, useCheckboxGroupContext } from "./checkbox-group.context";

export interface CheckboxOwnProps {
  variant?: CheckboxVariants["variant"];
  color?: CheckboxVariants["color"];
  /** Value used to identify this checkbox within a CheckboxGroup. */
  value?: string;
  /** Controlled checked state (standalone mode only — ignored inside a CheckboxGroup). */
  isSelected?: boolean;
  /** Uncontrolled initial checked state (standalone mode only). */
  defaultSelected?: boolean;
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  isInvalid?: boolean;
  isIndeterminate?: boolean;
  name?: string;
  isRequired?: boolean;
  /** @deprecated Use isRequired instead. */
  required?: boolean;
  className?: ClassValue;
  /** Override classes for individual slots (base, control, indicator, content) */
  classNames?: Partial<{
    base: ClassValue;
    control: ClassValue;
    indicator: ClassValue;
    content: ClassValue;
  }>;
  onChange?: (isSelected: boolean) => void;
  children?: ReactNode;
}

export type CheckboxProps = CheckboxOwnProps &
  Omit<ComponentPropsWithoutRef<"input">, keyof CheckboxOwnProps | "type" | "checked" | "defaultChecked">;

/**
 * Native `<input type="checkbox">`-based checkbox. Reka UI's `CheckboxRoot`
 * (a `<button role="checkbox">`) is deliberately not used here — the React
 * port uses the standard accessible-custom-checkbox pattern (visually hidden
 * native input + sibling styled indicator span) so the control participates
 * in native HTML forms and gets free browser behavior (label click-through,
 * indeterminate a11y semantics).
 *
 * Because the interactive element (the `<input>`) is now a *descendant* of
 * the `.checkbox` root (a `<label>`) rather than the root itself, the shared
 * `@auronui/styles` CSS's `.checkbox:focus-visible` selector can never match
 * (native `:focus-visible` doesn't bubble to ancestors). We approximate it by
 * toggling the exact same `status-focused` utility class the CSS would have
 * applied, driven by `element.matches(':focus-visible')` in onFocus/onBlur.
 * `:hover`/`:active` need no such workaround — those pseudo-classes are
 * hit-test based and apply to ancestors naturally. `:disabled` already has a
 * `[data-disabled]` fallback baked into the shared CSS.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    variant,
    color,
    value,
    isSelected,
    defaultSelected = false,
    isDisabled,
    disabled,
    isInvalid = false,
    isIndeterminate = false,
    name,
    isRequired,
    required,
    className,
    classNames,
    onChange,
    id,
    children,
    ...rest
  },
  ref,
) {
  const groupCtx = useCheckboxGroupContext(DEFAULT_CHECKBOX_GROUP_CONTEXT);
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const localRef = useRef<HTMLInputElement | null>(null);
  const setRefs = useCallback(
    (node: HTMLInputElement | null) => {
      localRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
    },
    [ref],
  );

  const resolvedDisabled = resolveDeprecatedBooleanProp(
    "Checkbox",
    "isDisabled",
    isDisabled,
    "disabled",
    disabled,
  );
  const resolvedRequired = resolveDeprecatedBooleanProp(
    "Checkbox",
    "isRequired",
    isRequired,
    "required",
    required,
  );

  // group disabled ALWAYS wins over child prop; all other props: child prop wins over group value
  const effectiveDisabled = groupCtx.disabled || resolvedDisabled;
  const effectiveInvalid = groupCtx.isInvalid || isInvalid;
  const finalVariant = variant ?? groupCtx.variant;
  const finalColor = color ?? groupCtx.color;
  const isInGroup = value !== undefined;

  const [uncontrolledSelected, setUncontrolledSelected] = useState(defaultSelected);
  const checked = isInGroup
    ? groupCtx.selectedValues.includes(value)
    : (isSelected ?? uncontrolledSelected);

  useEffect(() => {
    if (localRef.current) localRef.current.indeterminate = isIndeterminate;
  }, [isIndeterminate]);

  const [isFocusVisible, setIsFocusVisible] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const next = event.target.checked;
    if (isInGroup) {
      groupCtx.toggleValue(value);
    } else {
      if (isSelected === undefined) setUncontrolledSelected(next);
      onChange?.(next);
    }
  }

  function handleFocus(event: FocusEvent<HTMLInputElement>) {
    setIsFocusVisible(event.target.matches(":focus-visible"));
  }

  function handleBlur() {
    setIsFocusVisible(false);
  }

  const slotFns = useMemo(
    () => checkboxVariants({ variant: finalVariant, color: finalColor }),
    [finalVariant, finalColor],
  );

  return (
    <label
      htmlFor={inputId}
      className={composeClassName(slotFns.base(), className, classNames?.base)}
      data-disabled={dataAttr(effectiveDisabled)}
      data-state={isIndeterminate ? "indeterminate" : checked ? "checked" : "unchecked"}
      aria-invalid={effectiveInvalid || undefined}
    >
      <input
        ref={setRefs}
        id={inputId}
        type="checkbox"
        className="sr-only"
        checked={checked}
        disabled={effectiveDisabled}
        required={resolvedRequired}
        name={name ?? groupCtx.name}
        value={value}
        aria-checked={isIndeterminate ? "mixed" : undefined}
        aria-invalid={effectiveInvalid || undefined}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      />
      <span
        className={composeClassName(
          slotFns.control(),
          isFocusVisible && "status-focused",
          classNames?.control,
        )}
        data-slot="checkbox-control"
      >
        <span
          className={composeClassName(slotFns.indicator(), classNames?.indicator)}
          data-slot="checkbox-indicator"
        >
          {isIndeterminate ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          ) : (
            checked && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )
          )}
        </span>
      </span>
      <span className={composeClassName(slotFns.content(), classNames?.content)}>{children}</span>
    </label>
  );
});
