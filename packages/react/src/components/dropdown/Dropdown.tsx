import type { ReactNode } from "react";
import { MenuTrigger } from "react-aria-components";
import { DropdownProvider, type DropdownContext } from "./Dropdown.context";

export interface DropdownProps {
  /** Controlled open state of the dropdown (canonical). */
  open?: boolean;
  /** @deprecated Use `open` instead. */
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  variant?: DropdownContext["variant"];
  color?: DropdownContext["color"];
  size?: DropdownContext["size"];
  closeOnSelect?: boolean;
  disableAnimation?: boolean;
  children: ReactNode;
}

/**
 * Root of the Dropdown compound component. Wraps react-aria-components' MenuTrigger, which
 * expects exactly two children: a trigger element (<DropdownTrigger>) and the menu content
 * (<DropdownMenu>) — this mirrors the Vue package's slot-based API 1:1.
 */
export function Dropdown({
  open,
  isOpen,
  defaultOpen,
  onOpenChange,
  variant,
  color,
  size,
  closeOnSelect = true,
  disableAnimation = false,
  children,
}: DropdownProps) {
  const resolvedOpen = open ?? isOpen;

  return (
    <DropdownProvider value={{ variant, color, size, closeOnSelect, disableAnimation }}>
      <MenuTrigger isOpen={resolvedOpen} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        {children}
      </MenuTrigger>
    </DropdownProvider>
  );
}
