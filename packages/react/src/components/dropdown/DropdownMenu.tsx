import type { ReactNode } from "react";
import { Menu, Popover, type Key, type Placement, type Selection } from "react-aria-components";
import { dropdownVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface DropdownMenuProps {
  "aria-label"?: string;
  /** Additional offset (px) applied along the main axis between the menu and its trigger. */
  sideOffset?: number;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  /** Additional offset (px) applied along the cross axis. */
  alignOffset?: number;
  className?: ClassValue;
  /** Whether the menu should flip to the opposite side when there isn't enough room. */
  sideFlip?: boolean;
  /** Selection mode for the menu's items (plain action items use "none", the default). */
  selectionMode?: "none" | "single" | "multiple";
  selectedKeys?: Selection;
  defaultSelectedKeys?: Selection;
  onSelectionChange?: (keys: Selection) => void;
  disabledKeys?: Iterable<Key>;
  /** Called when an item without its own onAction is activated. */
  onAction?: (key: Key) => void;
  /** Whether selecting an item closes the dropdown (default true). */
  shouldCloseOnSelect?: boolean;
  /** Whether pressing Escape to close the menu is disabled. */
  isKeyboardDismissDisabled?: boolean;
  /** Filters which outside interactions should close the menu. */
  shouldCloseOnInteractOutside?: (element: Element) => boolean;
  children?: ReactNode;
}

/**
 * Deviation from the Vue API surface: reka-ui/Radix expose granular floating-ui props
 * (collisionBoundary, collisionPadding, sticky, hideWhenDetached, positionStrategy, ...) that
 * have no equivalent in react-aria-components' positioning system (`useOverlayPosition`, a much
 * smaller surface: placement/offset/crossOffset/shouldFlip/containerPadding). Only the props
 * with a direct RAC counterpart are exposed here; side+align collapse into RAC's single
 * `placement` string (e.g. "bottom start").
 */
export function DropdownMenu({
  "aria-label": ariaLabel,
  sideOffset = 8,
  side = "bottom",
  align = "start",
  alignOffset = 0,
  className,
  sideFlip,
  selectionMode = "none",
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  disabledKeys,
  onAction,
  shouldCloseOnSelect,
  isKeyboardDismissDisabled,
  shouldCloseOnInteractOutside,
  children,
}: DropdownMenuProps) {
  const slots = dropdownVariants();
  const placement = `${side} ${align}` as Placement;

  return (
    <Popover
      placement={placement}
      offset={sideOffset}
      crossOffset={alignOffset}
      shouldFlip={sideFlip}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      shouldCloseOnInteractOutside={shouldCloseOnInteractOutside}
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
