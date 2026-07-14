import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { Heading } from "react-aria-components";
import { drawerVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { useDrawerContext } from "./drawer.context";

export interface DrawerTitleProps extends Omit<ComponentPropsWithoutRef<"h2">, "className"> {
  as?: ElementType;
  className?: ClassValue;
  children?: ReactNode;
}

/**
 * In dock mode there is no `Dialog` context (no react-aria-components dialog machinery at all),
 * so this renders a plain heading. In default / inline / hideBackdrop modes it renders
 * react-aria-components' `Heading` with `slot="title"`, which `Dialog` automatically wires up as
 * the dialog's accessible name via `aria-labelledby`.
 */
export function DrawerTitle({ as = "h2", className, children, ...rest }: DrawerTitleProps) {
  const ctx = useDrawerContext();
  const styles = drawerVariants();
  const Comp = as as ElementType;

  if (ctx.dock) {
    return (
      <Comp className={composeClassName(styles.heading(), className)} {...rest}>
        {children}
      </Comp>
    );
  }

  // react-aria-components' Heading renders h1-h6 based on `level` (Dialog's title slot context
  // sets level=2 automatically) — unlike reka-ui's Primitive, it has no arbitrary `as` escape
  // hatch, so a custom `as` is only honored in dock mode above.
  return (
    <Heading slot="title" className={composeClassName(styles.heading(), className)} {...rest}>
      {children}
    </Heading>
  );
}
