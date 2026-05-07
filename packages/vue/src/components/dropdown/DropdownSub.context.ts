import { createContext } from '../../utils/context'
import type { Ref } from 'vue'

export interface DropdownSubContext {
  openOnHover: Ref<boolean>
  open: Ref<boolean>
  setOpen: (value: boolean) => void
}

export const {
  useProvide: useDropdownSubProvide,
  useInject: useDropdownSubInject,
} = createContext<DropdownSubContext>('DropdownSub')
