import type { CSSProperties, ReactNode } from "react";
import { Popover, ListBox } from "react-aria-components";
import { useComboBoxContext } from "./ComboBox.context";

export interface ComboBoxContentProps {
  children?: ReactNode;
}

export function ComboBoxContent({ children }: ComboBoxContentProps) {
  const ctx = useComboBoxContext();

  return (
    <Popover
      className={ctx.slots.popover()}
      // See select/SelectContent.tsx: aliases RAC's real `--trigger-width` onto
      // the reka-ui-named variable combo-box.css expects, without touching
      // that shared, Vue-consumed CSS file.
      style={{
        "--reka-combobox-trigger-width": "var(--trigger-width)",
        "--reka-combobox-content-transform-origin": "var(--trigger-anchor-point)",
      } as CSSProperties}
      data-slot="popover"
      placement="bottom start"
    >
      <ListBox data-slot="list-box">{children}</ListBox>
    </Popover>
  );
}
