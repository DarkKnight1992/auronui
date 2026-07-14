import type { ReactNode } from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";

export interface ContextMenuSubProps {
  /** The open state of the submenu when it is initially rendered (uncontrolled). */
  defaultOpen?: boolean;
  /** Controlled open state of the submenu. */
  open?: boolean;
  /** Called when the submenu's open state changes. */
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

export function ContextMenuSub({ defaultOpen, open, onOpenChange, children }: ContextMenuSubProps) {
  return (
    <ContextMenuPrimitive.Sub defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
      {children}
    </ContextMenuPrimitive.Sub>
  );
}
