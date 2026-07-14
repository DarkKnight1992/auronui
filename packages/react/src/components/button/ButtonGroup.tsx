import { forwardRef, useMemo, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { buttonGroupVariants, type ButtonVariants } from "@auronui/styles";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import { Button, type ButtonProps } from "./Button";
import {
  ButtonGroupProvider,
  type ButtonGroupContext,
  type ButtonGroupSelectionMode,
  type ButtonGroupValue,
} from "./button-group.context";

type ButtonShorthandItem = {
  label: ReactNode;
  value?: string | number;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: ButtonVariants["variant"];
  color?: ButtonVariants["color"];
  className?: ClassValue;
  classNames?: ButtonProps["classNames"];
};

export interface ButtonGroupOwnProps {
  variant?: ButtonVariants["variant"];
  color?: ButtonVariants["color"];
  size?: ButtonVariants["size"];
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  fullWidth?: boolean;
  orientation?: "horizontal" | "vertical";
  className?: ClassValue;
  /** Override classes for individual slots (base) */
  classNames?: Partial<{
    base: ClassValue;
  }>;
  selectionMode?: ButtonGroupSelectionMode;
  /** Controlled selected value(s) — scalar for single mode, array for multiple mode. */
  value?: ButtonGroupValue;
  /** Uncontrolled initial selected value(s). */
  defaultValue?: ButtonGroupValue;
  onValueChange?: (value: ButtonGroupValue) => void;
  /** Shorthand API: render buttons from an array instead of passing Button children. */
  buttons?: ButtonShorthandItem[];
  children?: ReactNode;
}

export type ButtonGroupProps = ButtonGroupOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof ButtonGroupOwnProps>;

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  {
    variant = "solid",
    color = "primary",
    size = "md",
    isDisabled,
    disabled,
    fullWidth = false,
    orientation = "horizontal",
    className,
    classNames,
    selectionMode = "single",
    value,
    defaultValue,
    onValueChange,
    buttons,
    children,
    ...rest
  },
  ref,
) {
  const resolvedDisabled = resolveDeprecatedBooleanProp(
    "ButtonGroup",
    "isDisabled",
    isDisabled,
    "disabled",
    disabled,
  );

  // Selected value: controlled if `value` prop is provided, otherwise uncontrolled.
  // Single mode: scalar (string|number|null). Multiple mode: array of scalars.
  const [internalSelected, setInternalSelected] = useState<ButtonGroupValue>(
    () => defaultValue ?? (selectionMode === "multiple" ? [] : null),
  );

  const selectedValue: ButtonGroupValue = value !== undefined ? value : internalSelected;

  function isValueSelected(v: string | number | undefined): boolean {
    if (v === undefined) return false;
    if (Array.isArray(selectedValue)) return selectedValue.includes(v);
    return selectedValue === v;
  }

  function selectValue(v: string | number) {
    let next: ButtonGroupValue;
    if (selectionMode === "multiple") {
      const current = Array.isArray(selectedValue) ? selectedValue : [];
      next = current.includes(v) ? current.filter((x) => x !== v) : [...current, v];
    } else {
      // Single mode: clicking the already-selected button deselects it
      next = selectedValue === v ? null : v;
    }
    if (value === undefined) setInternalSelected(next);
    onValueChange?.(next);
  }

  const slotFns = useMemo(
    () => buttonGroupVariants({ fullWidth, orientation }),
    [fullWidth, orientation],
  );

  const contextValue: ButtonGroupContext = {
    variant,
    color,
    size,
    disabled: resolvedDisabled,
    fullWidth,
    orientation,
    selectionMode,
    selectedValue,
    isValueSelected,
    selectValue,
  };

  return (
    <div
      ref={ref}
      className={composeClassName(slotFns.base(), className, classNames?.base)}
      data-orientation={orientation}
      role="group"
      {...rest}
    >
      <ButtonGroupProvider value={contextValue}>
        {buttons
          ? buttons.map((btn, idx) => (
              <Button
                key={idx}
                value={btn.value}
                isDisabled={btn.disabled}
                isLoading={btn.isLoading}
                variant={btn.variant}
                color={btn.color}
                className={btn.className}
                classNames={btn.classNames}
              >
                {btn.label}
              </Button>
            ))
          : children}
      </ButtonGroupProvider>
    </div>
  );
});
