import type { CSSProperties, ReactNode } from "react";
import { Popover, ListBox } from "react-aria-components";
import { useSelectContext } from "./Select.context";

export interface SelectContentProps {
  children?: ReactNode;
}

export function SelectContent({ children }: SelectContentProps) {
  const ctx = useSelectContext();

  return (
    <Popover
      className={ctx.slots.popover()}
      // select.css sizes the panel via `width: var(--trigger-width)`, itself
      // aliased from reka-ui's `--reka-select-trigger-width` — a variable RAC
      // never sets, so it silently resolved to nothing (the panel shrank to
      // fit its content instead of matching the trigger's width). RAC's
      // `Popover` *does* compute a real `--trigger-width` of its own; alias
      // reka's expected name onto it here rather than touching the shared,
      // Vue-consumed CSS file. Same pattern as `NavigationMenuViewport`.
      style={{
        "--reka-select-trigger-width": "var(--trigger-width)",
        "--reka-select-content-transform-origin": "var(--trigger-anchor-point)",
      } as CSSProperties}
      data-slot="popover"
      placement="bottom start"
    >
      <ListBox data-slot="list-box">{children}</ListBox>
    </Popover>
  );
}
