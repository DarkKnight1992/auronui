import type { ReactNode } from "react";
import { MenuItem } from "react-aria-components";
import { menuItemVariants } from "@auronui/styles";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";

export interface DropdownRadioItemProps {
  value: string;
  textValue?: string;
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  variant?: "default" | "danger";
  className?: ClassValue;
  children?: ReactNode;
}

export function DropdownRadioItem({
  value,
  textValue,
  isDisabled,
  disabled,
  variant = "default",
  className,
  children,
}: DropdownRadioItemProps) {
  const resolvedDisabled = resolveDeprecatedBooleanProp(
    "DropdownRadioItem",
    "isDisabled",
    isDisabled,
    "disabled",
    disabled,
  );

  const slots = menuItemVariants({ variant });

  return (
    <MenuItem
      id={value}
      textValue={textValue}
      isDisabled={resolvedDisabled}
      className={composeClassName(slots.item(), className)}
    >
      {({ isSelected }) => (
        <>
          <span className={slots.indicator()} data-state={isSelected ? "checked" : "unchecked"}>
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
          </span>

          {children}
        </>
      )}
    </MenuItem>
  );
}
