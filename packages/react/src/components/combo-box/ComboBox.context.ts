import type { comboBoxVariants } from "@auronui/styles";
import { createStrictContext } from "../../utils";

export interface ComboBoxContextValue {
  isDisabled: boolean;
  isInvalid: boolean;
  fullWidth: boolean;
  slots: ReturnType<typeof comboBoxVariants>;
  /** Whether the input currently has a value (drives the clear button's data-empty state). */
  hasValue: boolean;
  /** Clears the input value / selection. */
  clearValue: () => void;
}

export const {
  Provider: ComboBoxProvider,
  useStrictContext: useComboBoxContext,
} = createStrictContext<ComboBoxContextValue>("ComboBox");
