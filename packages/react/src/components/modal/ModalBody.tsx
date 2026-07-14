import type { ReactNode } from "react";
import { modalVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { useModalContext } from "./modal.context";

export interface ModalBodyProps {
  children?: ReactNode;
  className?: ClassValue;
}

export function ModalBody({ children, className }: ModalBodyProps) {
  const ctx = useModalContext();
  const styles = modalVariants();
  return <div className={composeClassName(styles.body({ scroll: ctx.scroll }), className)}>{children}</div>;
}
