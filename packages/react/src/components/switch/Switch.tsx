import {
  forwardRef,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { switchVariants, type SwitchVariants } from "@auronui/styles";
import { composeClassName, dataAttr, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import { DEFAULT_SWITCH_GROUP_CONTEXT, useSwitchGroupContext } from "./switch-group.context";

export interface SwitchOwnProps {
  size?: SwitchVariants["size"];
  isInvalid?: boolean;
  /** Value used to identify this switch within a SwitchGroup. */
  value?: string;
  /** Controlled checked state (standalone mode only — ignored inside a SwitchGroup). */
  isSelected?: boolean;
  /** Uncontrolled initial checked state (standalone mode only). */
  defaultSelected?: boolean;
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  name?: string;
  isRequired?: boolean;
  /** @deprecated Use isRequired instead. */
  required?: boolean;
  className?: ClassValue;
  /** Per-slot class overrides. Each key is a slot name (base, control, thumb, content). */
  classNames?: Partial<{
    base: ClassValue;
    control: ClassValue;
    thumb: ClassValue;
    content: ClassValue;
  }>;
  onChange?: (isSelected: boolean) => void;
  children?: ReactNode;
}

export type SwitchProps = SwitchOwnProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof SwitchOwnProps | "type">;

/**
 * `<button role="switch" aria-checked>` — this mirrors how Reka UI's own
 * `SwitchRoot` renders (a button, not a native input), so unlike
 * Checkbox/Radio no accessible-custom-input workaround is needed here: the
 * button itself is the focusable/interactive root, so `:focus-visible`,
 * `:hover`, `:active`, and `:disabled` in the shared `@auronui/styles` CSS
 * all apply directly and natively.
 *
 * A visually hidden native `<input type="checkbox">` is rendered alongside
 * (only when `name` is provided) purely for native `<form>` submission —
 * a plain `<button type="button">` never contributes to FormData on its own,
 * which is the same reason Radix/Reka's own Switch primitive does this.
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    size,
    isInvalid = false,
    value,
    isSelected,
    defaultSelected = false,
    isDisabled,
    disabled,
    name,
    isRequired,
    required,
    className,
    classNames,
    onChange,
    id,
    children,
    onClick,
    ...rest
  },
  ref,
) {
  const groupCtx = useSwitchGroupContext(DEFAULT_SWITCH_GROUP_CONTEXT);
  const generatedId = useId();
  const switchId = id ?? generatedId;

  const resolvedDisabled = resolveDeprecatedBooleanProp(
    "Switch",
    "isDisabled",
    isDisabled,
    "disabled",
    disabled,
  );
  const resolvedRequired = resolveDeprecatedBooleanProp(
    "Switch",
    "isRequired",
    isRequired,
    "required",
    required,
  );

  // group disabled ALWAYS wins over child prop; all other props: child prop wins over group value
  const effectiveDisabled = groupCtx.disabled || resolvedDisabled;
  const effectiveInvalid = groupCtx.isInvalid || isInvalid;
  const finalSize = size ?? groupCtx.size;
  const isInGroup = value !== undefined;

  const [uncontrolledSelected, setUncontrolledSelected] = useState(defaultSelected);
  const checked = isInGroup
    ? groupCtx.selectedValues.includes(value)
    : (isSelected ?? uncontrolledSelected);

  const hiddenInputRef = useRef<HTMLInputElement>(null);

  function toggle() {
    if (effectiveDisabled) return;
    if (isInGroup) {
      groupCtx.toggleValue(value);
    } else {
      const next = !checked;
      if (isSelected === undefined) setUncontrolledSelected(next);
      onChange?.(next);
    }
  }

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    toggle();
    onClick?.(event);
  }

  const slotFns = useMemo(() => switchVariants({ size: finalSize }), [finalSize]);

  return (
    <>
      <button
        ref={ref}
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-invalid={effectiveInvalid || undefined}
        aria-required={resolvedRequired || undefined}
        disabled={effectiveDisabled}
        data-disabled={dataAttr(effectiveDisabled)}
        data-state={checked ? "checked" : "unchecked"}
        className={composeClassName(slotFns.base(), className, classNames?.base)}
        onClick={handleClick}
        {...rest}
      >
        <span className={composeClassName(slotFns.control(), classNames?.control)}>
          <span className={composeClassName(slotFns.thumb(), classNames?.thumb)} />
        </span>
        {children != null && (
          <span className={composeClassName(slotFns.content(), classNames?.content)}>{children}</span>
        )}
      </button>
      {/* Buttons can't contain interactive content, so the hidden form-submission
          input (needed because a plain <button type="button"> never contributes
          to FormData) is rendered as a sibling instead of a child. */}
      {name && (
        <input
          ref={hiddenInputRef}
          type="checkbox"
          name={name}
          value={value ?? "on"}
          checked={checked}
          readOnly
          required={resolvedRequired}
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
        />
      )}
    </>
  );
});
