import type { ComputedRef } from 'vue'
import type { InputGroupVariants } from '@auronui/styles'
import { createContext } from '../../utils/context'

export interface InputGroupContext {
  size: ComputedRef<InputGroupVariants['size']>
  isInvalid: ComputedRef<boolean>
  isDisabled: ComputedRef<boolean>
  /** Generated field id, adopted by InputGroupInput as its own id unless overridden. */
  fieldId: ComputedRef<string | undefined>
  /** Points at whichever helper text (error or description) is currently shown, if any. */
  ariaDescribedBy: ComputedRef<string | undefined>
}

export const {
  useProvide: useInputGroupProvide,
  useInject: useInputGroupInject,
  key: inputGroupContextKey,
} = createContext<InputGroupContext>('InputGroup')
