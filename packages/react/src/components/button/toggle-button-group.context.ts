import type { ToggleButtonVariants } from "@auronui/styles";
import { createStrictContext } from "../../utils";

export type ToggleButtonGroupSelectionMode = "single" | "multiple";

export interface ToggleButtonGroupContext {
  variant: ToggleButtonVariants["variant"];
  size: ToggleButtonVariants["size"];
  disabled: boolean;
  fullWidth: boolean;
  orientation: "horizontal" | "vertical";
  selectionMode: ToggleButtonGroupSelectionMode;
  selectedValues: string[];
  toggleValue: (value: string) => void;
}

export const DEFAULT_TOGGLE_BUTTON_GROUP_CONTEXT: ToggleButtonGroupContext = {
  variant: "default",
  size: "md",
  disabled: false,
  fullWidth: false,
  orientation: "horizontal",
  selectionMode: "multiple",
  selectedValues: [],
  toggleValue: () => {},
};

export const {
  Provider: ToggleButtonGroupProvider,
  useStrictContext: useToggleButtonGroupContext,
} = createStrictContext<ToggleButtonGroupContext>("ToggleButtonGroup");
