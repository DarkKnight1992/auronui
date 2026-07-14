import type { accordionVariants } from "@auronui/styles";
import { createStrictContext } from "../../utils";

// Return shape of accordionVariants({ variant, size }) — each key is a slot function returning a string
export type AccordionSlotFns = ReturnType<typeof accordionVariants>;

export interface AccordionContextValue {
  slotFns: AccordionSlotFns;
}

export const { Provider: AccordionProvider, useStrictContext: useAccordionContext } =
  createStrictContext<AccordionContextValue>("Accordion");
