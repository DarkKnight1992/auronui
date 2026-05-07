import { createContext } from '../../utils/context'
import type { Ref } from 'vue'
import type { ToggleButtonVariants } from '@auronui/styles'

export interface ToggleButtonGroupContext {
  size: Ref<ToggleButtonVariants['size']>
  variant: Ref<ToggleButtonVariants['variant']>
  disabled: Ref<boolean>
  fullWidth: Ref<boolean>
  orientation: Ref<'horizontal' | 'vertical'>
  selectionMode: Ref<'single' | 'multiple'>
  selectedValues: Ref<string[]>
  toggleValue: (value: string) => void
}

export const {
  useProvide: useToggleButtonGroupProvide,
  useInject: useToggleButtonGroupInject,
  key: toggleButtonGroupContextKey,
} = createContext<ToggleButtonGroupContext>('ToggleButtonGroup')
