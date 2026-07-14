import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { drawerVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface DrawerFooterProps extends Omit<ComponentPropsWithoutRef<"div">, "className"> {
  className?: ClassValue;
  children?: ReactNode;
}

export function DrawerFooter({ className, children, ...rest }: DrawerFooterProps) {
  const styles = drawerVariants();

  return (
    <div className={composeClassName(styles.footer(), className)} {...rest}>
      {children}
    </div>
  );
}
