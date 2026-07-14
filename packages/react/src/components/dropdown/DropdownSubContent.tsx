import type { ReactNode } from "react";
import { Menu, Popover, type Key, type Selection } from "react-aria-components";
import { dropdownVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface DropdownSubContentProps {
  "aria-label"?: string;
  sideOffset?: number;
  alignOffset?: number;
  className?: ClassValue;
  selectionMode?: "none" | "single" | "multiple";
  selectedKeys?: Selection;
  defaultSelectedKeys?: Selection;
  onSelectionChange?: (keys: Selection) => void;
  disabledKeys?: Iterable<Key>;
  onAction?: (key: Key) => void;
  shouldCloseOnSelect?: boolean;
  children?: ReactNode;
}

export function DropdownSubContent({
  "aria-label": ariaLabel,
  sideOffset = 4,
  alignOffset = -5,
  className,
  selectionMode = "none",
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  disabledKeys,
  onAction,
  shouldCloseOnSelect,
  children,
}: DropdownSubContentProps) {
  const slots = dropdownVariants();

  return (
    <Popover
      placement="right top"
      offset={sideOffset}
      crossOffset={alignOffset}
      className={composeClassName(slots.popover(), className)}
    >
      <Menu
        aria-label={ariaLabel}
        className={slots.menu()}
        selectionMode={selectionMode}
        selectedKeys={selectedKeys}
        defaultSelectedKeys={defaultSelectedKeys}
        onSelectionChange={onSelectionChange}
        disabledKeys={disabledKeys}
        onAction={onAction}
        shouldCloseOnSelect={shouldCloseOnSelect}
      >
        {children}
      </Menu>
    </Popover>
  );
}
