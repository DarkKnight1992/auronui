import type { collapsibleVariants } from "@auronui/styles";
import { createStrictContext } from "../../utils";

export type CollapsibleSlotFns = ReturnType<typeof collapsibleVariants>;

export interface CollapsibleContextValue {
  slotFns: CollapsibleSlotFns;
  isOpen: boolean;
  isDisabled: boolean;
  toggle: () => void;
}

export const { Provider: CollapsibleProvider, useStrictContext: useCollapsibleContext } =
  createStrictContext<CollapsibleContextValue>("Collapsible");
