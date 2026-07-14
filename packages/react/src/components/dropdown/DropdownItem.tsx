import type { ReactNode } from "react";
import { MenuItem, type Key } from "react-aria-components";
import { menuItemVariants, type MenuItemVariants } from "@auronui/styles";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";

export interface DropdownItemProps {
  id?: Key;
  textValue?: string;
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  variant?: MenuItemVariants["variant"];
  shortcut?: string;
  description?: string;
  className?: ClassValue;
  startContent?: ReactNode;
  endContent?: ReactNode;
  onAction?: () => void;
  children?: ReactNode;
}

export function DropdownItem({
  id,
  textValue,
  isDisabled,
  disabled,
  variant = "default",
  shortcut,
  description,
  className,
  startContent,
  endContent,
  onAction,
  children,
}: DropdownItemProps) {
  const resolvedDisabled = resolveDeprecatedBooleanProp(
    "DropdownItem",
    "isDisabled",
    isDisabled,
    "disabled",
    disabled,
  );

  const slots = menuItemVariants({ variant });

  return (
    <MenuItem
      id={id}
      textValue={textValue}
      isDisabled={resolvedDisabled}
      className={composeClassName(slots.item(), className)}
      onAction={onAction}
    >
      {startContent}

      <div className="flex flex-1 flex-col">
        <span data-slot="label">{children}</span>
        {description && <span data-slot="description">{description}</span>}
      </div>

      {/* Raw <kbd> (not <Kbd>): a menu shortcut renders as plain muted text; <Kbd> applies a
          boxed keycap style that would break visual parity with HeroUI's menu shortcuts. */}
      {shortcut && (
        <kbd data-slot="shortcut" className="ml-auto text-xs text-muted font-mono">
          {shortcut}
        </kbd>
      )}

      {endContent}
    </MenuItem>
  );
}
