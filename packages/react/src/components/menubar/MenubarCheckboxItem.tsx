import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { menuItemVariants } from "@auronui/styles";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";

export interface MenubarCheckboxItemOwnProps {
  textValue?: string;
  isDisabled?: boolean;
  variant?: "default" | "danger";
  className?: ClassValue;
  /** Controlled checked state. */
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  /** Merge props onto the single child element instead of rendering Radix's own wrapper. */
  asChild?: boolean;
  onSelect?: (event: Event) => void;
  children?: ReactNode;
}

export type MenubarCheckboxItemProps = MenubarCheckboxItemOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof MenubarCheckboxItemOwnProps>;

export const MenubarCheckboxItem = forwardRef<HTMLDivElement, MenubarCheckboxItemProps>(
  function MenubarCheckboxItem(
    {
      textValue,
      isDisabled,
      variant = "default",
      className,
      checked,
      onCheckedChange,
      disabled,
      asChild = false,
      onSelect,
      children,
      ...rest
    },
    ref,
  ) {
    const resolvedDisabled = resolveDeprecatedBooleanProp(
      "MenubarCheckboxItem",
      "isDisabled",
      isDisabled,
      "disabled",
      disabled,
    );

    const slots = menuItemVariants({ variant });

    return (
      <MenubarPrimitive.CheckboxItem
        ref={ref}
        checked={checked}
        textValue={textValue}
        disabled={resolvedDisabled}
        asChild={asChild}
        className={composeClassName(slots.item(), className)}
        onCheckedChange={onCheckedChange}
        onSelect={onSelect}
        {...rest}
      >
        <MenubarPrimitive.ItemIndicator className={slots.indicator()} forceMount>
          {/* Checkmark indicator */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            data-slot="menu-item-indicator--checkmark"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </MenubarPrimitive.ItemIndicator>

        {children}
      </MenubarPrimitive.CheckboxItem>
    );
  },
);
