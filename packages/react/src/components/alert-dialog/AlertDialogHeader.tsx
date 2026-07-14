import type { ReactNode } from "react";
import { alertDialogVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface AlertDialogHeaderProps {
  children?: ReactNode;
  className?: ClassValue;
}

export function AlertDialogHeader({ children, className }: AlertDialogHeaderProps) {
  const styles = alertDialogVariants();
  return <div className={composeClassName(styles.header(), className)}>{children}</div>;
}
