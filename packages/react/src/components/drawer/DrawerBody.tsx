import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { drawerVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface DrawerBodyProps extends Omit<ComponentPropsWithoutRef<"div">, "className"> {
  className?: ClassValue;
  children?: ReactNode;
}

export function DrawerBody({ className, children, ...rest }: DrawerBodyProps) {
  const styles = drawerVariants();

  return (
    <div className={composeClassName(styles.body(), className)} {...rest}>
      {children}
    </div>
  );
}
