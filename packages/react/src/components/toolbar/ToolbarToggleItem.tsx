import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as ToolbarPrimitive from "@radix-ui/react-toolbar";
import { toggleButtonVariants, type ToggleButtonVariants } from "@auronui/styles";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";

export interface ToolbarToggleItemOwnProps {
  value: string;
  variant?: ToggleButtonVariants["variant"];
  size?: ToggleButtonVariants["size"];
  isIconOnly?: boolean;
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  asChild?: boolean;
  className?: ClassValue;
  children?: ReactNode;
}

export type ToolbarToggleItemProps = ToolbarToggleItemOwnProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof ToolbarToggleItemOwnProps>;

export const ToolbarToggleItem = forwardRef<HTMLButtonElement, ToolbarToggleItemProps>(
  function ToolbarToggleItem(
    { value, variant = "ghost", size = "md", isIconOnly = false, isDisabled, disabled, asChild, className, children, ...rest },
    ref,
  ) {
    const resolvedDisabled = resolveDeprecatedBooleanProp(
      "ToolbarToggleItem",
      "isDisabled",
      isDisabled,
      "disabled",
      disabled,
    );

    const classes = toggleButtonVariants({ variant, size, isIconOnly });

    return (
      <ToolbarPrimitive.ToggleItem
        ref={ref}
        value={value}
        disabled={resolvedDisabled}
        asChild={asChild}
        className={composeClassName(classes, className)}
        {...rest}
      >
        {children}
      </ToolbarPrimitive.ToggleItem>
    );
  },
);
