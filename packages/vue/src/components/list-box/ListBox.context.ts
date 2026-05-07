import { createContext } from '../../utils/context'
import type { Ref } from 'vue'
import type { ListBoxVariants } from '@auronui/styles'
import type { ListBoxItemVariants } from '@auronui/styles'

export interface ListBoxContext {
  variant: Ref<ListBoxVariants['variant']>
  itemVariant: Ref<ListBoxItemVariants['variant']>
  isDisabled: Ref<boolean>
}

export const {
  useProvide: useListBoxProvide,
  useInject: useListBoxInject,
  key: listBoxContextKey,
} = createContext<ListBoxContext>('ListBox')
