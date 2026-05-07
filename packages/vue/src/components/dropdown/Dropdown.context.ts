import { createContext } from '../../utils/context'
import type { Ref } from 'vue'

export interface DropdownContext {
  variant: Ref<'flat' | 'solid' | 'bordered' | 'light' | 'faded' | 'shadow' | undefined>
  color: Ref<'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | undefined>
  size: Ref<'sm' | 'md' | 'lg' | undefined>
  closeOnSelect: Ref<boolean>
  disableAnimation: Ref<boolean>
}

export const {
  useProvide: useDropdownProvide,
  useInject: useDropdownInject,
  key: dropdownContextKey,
} = createContext<DropdownContext>('Dropdown')
