import { createContext } from '../../utils/context'
import type { ComputedRef, Ref } from 'vue'
import type { comboBoxVariants } from '@auronui/styles'

export interface ComboBoxContext {
  isDisabled: Ref<boolean>
  isInvalid: Ref<boolean>
  fullWidth: Ref<boolean>
  slots: ComputedRef<ReturnType<typeof comboBoxVariants>>
  displayValue: ComputedRef<(value: string) => string>
}

export const {
  useProvide: useComboBoxProvide,
  useInject: useComboBoxInject,
  key: comboBoxContextKey,
} = createContext<ComboBoxContext>('ComboBox')
