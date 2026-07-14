import { createStrictContext } from "../../utils";

export interface DropdownContext {
  variant?: "flat" | "solid" | "bordered" | "light" | "faded" | "shadow";
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  closeOnSelect: boolean;
  disableAnimation: boolean;
}

export const DEFAULT_DROPDOWN_CONTEXT: DropdownContext = {
  variant: undefined,
  color: undefined,
  size: undefined,
  closeOnSelect: true,
  disableAnimation: false,
};

/**
 * Mirrors the Vue package's Dropdown.context.ts (provide/inject) 1:1. Note: as in the Vue
 * source, no sub-component currently reads this context — it's provided by <Dropdown> for
 * forward-compatibility but not yet consumed anywhere in the family. Kept for parity.
 */
export const {
  Provider: DropdownProvider,
  useStrictContext: useDropdownContext,
} = createStrictContext<DropdownContext>("Dropdown");
