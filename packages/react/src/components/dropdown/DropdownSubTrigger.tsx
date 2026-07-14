import type { ReactNode } from "react";
import { MenuItem } from "react-aria-components";
import { menuItemVariants } from "@auronui/styles";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";

export interface DropdownSubTriggerProps {
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  textValue?: string;
  className?: ClassValue;
  children?: ReactNode;
}

export function DropdownSubTrigger({
  isDisabled,
  disabled,
  textValue,
  className,
  children,
}: DropdownSubTriggerProps) {
  const resolvedDisabled = resolveDeprecatedBooleanProp(
    "DropdownSubTrigger",
    "isDisabled",
    isDisabled,
    "disabled",
    disabled,
  );

  const slots = menuItemVariants({ variant: "default" });

  return (
    <MenuItem
      textValue={textValue}
      isDisabled={resolvedDisabled}
      className={composeClassName(slots.item(), className)}
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
    </MenuItem>
  );
}
