import type { ComputedRef } from 'vue'
import type { ToastVariants } from '@auronui/styles'
import { createContext } from '../../utils/context'

export interface ToastContext {
  variant: ComputedRef<ToastVariants['variant']>
}

export const {
  useProvide: useToastProvide,
  useInject: useToastInject,
  key: toastContextKey,
} = createContext<ToastContext>('Toast')
