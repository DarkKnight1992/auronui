import type { ReactNode } from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";

export interface ContextMenuProps {
  /** Controlled open state. */
  open?: boolean;
  /** Called when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /**
   * The modality of the context menu. When true, interaction with outside
   * elements is disabled.
   * @default true
   */
  modal?: boolean;
  /** Text direction. */
  dir?: "ltr" | "rtl";
  children?: ReactNode;
}

/**
 * Deviation from the Vue version: `pressOpenDelay` (duration from touch/long-press
 * until the menu opens) has no equivalent on `@radix-ui/react-context-menu` — Radix's
 * context menu only opens via the native `contextmenu` event, it has no built-in
 * long-press timer, so the prop is dropped. Radix also has no `defaultOpen` for
 * ContextMenu (open is either fully controlled via `open`/`onOpenChange` or fully
 * uncontrolled with no initial-open escape hatch), matching the Vue source which
 * never binds `:open` either.
 */
export function ContextMenu({ open, onOpenChange, modal = true, dir, children }: ContextMenuProps) {
  return (
    <ContextMenuPrimitive.Root open={open} onOpenChange={onOpenChange} modal={modal} dir={dir}>
      {children}
    </ContextMenuPrimitive.Root>
  );
}
