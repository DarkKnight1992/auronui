import type { ReactNode } from "react";
import { Heading } from "react-aria-components";
import { modalVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface ModalTitleProps {
  children?: ReactNode;
  className?: ClassValue;
}

/**
 * Renders react-aria-components' `<Heading slot="title">` so `Dialog`'s
 * built-in `useDialog()` picks it up as the accessible name (`aria-labelledby`)
 * automatically — the React equivalent of reka-ui's `DialogTitle`.
 */
export function ModalTitle({ children, className }: ModalTitleProps) {
  const styles = modalVariants();
  return (
    <Heading slot="title" className={composeClassName(styles.heading(), className)}>
      {children}
    </Heading>
  );
}
