import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { menuSectionVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface MenubarSectionOwnProps {
  title?: string;
  showDivider?: boolean;
  className?: ClassValue;
  /** Merge props onto the single child element instead of rendering Radix's own wrapper (applied to the group wrapper). */
  asChild?: boolean;
  children?: ReactNode;
}

export type MenubarSectionProps = MenubarSectionOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof MenubarSectionOwnProps>;

export const MenubarSection = forwardRef<HTMLDivElement, MenubarSectionProps>(
  function MenubarSection(
    { title, showDivider = false, className, asChild = false, children, ...rest },
    ref,
  ) {
    const sectionClass = menuSectionVariants();

    return (
      <MenubarPrimitive.Group
        ref={ref}
        asChild={asChild}
        className={composeClassName(sectionClass.base(), className)}
        {...rest}
      >
        {title && (
          <MenubarPrimitive.Label
            className={composeClassName(
              sectionClass.label(),
              "px-2 py-1 text-[10px] font-semibold tracking-widest text-default-200 uppercase",
            )}
          >
            {title}
          </MenubarPrimitive.Label>
        )}
        {children}
        {showDivider && <MenubarPrimitive.Separator className={sectionClass.separator()} />}
      </MenubarPrimitive.Group>
    );
  },
);
