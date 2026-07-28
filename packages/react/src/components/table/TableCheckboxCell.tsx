import { useEffect, useRef } from "react";
import type { Row, Table as TableInstance, RowData } from "@tanstack/react-table";

/**
 * NOTE: The Vue port composes the shared <Checkbox> component here. Checkbox
 * has not been ported to @auronui/react yet (owned by a parallel batch), so
 * this renders a minimal self-contained native checkbox instead — same
 * markup/indeterminate/aria contract, just without the design-system
 * styling hooks Checkbox would provide. Swap this for the real <Checkbox>
 * once it lands, mirroring the Vue source 1:1.
 */
export interface TableCheckboxCellProps<TData extends RowData = RowData> {
  /** When row is provided, this cell is a body row checkbox. When absent, it's the header select-all. */
  row?: Row<TData>;
  /** Required for the header select-all variant */
  table?: TableInstance<TData>;
  ariaLabel?: string;
}

export function TableCheckboxCell<TData extends RowData = RowData>({
  row,
  table,
  ariaLabel,
}: TableCheckboxCellProps<TData>) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Header select-all is scoped to the *current page* (getIsAllPageRowsSelected/
  // toggleAllPageRowsSelected), not the whole filtered dataset
  // (getIsAllRowsSelected/toggleAllRowsSelected) — otherwise "select all" under
  // client-side pagination silently selects rows on pages the user never saw.
  // When pagination is disabled, TanStack's page row model falls back to the
  // full row model, so these page-scoped APIs are safe to use unconditionally.
  const isIndeterminate = !row && table ? table.getIsSomePageRowsSelected() : false;
  const checked = row ? row.getIsSelected() : table ? table.getIsAllPageRowsSelected() : false;
  const disabled = row ? !row.getCanSelect() : false;

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = isIndeterminate;
  }, [isIndeterminate]);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextChecked = event.currentTarget.checked;
    if (row) {
      row.toggleSelected(nextChecked);
    } else if (table) {
      table.toggleAllPageRowsSelected(nextChecked);
    }
  }

  return (
    <input
      ref={inputRef}
      type="checkbox"
      checked={checked}
      disabled={disabled}
      aria-label={ariaLabel ?? (row ? "Select row" : "Select all rows")}
      onChange={onChange}
      onClick={(event) => event.stopPropagation()}
    />
  );
}
