import { createContext } from '../../utils/context'
import type { Ref } from 'vue'

export type DrawerPlacement = 'top' | 'right' | 'bottom' | 'left'
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface DrawerContext {
  placement: Ref<DrawerPlacement>
  size: Ref<DrawerSize>
}

export const {
  useProvide: useDrawerProvide,
  useInject: useDrawerInject,
  key: DrawerContextKey,
} = createContext<DrawerContext>('Drawer')
