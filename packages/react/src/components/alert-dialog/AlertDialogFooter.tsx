import type { ReactNode } from "react";
import { alertDialogVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface AlertDialogFooterProps {
  children?: ReactNode;
  className?: ClassValue;
}

export function AlertDialogFooter({ children, className }: AlertDialogFooterProps) {
  const styles = alertDialogVariants();
  return <div className={composeClassName(styles.footer(), className)}>{children}</div>;
}
