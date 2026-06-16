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
  /** Whether multiple values can be selected. */
  multiple: Ref<boolean>
  /**
   * How overflow chips are handled in multiple mode.
   * - `wrap`: trigger grows in height, chips wrap to new lines (default)
   * - `collapse`: fixed height, overflowing chips are hidden behind a "+N more" badge
   */
  multipleOverflow: Ref<'wrap' | 'collapse'>
  /** Currently selected values in multiple mode. */
  selectedValues: Ref<string[]>
  /** Selected value→label pairs for rendering chips. */
  selectedLabels: ComputedRef<Array<{ value: string; label: string }>>
  /** Toggle a value in the selectedValues array (multiple mode). */
  onMultipleSelect: (value: string) => void
  /** Remove a single value from selectedValues (multiple mode). */
  removeValue: (value: string) => void
  /** Clear all selected values and the search term (multiple mode). */
  clearAll: () => void
  /** Returns true if the given value is in selectedValues. */
  isSelected: (value: string) => boolean
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
