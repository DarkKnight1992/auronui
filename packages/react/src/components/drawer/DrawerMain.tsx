import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { drawerVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface DrawerMainProps extends Omit<ComponentPropsWithoutRef<"div">, "className"> {
  className?: ClassValue;
  children?: ReactNode;
}

/**
 * Wraps the main content area inside a dock `Drawer`. Fills the remaining flex space and stays
 * visible while the drawer panel slides in alongside it.
 *
 * Usage:
 *   <Drawer dock placement="right">
 *     <DrawerMain>{...pageContent}</DrawerMain>
 *     <DrawerContent>...</DrawerContent>
 *   </Drawer>
 */
export function DrawerMain({ className, children, ...rest }: DrawerMainProps) {
  const styles = drawerVariants();

  return (
    <div className={composeClassName(styles.main(), className)} {...rest}>
      {children}
    </div>
  );
}
