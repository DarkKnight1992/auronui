import { forwardRef, type ComponentPropsWithoutRef } from "react";
import * as ToolbarPrimitive from "@radix-ui/react-toolbar";
import { composeClassName, type ClassValue } from "../../utils";
import { useToolbarContext } from "./toolbar.context";

export interface ToolbarSeparatorOwnProps {
  asChild?: boolean;
  className?: ClassValue;
}

export type ToolbarSeparatorProps = ToolbarSeparatorOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof ToolbarSeparatorOwnProps>;

export const ToolbarSeparator = forwardRef<HTMLDivElement, ToolbarSeparatorProps>(
  function ToolbarSeparator({ asChild, className, ...rest }, ref) {
    const ctx = useToolbarContext({ orientation: "horizontal" });
    // Intentionally inverted: a horizontal toolbar's divider is a vertical line, and vice versa.
    const separatorClass =
      ctx.orientation === "vertical" ? "separator separator--horizontal" : "separator separator--vertical";

    return (
      <ToolbarPrimitive.Separator
        ref={ref}
        asChild={asChild}
        className={composeClassName(separatorClass, className)}
        {...rest}
      />
    );
  },
);
