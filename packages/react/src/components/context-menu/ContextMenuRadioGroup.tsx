import { forwardRef, type ComponentPropsWithoutRef } from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";

export interface ContextMenuRadioGroupOwnProps {
  /** Controlled value of the currently selected radio item. */
  value?: string;
  onValueChange?: (value: string) => void;
}

export type ContextMenuRadioGroupProps = ContextMenuRadioGroupOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof ContextMenuRadioGroupOwnProps>;

/**
 * Deviation from the Vue version: the Vue `ContextMenuRadioGroup` exposes a bare
 * `defineModel` defaulting to `''`, giving it an implicit uncontrolled mode. Radix's
 * `ContextMenuRadioGroup` (built on `@radix-ui/react-menu`'s `MenuRadioGroup`) only
 * accepts `value`/`onValueChange` — there is no `defaultValue` escape hatch in the
 * primitive itself, so this component is controlled-only; consumers who want
 * uncontrolled behavior should manage the `value` state themselves (e.g. via
 * `useState`).
 */
export const ContextMenuRadioGroup = forwardRef<HTMLDivElement, ContextMenuRadioGroupProps>(
  function ContextMenuRadioGroup({ value, onValueChange, children, ...rest }, ref) {
    return (
      <ContextMenuPrimitive.RadioGroup
        ref={ref}
        value={value}
        onValueChange={onValueChange}
        {...rest}
      >
        {children}
      </ContextMenuPrimitive.RadioGroup>
    );
  },
);
