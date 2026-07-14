import type { ReactNode } from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";

export interface MenubarMenuProps {
  /** A unique value that associates this menu with the Root's active value. Managed automatically when uncontrolled. */
  value?: string;
  children?: ReactNode;
}

export function MenubarMenu({ value, children }: MenubarMenuProps) {
  return <MenubarPrimitive.Menu value={value}>{children}</MenubarPrimitive.Menu>;
}
