import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { alertVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface AlertIconOwnProps {
  className?: ClassValue;
  children?: ReactNode;
}

export type AlertIconProps = AlertIconOwnProps &
  Omit<ComponentPropsWithoutRef<"span">, keyof AlertIconOwnProps>;

export function AlertIcon({ className, children, ...rest }: AlertIconProps) {
  const styles = alertVariants();
  return (
    <span className={composeClassName(styles.indicator(), className)} aria-hidden="true" {...rest}>
      {children}
    </span>
  );
}
