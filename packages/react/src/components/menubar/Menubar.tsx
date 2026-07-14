import { forwardRef, useMemo, type ComponentPropsWithoutRef } from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { menubarVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface MenubarOwnProps {
  /** Controlled value of the currently open top-level menu. */
  value?: string;
  /** Initial value of the currently open top-level menu (uncontrolled). */
  defaultValue?: string;
  /** Called when the open top-level menu changes. */
  onValueChange?: (value: string) => void;
  dir?: "ltr" | "rtl";
  /** When true, keyboard navigation loops from last item to first, and vice versa. */
  loop?: boolean;
  className?: ClassValue;
}

export type MenubarProps = MenubarOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof MenubarOwnProps>;

export const Menubar = forwardRef<HTMLDivElement, MenubarProps>(function Menubar(
  { value, defaultValue, onValueChange, dir, loop, className, children, ...rest },
  ref,
) {
  const slots = useMemo(() => menubarVariants(), []);

  return (
    <MenubarPrimitive.Root
      ref={ref}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      dir={dir}
      loop={loop}
      className={composeClassName(slots.root(), className)}
      {...rest}
    >
      {children}
    </MenubarPrimitive.Root>
  );
});
