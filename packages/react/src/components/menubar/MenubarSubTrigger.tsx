import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { menuItemVariants } from "@auronui/styles";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";

export interface MenubarSubTriggerOwnProps {
  isDisabled?: boolean;
  textValue?: string;
  className?: ClassValue;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  /** Merge props onto the single child element instead of rendering Radix's own wrapper. */
  asChild?: boolean;
  children?: ReactNode;
}

export type MenubarSubTriggerProps = MenubarSubTriggerOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof MenubarSubTriggerOwnProps>;

export const MenubarSubTrigger = forwardRef<HTMLDivElement, MenubarSubTriggerProps>(
  function MenubarSubTrigger(
    { isDisabled, textValue, className, disabled, asChild = false, children, ...rest },
    ref,
  ) {
    const resolvedDisabled = resolveDeprecatedBooleanProp(
      "MenubarSubTrigger",
      "isDisabled",
      isDisabled,
      "disabled",
      disabled,
    );

    const slots = menuItemVariants({ variant: "default" });

    return (
      <MenubarPrimitive.SubTrigger
        ref={ref}
        disabled={resolvedDisabled}
        textValue={textValue}
        asChild={asChild}
        className={composeClassName(slots.item(), className)}
        {...rest}
      >
        {children}
        <span className={slots.submenuIndicator()} aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            data-slot="submenu-indicator"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>
      </MenubarPrimitive.SubTrigger>
    );
  },
);
