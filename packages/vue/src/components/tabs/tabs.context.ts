import { createContext } from '../../utils/context'
import type { Ref } from 'vue'
import type { tabsVariants } from '@auronui/styles'

// Return shape of tabsVariants({ variant }) — each key is a slot function that returns a string
export type TabsSlotFns = ReturnType<typeof tabsVariants>

export interface TabsContext {
  slotFns: Ref<TabsSlotFns>
  orientation: Ref<'horizontal' | 'vertical'>
}

export const {
  useProvide: useTabsProvide,
  useInject: useTabsInject,
  key: tabsContextKey,
} = createContext<TabsContext>('Tabs')
