import type { CSSProperties, ReactNode } from "react";
import { Popover, ListBox } from "react-aria-components";
import { dataAttr } from "../../utils";
import { useAutocompleteContext } from "./Autocomplete.context";

export interface AutocompleteContentProps {
  emptyContent?: ReactNode;
  children?: ReactNode;
}

export function AutocompleteContent({ emptyContent = "No results found", children }: AutocompleteContentProps) {
  const ctx = useAutocompleteContext();

  return (
    <Popover
      className="autocomplete__popover relative"
      // See select/SelectContent.tsx: aliases RAC's real `--trigger-width` onto
      // the reka-ui-named variable autocomplete.css expects, without touching
      // that shared, Vue-consumed CSS file.
      style={{
        "--reka-combobox-trigger-width": "var(--trigger-width)",
        "--reka-combobox-content-transform-origin": "var(--trigger-anchor-point)",
      } as CSSProperties}
      data-slot="popover"
      placement="bottom start"
    >
      <div data-loading={ctx.isLoading ? "" : undefined} aria-busy={ctx.isLoading || undefined}>
        <div
          className={ctx.isLoading ? "pointer-events-none opacity-50 grayscale cursor-not-allowed select-none transition-opacity duration-150" : "transition-opacity duration-150"}
          aria-disabled={ctx.isLoading || undefined}
          data-disabled={dataAttr(ctx.isLoading)}
          data-slot="list-wrapper"
        >
          <ListBox data-slot="list-box" renderEmptyState={() => <div className="py-3 text-center text-sm text-default-400" data-slot="empty-content">{emptyContent}</div>}>
            {children}
          </ListBox>
        </div>
      </div>
    </Popover>
  );
}
