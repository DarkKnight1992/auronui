import { forwardRef, type ComponentPropsWithoutRef } from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";

export interface MenubarRadioGroupOwnProps {
  /**
   * Controlled value. Deviation from the Vue version: Radix's `RadioGroup` has no
   * uncontrolled/`defaultValue` mode (reka-ui's `MenubarRadioGroup` supports v-model with an
   * internal default) — the caller must own the state and pass `value`/`onValueChange`.
   */
  value?: string;
  onValueChange?: (value: string) => void;
  /** Merge props onto the single child element instead of rendering Radix's own wrapper. */
  asChild?: boolean;
}

export type MenubarRadioGroupProps = MenubarRadioGroupOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof MenubarRadioGroupOwnProps>;

export const MenubarRadioGroup = forwardRef<HTMLDivElement, MenubarRadioGroupProps>(
  function MenubarRadioGroup({ value, onValueChange, asChild = false, children, ...rest }, ref) {
    return (
      <MenubarPrimitive.RadioGroup
        ref={ref}
        value={value}
        onValueChange={onValueChange}
        asChild={asChild}
        {...rest}
      >
        {children}
      </MenubarPrimitive.RadioGroup>
    );
  },
);
