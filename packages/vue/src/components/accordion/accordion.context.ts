import { createContext } from '../../utils/context'
import type { Ref } from 'vue'
import type { accordionVariants } from '@auronui/styles'

// Return shape of accordionVariants({ variant }) — each key is a slot function that returns a string
export type AccordionSlotFns = ReturnType<typeof accordionVariants>

export interface AccordionContext {
  slotFns: Ref<AccordionSlotFns>
}

export const {
  useProvide: useAccordionProvide,
  useInject: useAccordionInject,
  key: accordionContextKey,
} = createContext<AccordionContext>('Accordion')
