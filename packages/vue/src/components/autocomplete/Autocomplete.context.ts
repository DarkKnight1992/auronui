import { createContext } from '../../utils/context'
import type { ComputedRef, Ref } from 'vue'
import type { autocompleteVariants } from '@auronui/styles'

export interface AutocompleteContext {
  isDisabled: Ref<boolean>
  isInvalid: Ref<boolean>
  isReadonly: Ref<boolean>
  isRequired: Ref<boolean>
  isLoading: Ref<boolean>
  isFilled: Ref<boolean>
  fullWidth: Ref<boolean>
  hasLabel: Ref<boolean>
  labelPlacement: Ref<'inside' | 'outside' | 'outside-left'>
  inputId: Ref<string>
  label: Ref<string | undefined>
  ariaDescribedBy: Ref<string | undefined>
  truncateItems: Ref<boolean>
  hasItems: Ref<boolean>
  slots: ComputedRef<ReturnType<typeof autocompleteVariants>>
  /**
   * Called by AutocompleteItem at mount time to register a value→label pair.
   * Used by the bridge's valueFor() when no `items` prop entry matches.
   */
  registerItem: (value: string, label: string) => void
  /**
   * Called by AutocompleteItem at unmount time to deregister.
   */
  unregisterItem: (value: string) => void
}

export const {
  useProvide: useAutocompleteProvide,
  useInject: useAutocompleteInject,
  key: autocompleteContextKey,
} = createContext<AutocompleteContext>('Autocomplete')
