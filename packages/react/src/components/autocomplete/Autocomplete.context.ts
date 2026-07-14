import type { autocompleteVariants } from "@auronui/styles";
import { createStrictContext } from "../../utils";

export interface AutocompleteContextValue {
  isDisabled: boolean;
  isInvalid: boolean;
  isReadonly: boolean;
  isRequired: boolean;
  isLoading: boolean;
  isFilled: boolean;
  fullWidth: boolean;
  hasLabel: boolean;
  labelPlacement: "inside" | "outside" | "outside-left";
  inputId: string;
  label: string | undefined;
  ariaDescribedBy: string | undefined;
  slots: ReturnType<typeof autocompleteVariants>;
  /** Whether multiple values can be selected. */
  multiple: boolean;
  /** How overflow chips are handled in multiple mode. */
  multipleOverflow: "wrap" | "collapse";
  /** Currently selected values in multiple mode. */
  selectedValues: string[];
  /** Selected value -> label pairs for rendering chips. */
  selectedLabels: Array<{ value: string; label: string }>;
  /** Toggle a value in selectedValues (multiple mode). */
  onMultipleSelect: (value: string) => void;
  /** Remove a single value from selectedValues (multiple mode). */
  removeValue: (value: string) => void;
  /** Clear all selected values and the search term (multiple mode). */
  clearAll: () => void;
  /** Returns true if the given value is in selectedValues. */
  isSelected: (value: string) => boolean;
  /** Current search/filter term. */
  searchTerm: string;
}

export const {
  Provider: AutocompleteProvider,
  useStrictContext: useAutocompleteContext,
} = createStrictContext<AutocompleteContextValue>("Autocomplete");
