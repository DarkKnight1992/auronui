import type { ReactNode } from "react";
import { modalVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface ModalFooterProps {
  children?: ReactNode;
  className?: ClassValue;
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  const styles = modalVariants();
  return <div className={composeClassName(styles.footer(), className)}>{children}</div>;
}
