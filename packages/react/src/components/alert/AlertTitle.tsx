import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { alertVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface AlertTitleOwnProps {
  className?: ClassValue;
  children?: ReactNode;
}

export type AlertTitleProps = AlertTitleOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof AlertTitleOwnProps>;

export function AlertTitle({ className, children, ...rest }: AlertTitleProps) {
  const styles = alertVariants();
  return (
    <div className={composeClassName(styles.title(), className)} {...rest}>
      {children}
    </div>
  );
}
