import { createContext } from '../../utils/context'
import type { Ref } from 'vue'
import type { SurfaceVariants } from '@auronui/styles'

export interface SurfaceContext {
  variant: Ref<SurfaceVariants['variant']>
}

export const {
  useProvide: useSurfaceProvide,
  useInject: useSurfaceInject,
  key: surfaceContextKey,
} = createContext<SurfaceContext>('Surface')
