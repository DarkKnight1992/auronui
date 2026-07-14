import { forwardRef, useMemo, useState, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { toggleButtonVariants, type ToggleButtonVariants } from "@auronui/styles";
import { composeClassName, dataAttr, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import {
  DEFAULT_TOGGLE_BUTTON_GROUP_CONTEXT,
  useToggleButtonGroupContext,
} from "./toggle-button-group.context";

export interface ToggleButtonOwnProps {
  variant?: ToggleButtonVariants["variant"];
  size?: ToggleButtonVariants["size"];
  isIconOnly?: boolean;
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  /** Controlled pressed state (standalone usage, i.e. no `value`/group). */
  pressed?: boolean;
  /** Uncontrolled initial pressed state. */
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  /** Identifies this button within a ToggleButtonGroup; enables group-managed selection. */
  value?: string;
  className?: ClassValue;
  name?: string;
  isRequired?: boolean;
  /** @deprecated Use isRequired instead. */
  required?: boolean;
  children?: ReactNode;
}

export type ToggleButtonProps = ToggleButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ToggleButtonOwnProps>;

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(function ToggleButton(
  {
    variant,
    size,
    isIconOnly = false,
    isDisabled,
    disabled,
    pressed,
    defaultPressed = false,
    onPressedChange,
    value,
    className,
    name,
    isRequired,
    required,
    children,
    onClick,
    ...rest
  },
  ref,
) {
  // Inject ToggleButtonGroup context with fallback defaults (mirrors Button → ButtonGroup pattern)
  const groupCtx = useToggleButtonGroupContext(DEFAULT_TOGGLE_BUTTON_GROUP_CONTEXT);

  const resolvedDisabled = resolveDeprecatedBooleanProp(
    "ToggleButton",
    "isDisabled",
    isDisabled,
    "disabled",
    disabled,
  );

  const resolvedRequired = resolveDeprecatedBooleanProp(
    "ToggleButton",
    "isRequired",
    isRequired,
    "required",
    required,
  );

  // Prop precedence: group disabled wins; child prop wins for variant/size
  const effectiveDisabled = groupCtx.disabled || resolvedDisabled;
  const finalVariant = variant ?? groupCtx.variant;
  const finalSize = size ?? groupCtx.size;

  // When inside a group and a `value` prop is provided, pressed state is derived from group state.
  const isGroupManaged = value !== undefined;

  const [internalPressed, setInternalPressed] = useState(defaultPressed);
  const isPressed = isGroupManaged
    ? groupCtx.selectedValues.includes(value)
    : pressed !== undefined
      ? pressed
      : internalPressed;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (isGroupManaged) {
      groupCtx.toggleValue(value);
    } else {
      const next = !isPressed;
      if (pressed === undefined) setInternalPressed(next);
      onPressedChange?.(next);
    }
    onClick?.(event);
  }

  const classes = useMemo(
    () => toggleButtonVariants({ variant: finalVariant, size: finalSize, isIconOnly }),
    [finalVariant, finalSize, isIconOnly],
  );

  return (
    <button
      {...rest}
      ref={ref}
      type="button"
      className={composeClassName(classes, className)}
      disabled={effectiveDisabled || undefined}
      data-state={isPressed ? "on" : "off"}
      data-disabled={dataAttr(effectiveDisabled)}
      data-orientation={groupCtx.orientation}
      aria-pressed={isPressed}
      aria-required={resolvedRequired || undefined}
      name={name}
      onClick={handleClick}
    >
      {children}
    </button>
  );
});
