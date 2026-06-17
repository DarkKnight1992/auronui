import { createContext } from '../../utils/context'
import type { ComputedRef, Ref } from 'vue'
import type { selectVariants } from '@auronui/styles'

/**
 * Acceptable value for a Select item / model. Numeric values are legitimate
 * (e.g. entity IDs) and are preserved end-to-end — they are only coerced to a
 * string where the underlying contract requires one (Reka `text-value`,
 * registry display labels).
 */
export type SelectItemValue = string | number

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
  multiple: Ref<boolean>
  /**
   * Persistent registry of item value → display label. SelectItem registers
   * once on first mount and never unregisters — survives SelectContent
   * unmount so SelectValue can show the selected label while the popover
   * is closed (Reka clears its own optionsSet on unmount).
   */
  registerItem: (value: SelectItemValue, label: string) => void
  itemLabel: (value: SelectItemValue | SelectItemValue[] | undefined | null) => string
  removeValue: (value: SelectItemValue) => void
}

export const {
  useProvide: useSelectProvide,
  useInject: useSelectInject,
  key: selectContextKey,
} = createContext<SelectContext>('Select')
