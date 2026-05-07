import { createContext } from '../../utils/context'
import type { Ref } from 'vue'
import type { TagVariants } from '@auronui/styles'

export interface TagGroupContext {
  variant: Ref<TagVariants['variant']>
  size: Ref<TagVariants['size']>
  isDisabled: Ref<boolean>
  readOnly: Ref<boolean>
}

export const {
  useProvide: useTagGroupProvide,
  useInject: useTagGroupInject,
  key: tagGroupContextKey,
} = createContext<TagGroupContext>('TagGroup')
