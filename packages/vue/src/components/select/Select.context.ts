import { createContext } from '../../utils/context'
import type { ComputedRef, Ref } from 'vue'
import type { selectVariants } from '@auronui/styles'

export interface SelectContext {
  isDisabled: Ref<boolean>
  isInvalid: Ref<boolean>
  isReadonly: Ref<boolean>
  isRequired: Ref<boolean>
  fullWidth: Ref<boolean>
  hasLabel: Ref<boolean>
  labelPlacement: Ref<'inside' | 'outside' | 'outside-left'>
  triggerId: Ref<string>
  label: Ref<string | undefined>
  ariaDescribedBy: Ref<string | undefined>
  slots: ComputedRef<ReturnType<typeof selectVariants>>
  /**
   * Persistent registry of item value → display label. SelectItem registers
   * once on first mount and never unregisters — survives SelectContent
   * unmount so SelectValue can show the selected label while the popover
   * is closed (Reka clears its own optionsSet on unmount).
   */
  registerItem: (value: string, label: string) => void
  itemLabel: (value: string | string[] | undefined | null) => string
}

export const {
  useProvide: useSelectProvide,
  useInject: useSelectInject,
  key: selectContextKey,
} = createContext<SelectContext>('Select')
