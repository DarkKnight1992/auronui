import { createContext } from '../../utils/context'
import type { Ref } from 'vue'
import type { breadcrumbsVariants } from '@auronui/styles'

export type BreadcrumbsSlotFns = ReturnType<typeof breadcrumbsVariants>

export interface BreadcrumbsContext {
  slotFns: Ref<BreadcrumbsSlotFns>
  // Total number of visible BreadcrumbItem children (for aria-current computation)
  total: Ref<number>
  // Custom separator slot function (undefined = use default "/")
  separatorSlot: (() => unknown) | undefined
}

export const {
  useProvide: useBreadcrumbsProvide,
  useInject: useBreadcrumbsInject,
  key: breadcrumbsContextKey,
} = createContext<BreadcrumbsContext>('Breadcrumbs')
