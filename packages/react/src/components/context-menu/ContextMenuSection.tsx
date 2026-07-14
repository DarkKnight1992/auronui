import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { menuSectionVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface ContextMenuSectionOwnProps {
  title?: string;
  showDivider?: boolean;
  className?: ClassValue;
  /** Merge props onto the single child element instead of rendering Radix's own group wrapper. */
  asChild?: boolean;
  children?: ReactNode;
}

export type ContextMenuSectionProps = ContextMenuSectionOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof ContextMenuSectionOwnProps>;

export const ContextMenuSection = forwardRef<HTMLDivElement, ContextMenuSectionProps>(
  function ContextMenuSection(
    { title, showDivider = false, className, asChild = false, children, ...rest },
    ref,
  ) {
    const slots = menuSectionVariants();

    return (
      <ContextMenuPrimitive.Group
        ref={ref}
        asChild={asChild}
        className={composeClassName(slots.base(), className)}
        {...rest}
      >
        {title && (
          <ContextMenuPrimitive.Label
            className={composeClassName(
              slots.label(),
              "px-2 py-1 text-[10px] font-semibold tracking-widest text-default-200 uppercase",
            )}
          >
            {title}
          </ContextMenuPrimitive.Label>
        )}
        {children}
        {showDivider && <ContextMenuPrimitive.Separator className={slots.separator()} />}
      </ContextMenuPrimitive.Group>
    );
  },
);
