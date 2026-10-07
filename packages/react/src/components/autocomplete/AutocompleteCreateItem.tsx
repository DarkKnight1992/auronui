import { ListBoxItem as RACListBoxItem } from "react-aria-components";
import { listboxItemVariants, autocompleteVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { useAutocompleteContext } from "./Autocomplete.context";

/**
 * Collection key of the create row. Kept constant (not derived from the term)
 * because react-aria's collection forbids an item's id from changing while it
 * stays mounted — a term-based id threw on the second keystroke. Autocomplete
 * ignores this key in its selection handlers; the row commits via onAction.
 */
export const CREATE_ITEM_ID = "__autocomplete_create__";

export interface AutocompleteCreateItemProps {
  /** Label for the create item. Accepts a static string or a function receiving the current search term. */
  label?: string | ((term: string) => string);
  className?: ClassValue;
  /**
   * Whether an item matching the current term already exists — hides this row when true.
   * Defaults to the parent Autocomplete's own exact-match check.
   */
  hasExactMatch?: boolean;
  /** Overrides the parent Autocomplete's create handling (which commits the term and fires its `onCreate`). */
  onCreate?: (term: string) => void;
}

export function AutocompleteCreateItem({ label, className, hasExactMatch, onCreate }: AutocompleteCreateItemProps) {
  const ctx = useAutocompleteContext();
  const itemSlots = listboxItemVariants();
  const itemTextClass = autocompleteVariants().itemText();

  const term = ctx.searchTerm.trim();
  const isVisible = !!term && !(hasExactMatch ?? ctx.hasExactMatch);
  if (!isVisible) return null;

  const displayLabel = typeof label === "function" ? label(term) : (label ?? `Create "${term}"`);

  return (
    <RACListBoxItem
      id={CREATE_ITEM_ID}
      textValue={term}
      data-slot="list-box-item"
      data-create-item
      className={composeClassName(itemSlots.item(), className)}
      onAction={() => (onCreate ?? ctx.onCreateValue)(term)}
    >
      <span className={itemTextClass} data-slot="item-text">
        {displayLabel}
      </span>
    </RACListBoxItem>
  );
}
