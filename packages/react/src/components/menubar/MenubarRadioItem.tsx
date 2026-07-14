import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { menuItemVariants } from "@auronui/styles";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";

export interface MenubarRadioItemOwnProps {
  value: string;
  textValue?: string;
  isDisabled?: boolean;
  variant?: "default" | "danger";
  className?: ClassValue;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  /** Merge props onto the single child element instead of rendering Radix's own wrapper. */
  asChild?: boolean;
  onSelect?: (event: Event) => void;
  children?: ReactNode;
}

export type MenubarRadioItemProps = MenubarRadioItemOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof MenubarRadioItemOwnProps>;

export const MenubarRadioItem = forwardRef<HTMLDivElement, MenubarRadioItemProps>(
  function MenubarRadioItem(
    {
      value,
      textValue,
      isDisabled,
      variant = "default",
      className,
      disabled,
      asChild = false,
      onSelect,
      children,
      ...rest
    },
    ref,
  ) {
    const resolvedDisabled = resolveDeprecatedBooleanProp(
      "MenubarRadioItem",
      "isDisabled",
      isDisabled,
      "disabled",
      disabled,
    );

    const slots = menuItemVariants({ variant });

    return (
      <MenubarPrimitive.RadioItem
        ref={ref}
        value={value}
        textValue={textValue}
        disabled={resolvedDisabled}
        asChild={asChild}
        className={composeClassName(slots.item(), className)}
        onSelect={onSelect}
        {...rest}
      >
        <MenubarPrimitive.ItemIndicator className={slots.indicator()} forceMount>
          {/* Radio dot indicator */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="8"
            height="8"
            viewBox="0 0 8 8"
            aria-hidden="true"
            data-slot="menu-item-indicator--dot"
          >
            <circle cx="4" cy="4" r="4" fill="currentColor" />
          </svg>
        </MenubarPrimitive.ItemIndicator>

        {children}
      </MenubarPrimitive.RadioItem>
    );
  },
);
