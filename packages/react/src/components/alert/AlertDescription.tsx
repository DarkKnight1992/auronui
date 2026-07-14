import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { alertVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface AlertDescriptionOwnProps {
  className?: ClassValue;
  children?: ReactNode;
}

export type AlertDescriptionProps = AlertDescriptionOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof AlertDescriptionOwnProps>;

export function AlertDescription({ className, children, ...rest }: AlertDescriptionProps) {
  const styles = alertVariants();
  return (
    <div className={composeClassName(styles.description(), className)} {...rest}>
      {children}
    </div>
  );
}
