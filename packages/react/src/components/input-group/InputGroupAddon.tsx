import { forwardRef, useMemo, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { inputGroupVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { DEFAULT_INPUT_GROUP_CONTEXT, useInputGroupContext } from "./input-group.context";

/**
 * InputGroupAddon — a segment inside an InputGroup (icon, button, or plain
 * text) that shares the parent box's border instead of having its own.
 * Position (leading vs. trailing) is just DOM order — put it before or
 * after InputGroupInput.
 */

export interface InputGroupAddonOwnProps {
  className?: ClassValue;
  children?: ReactNode;
}

export type InputGroupAddonProps = InputGroupAddonOwnProps &
  Omit<ComponentPropsWithoutRef<"span">, keyof InputGroupAddonOwnProps>;

export const InputGroupAddon = forwardRef<HTMLSpanElement, InputGroupAddonProps>(function InputGroupAddon(
  { className, children, ...rest },
  ref,
) {
  const ctx = useInputGroupContext(DEFAULT_INPUT_GROUP_CONTEXT);
  const slotFns = useMemo(() => inputGroupVariants({ size: ctx.size }), [ctx.size]);

  return (
    <span
      {...rest}
      ref={ref}
      className={composeClassName(slotFns.addon(), className)}
      data-slot="input-group-addon"
      data-disabled={ctx.isDisabled || undefined}
    >
      {children}
    </span>
  );
});
