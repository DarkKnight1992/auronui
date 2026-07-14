import type { ReactNode } from "react";
import { alertDialogVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { ScrollArea } from "../scroll-area/ScrollArea";

export interface AlertDialogBodyProps {
  children?: ReactNode;
  className?: ClassValue;
}

/** Mirrors Vue's AlertDialogBody.vue, which wraps its content in `ScrollArea` for a scrollable, max-height-capped body. */
export function AlertDialogBody({ children, className }: AlertDialogBodyProps) {
  const styles = alertDialogVariants();
  return (
    <ScrollArea className={composeClassName(styles.body(), className)} viewportClassName="pr-2">
      {children}
    </ScrollArea>
  );
}
