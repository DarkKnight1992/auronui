import { createContext } from '../../utils/context'
import type { Ref } from 'vue'

export interface ToolbarContext {
  orientation: Ref<'horizontal' | 'vertical'>
}

export const {
  useProvide: useToolbarProvide,
  useInject: useToolbarInject,
} = createContext<ToolbarContext>('Toolbar')
