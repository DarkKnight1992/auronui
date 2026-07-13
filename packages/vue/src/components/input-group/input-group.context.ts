import type { ComputedRef } from 'vue'
import type { InputGroupVariants } from '@auronui/styles'
import { createContext } from '../../utils/context'

export interface InputGroupContext {
  size: ComputedRef<InputGroupVariants['size']>
  isInvalid: ComputedRef<boolean>
  isDisabled: ComputedRef<boolean>
}

export const {
  useProvide: useInputGroupProvide,
  useInject: useInputGroupInject,
  key: inputGroupContextKey,
} = createContext<InputGroupContext>('InputGroup')
