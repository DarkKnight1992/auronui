import { ListBoxItem as RACListBoxItem } from "react-aria-components";
import { listboxItemVariants, autocompleteVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { useAutocompleteContext } from "./Autocomplete.context";

export interface AutocompleteCreateItemProps {
  /** Label for the create item. Accepts a static string or a function receiving the current search term. */
  label?: string | ((term: string) => string);
  className?: ClassValue;
  /** Whether an item matching the current term already exists — hides this row when true. */
  hasExactMatch?: boolean;
  onCreate?: (term: string) => void;
}

export function AutocompleteCreateItem({ label, className, hasExactMatch = false, onCreate }: AutocompleteCreateItemProps) {
  const ctx = useAutocompleteContext();
  const itemSlots = listboxItemVariants();
  const itemTextClass = autocompleteVariants().itemText();

  const term = ctx.searchTerm.trim();
  const isVisible = !!term && !hasExactMatch;
  if (!isVisible) return null;

  const displayLabel = typeof label === "function" ? label(term) : (label ?? `Create "${term}"`);

  return (
    <RACListBoxItem
      id={`__create__${term}`}
      textValue={term}
      data-slot="list-box-item"
      data-create-item
      className={composeClassName(itemSlots.item(), className)}
      onAction={() => onCreate?.(term)}
    >
      <span className={itemTextClass} data-slot="item-text">
        {displayLabel}
      </span>
    </RACListBoxItem>
  );
}
