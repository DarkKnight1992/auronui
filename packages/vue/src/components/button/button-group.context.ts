import { createContext } from '../../utils/context'
import type { Ref } from 'vue'
import type { ButtonVariants } from '@auronui/styles'

export type ButtonGroupSelectionMode = 'single' | 'multiple'
export type ButtonGroupValue = string | number | null | Array<string | number>

export interface ButtonGroupContext {
  variant: Ref<ButtonVariants['variant']>
  color: Ref<ButtonVariants['color']>
  size: Ref<ButtonVariants['size']>
  disabled: Ref<boolean>
  fullWidth: Ref<boolean>
  orientation: Ref<'horizontal' | 'vertical'>
  selectionMode: Ref<ButtonGroupSelectionMode>
  selectedValue: Ref<ButtonGroupValue>
  isValueSelected: (value: string | number | undefined) => boolean
  selectValue: (value: string | number) => void
}

export const {
  useProvide: useButtonGroupProvide,
  useInject: useButtonGroupInject,
  key: buttonGroupContextKey,
} = createContext<ButtonGroupContext>('ButtonGroup')
