import type { ButtonVariants } from "@auronui/styles";
import { createStrictContext } from "../../utils";

export type ButtonGroupSelectionMode = "single" | "multiple";
export type ButtonGroupValue = string | number | null | Array<string | number>;

export interface ButtonGroupContext {
  variant: ButtonVariants["variant"];
  color: ButtonVariants["color"];
  size: ButtonVariants["size"];
  disabled: boolean;
  fullWidth: boolean;
  orientation: "horizontal" | "vertical";
  selectionMode: ButtonGroupSelectionMode;
  selectedValue: ButtonGroupValue;
  isValueSelected: (value: string | number | undefined) => boolean;
  selectValue: (value: string | number) => void;
}

export const DEFAULT_BUTTON_GROUP_CONTEXT: ButtonGroupContext = {
  variant: "solid",
  color: "primary",
  size: "md",
  disabled: false,
  fullWidth: false,
  orientation: "horizontal",
  selectionMode: "single",
  selectedValue: null,
  isValueSelected: () => false,
  selectValue: () => {},
};

export const {
  Provider: ButtonGroupProvider,
  useStrictContext: useButtonGroupContext,
} = createStrictContext<ButtonGroupContext>("ButtonGroup");
