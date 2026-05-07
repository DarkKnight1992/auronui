import { createContext } from '../../utils/context'
import type { Ref } from 'vue'

export interface AvatarGroupContext {
  size: Ref<'sm' | 'md' | 'lg'>
  isBordered: Ref<boolean>
  isDisabled: Ref<boolean>
  isGrid: Ref<boolean>
  isInGroup: Ref<boolean>
}

export const {
  useProvide: useAvatarGroupProvide,
  useInject: useAvatarGroupInject,
  key: avatarGroupContextKey,
} = createContext<AvatarGroupContext>('AvatarGroup')
