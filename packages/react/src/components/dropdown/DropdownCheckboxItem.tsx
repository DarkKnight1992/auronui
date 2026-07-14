import { useId, useState, type ReactNode } from "react";
import { MenuItem, MenuSection, type Key, type Selection } from "react-aria-components";
import { menuItemVariants } from "@auronui/styles";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";

export interface DropdownCheckboxItemProps {
  id?: Key;
  textValue?: string;
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  variant?: "default" | "danger";
  className?: ClassValue;
  /** Controlled checked state. */
  isSelected?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (isSelected: boolean) => void;
  children?: ReactNode;
}

/**
 * Deviation from the Vue API surface: reka-ui's DropdownMenuCheckboxItem is independently
 * controlled per-item, uncoupled from other items in the menu. react-aria-components computes
 * a MenuItem's `role`/`aria-checked` purely from its nearest ancestor Menu/MenuSection's
 * `selectionMode` (see react-aria's `useMenuItem`, which hard-codes `role` from
 * `selectionManager.selectionMode` — passing `role`/`aria-checked` directly as MenuItem props
 * does NOT work, they get silently overridden by the library's own computed props). There is no
 * per-item selection primitive in RAC. To get real `role="menuitemcheckbox"` +
 * `aria-checked` semantics (accessibility is non-negotiable per project convention), each
 * DropdownCheckboxItem wraps its single MenuItem in its own single-item
 * `<MenuSection selectionMode="multiple">`, controlled independently of any other item. This
 * does introduce one extra `<section role="group">` DOM wrapper per checkbox item versus the
 * Vue output (a flat `<div role="menuitemcheckbox">`); the CSS `.menu-item` rules still apply
 * unchanged since they target the inner MenuItem, not the wrapper.
 */
export function DropdownCheckboxItem({
  id,
  textValue,
  isDisabled,
  disabled,
  variant = "default",
  className,
  isSelected,
  defaultSelected = false,
  onSelectedChange,
  children,
}: DropdownCheckboxItemProps) {
  const resolvedDisabled = resolveDeprecatedBooleanProp(
    "DropdownCheckboxItem",
    "isDisabled",
    isDisabled,
    "disabled",
    disabled,
  );

  const generatedId = useId();
  const itemKey: Key = id ?? generatedId;

  const [uncontrolledSelected, setUncontrolledSelected] = useState(defaultSelected);
  const checked = isSelected ?? uncontrolledSelected;

  const slots = menuItemVariants({ variant });

  function handleSelectionChange(keys: Selection) {
    const next = keys === "all" ? true : keys.has(itemKey);
    setUncontrolledSelected(next);
    onSelectedChange?.(next);
  }

  return (
    <MenuSection
      selectionMode="multiple"
      selectedKeys={checked ? [itemKey] : []}
      onSelectionChange={handleSelectionChange}
    >
      <MenuItem
        id={itemKey}
        textValue={textValue}
        isDisabled={resolvedDisabled}
        className={composeClassName(slots.item(), className)}
      >
        <span className={slots.indicator()} data-state={checked ? "checked" : "unchecked"}>
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
        </span>

        {children}
      </MenuItem>
    </MenuSection>
  );
}
