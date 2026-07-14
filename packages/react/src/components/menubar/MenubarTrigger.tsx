import { forwardRef, useMemo, type ComponentPropsWithoutRef } from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { menubarVariants } from "@auronui/styles";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";

export interface MenubarTriggerOwnProps {
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  /**
   * Merge props onto the single child element instead of rendering Radix's own `button`.
   * Radix has no reka-ui-style `as` (arbitrary tag) escape hatch — only `asChild`.
   * @default false
   */
  asChild?: boolean;
  className?: ClassValue;
}

export type MenubarTriggerProps = MenubarTriggerOwnProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof MenubarTriggerOwnProps>;

export const MenubarTrigger = forwardRef<HTMLButtonElement, MenubarTriggerProps>(
  function MenubarTrigger(
    { isDisabled, disabled, asChild = false, className, children, ...rest },
    ref,
  ) {
    const resolvedDisabled = resolveDeprecatedBooleanProp(
      "MenubarTrigger",
      "isDisabled",
      isDisabled,
      "disabled",
      disabled,
    );

    const slots = useMemo(() => menubarVariants(), []);

    return (
      <MenubarPrimitive.Trigger
        ref={ref}
        disabled={resolvedDisabled}
        asChild={asChild}
        className={composeClassName(slots.trigger(), className)}
        {...rest}
      >
        {children}
      </MenubarPrimitive.Trigger>
    );
  },
);
