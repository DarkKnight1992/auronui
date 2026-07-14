import { forwardRef, useEffect, useMemo, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { toggleButtonGroupVariants, type ToggleButtonVariants } from "@auronui/styles";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import { ToggleButton } from "./ToggleButton";
import {
  ToggleButtonGroupProvider,
  type ToggleButtonGroupContext,
  type ToggleButtonGroupSelectionMode,
} from "./toggle-button-group.context";

type ToggleButtonShorthandItem = {
  value: string;
  label?: ReactNode;
  isIconOnly?: boolean;
  disabled?: boolean;
  className?: ClassValue;
};

export interface ToggleButtonGroupOwnProps {
  variant?: ToggleButtonVariants["variant"];
  size?: ToggleButtonVariants["size"];
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  fullWidth?: boolean;
  orientation?: "horizontal" | "vertical";
  isDetached?: boolean;
  selectionMode?: ToggleButtonGroupSelectionMode;
  /** Controlled selected value(s) — string for single mode, string[] for multiple mode. */
  value?: string | string[];
  /** Uncontrolled initial selected value(s). */
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  className?: ClassValue;
  /** Override classes for individual slots (base) */
  classNames?: Partial<{
    base: ClassValue;
  }>;
  /** Shorthand API: render toggle buttons from an array instead of passing ToggleButton children. */
  buttons?: ToggleButtonShorthandItem[];
  children?: ReactNode;
}

export type ToggleButtonGroupProps = ToggleButtonGroupOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof ToggleButtonGroupOwnProps>;

function normalize(v: string | string[] | undefined): string[] {
  if (v === undefined) return [];
  return Array.isArray(v) ? [...v] : [v];
}

export const ToggleButtonGroup = forwardRef<HTMLDivElement, ToggleButtonGroupProps>(function ToggleButtonGroup(
  {
    variant = "default",
    size = "md",
    isDisabled,
    disabled,
    fullWidth = false,
    orientation = "horizontal",
    isDetached = false,
    selectionMode = "multiple",
    value,
    defaultValue,
    onValueChange,
    className,
    classNames,
    buttons,
    children,
    ...rest
  },
  ref,
) {
  const resolvedDisabled = resolveDeprecatedBooleanProp(
    "ToggleButtonGroup",
    "isDisabled",
    isDisabled,
    "disabled",
    disabled,
  );

  // Normalize value/defaultValue to string[] for internal use.
  const [internalSelected, setInternalSelected] = useState<string[]>(() =>
    normalize(value !== undefined ? value : defaultValue),
  );

  // Keep internal state in sync when the controlled `value` prop changes from outside.
  useEffect(() => {
    if (value !== undefined) setInternalSelected(normalize(value));
  }, [value]);

  const selectedValues = value !== undefined ? normalize(value) : internalSelected;

  function toggleValue(v: string) {
    let next: string[];
    if (selectionMode === "single") {
      next = selectedValues.includes(v) ? [] : [v];
    } else {
      next = selectedValues.includes(v)
        ? selectedValues.filter((x) => x !== v)
        : [...selectedValues, v];
    }
    if (value === undefined) setInternalSelected(next);
    onValueChange?.(selectionMode === "single" ? (next[0] ?? "") : next);
  }

  const slotFns = useMemo(
    () => toggleButtonGroupVariants({ fullWidth, orientation, isDetached }),
    [fullWidth, orientation, isDetached],
  );

  const contextValue: ToggleButtonGroupContext = {
    variant,
    size,
    disabled: resolvedDisabled,
    fullWidth,
    orientation,
    selectionMode,
    selectedValues,
    toggleValue,
  };

  return (
    <div
      ref={ref}
      className={composeClassName(slotFns.base(), className, classNames?.base)}
      data-orientation={orientation}
      role="group"
      {...rest}
    >
      <ToggleButtonGroupProvider value={contextValue}>
        {buttons
          ? buttons.map((btn) => (
              <ToggleButton
                key={btn.value}
                value={btn.value}
                isIconOnly={btn.isIconOnly}
                isDisabled={btn.disabled}
                className={btn.className}
              >
                {btn.label}
              </ToggleButton>
            ))
          : children}
      </ToggleButtonGroupProvider>
    </div>
  );
});
