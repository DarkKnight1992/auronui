import { createContext } from '../../utils/context'
import type { ComputedRef } from 'vue'

export interface AccordionItemContext {
  open: ComputedRef<boolean>
}

export const {
  useProvide: useAccordionItemProvide,
  useInject: useAccordionItemInject,
  key: accordionItemContextKey,
} = createContext<AccordionItemContext>('AccordionItem')
