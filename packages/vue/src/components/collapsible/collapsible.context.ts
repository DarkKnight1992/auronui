import { createContext } from '../../utils/context'
import type { Ref } from 'vue'
import type { collapsibleVariants } from '@auronui/styles'

export type CollapsibleSlotFns = ReturnType<typeof collapsibleVariants>

export interface CollapsibleContext {
  slotFns: Ref<CollapsibleSlotFns>
  // Live open state ref, provided by Collapsible root so child parts can react
  isOpen: Ref<boolean>
}

export const {
  useProvide: useCollapsibleProvide,
  useInject: useCollapsibleInject,
  key: collapsibleContextKey,
} = createContext<CollapsibleContext>('Collapsible')
