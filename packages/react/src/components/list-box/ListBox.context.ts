import type { ListBoxVariants, ListBoxItemVariants } from "@auronui/styles";
import { createStrictContext } from "../../utils";

export interface ListBoxContextValue {
  variant: ListBoxVariants["variant"];
  itemVariant: ListBoxItemVariants["variant"];
  isDisabled: boolean;
  hideSelectedIcon: boolean;
}

export const DEFAULT_LIST_BOX_CONTEXT: ListBoxContextValue = {
  variant: "default",
  itemVariant: "default",
  isDisabled: false,
  hideSelectedIcon: false,
};

export const {
  Provider: ListBoxProvider,
  useStrictContext: useListBoxContext,
} = createStrictContext<ListBoxContextValue>("ListBox");
