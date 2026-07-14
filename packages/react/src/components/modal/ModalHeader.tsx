import type { ReactNode } from "react";
import { modalVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface ModalHeaderProps {
  children?: ReactNode;
  className?: ClassValue;
}

export function ModalHeader({ children, className }: ModalHeaderProps) {
  const styles = modalVariants();
  return <div className={composeClassName(styles.header(), className)}>{children}</div>;
}
