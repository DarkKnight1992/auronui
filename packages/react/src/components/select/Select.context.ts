import type { selectVariants } from "@auronui/styles";
import { createStrictContext } from "../../utils";

/** Acceptable value for a Select item / model. Numeric values are preserved end-to-end. */
export type SelectItemValue = string | number;

export interface SelectItemData {
  value: SelectItemValue;
  label?: string;
  textValue?: string;
  isDisabled?: boolean;
}

export interface SelectContextValue {
  isDisabled: boolean;
  isInvalid: boolean;
  isReadonly: boolean;
  isRequired: boolean;
  fullWidth: boolean;
  hasLabel: boolean;
  labelPlacement: "inside" | "outside" | "outside-left";
  triggerId: string;
  label: string | undefined;
  ariaDescribedBy: string | undefined;
  slots: ReturnType<typeof selectVariants>;
  multiple: boolean;
  isFilled: boolean;
  itemLabel: (value: SelectItemValue | SelectItemValue[] | undefined | null) => string;
  removeValue: (value: SelectItemValue) => void;
}

export const {
  Provider: SelectProvider,
  useStrictContext: useSelectContext,
} = createStrictContext<SelectContextValue>("Select");
