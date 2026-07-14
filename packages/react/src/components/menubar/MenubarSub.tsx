import type { ReactNode } from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";

export interface MenubarSubProps {
  /** The open state of the submenu when it is initially rendered. */
  defaultOpen?: boolean;
  /** Controlled open state of the submenu. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

export function MenubarSub({ defaultOpen, open, onOpenChange, children }: MenubarSubProps) {
  return (
    <MenubarPrimitive.Sub defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
      {children}
    </MenubarPrimitive.Sub>
  );
}
