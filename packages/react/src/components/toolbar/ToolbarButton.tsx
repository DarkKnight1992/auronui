import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as ToolbarPrimitive from "@radix-ui/react-toolbar";
import { toggleButtonVariants, type ToggleButtonVariants } from "@auronui/styles";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";

export interface ToolbarButtonOwnProps {
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

export type ToolbarButtonProps = ToolbarButtonOwnProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof ToolbarButtonOwnProps>;

export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(function ToolbarButton(
  { variant = "ghost", size = "md", isIconOnly = false, isDisabled, disabled, asChild, className, children, ...rest },
  ref,
) {
  const resolvedDisabled = resolveDeprecatedBooleanProp(
    "ToolbarButton",
    "isDisabled",
    isDisabled,
    "disabled",
    disabled,
  );

  const classes = toggleButtonVariants({ variant, size, isIconOnly });

  return (
    <ToolbarPrimitive.Button
      ref={ref}
      disabled={resolvedDisabled}
      asChild={asChild}
      className={composeClassName(classes, className)}
      {...rest}
    >
      {children}
    </ToolbarPrimitive.Button>
  );
});
