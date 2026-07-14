import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { drawerVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface DrawerHeaderProps extends Omit<ComponentPropsWithoutRef<"div">, "className"> {
  className?: ClassValue;
  children?: ReactNode;
}

export function DrawerHeader({ className, children, ...rest }: DrawerHeaderProps) {
  const styles = drawerVariants();

  return (
    <div className={composeClassName(styles.header(), className)} {...rest}>
      {children}
    </div>
  );
}
