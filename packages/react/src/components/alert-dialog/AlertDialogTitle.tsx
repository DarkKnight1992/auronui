import type { ReactNode } from "react";
import { Heading } from "react-aria-components";
import { alertDialogVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface AlertDialogTitleProps {
  children?: ReactNode;
  className?: ClassValue;
}

/** Renders react-aria-components' `<Heading slot="title">` so `Dialog`'s `useDialog()` wires `aria-labelledby` automatically. */
export function AlertDialogTitle({ children, className }: AlertDialogTitleProps) {
  const styles = alertDialogVariants();
  return (
    <Heading slot="title" className={composeClassName(styles.heading(), className)}>
      {children}
    </Heading>
  );
}
