import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as ToolbarPrimitive from "@radix-ui/react-toolbar";
import { toolbarVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { ToolbarProvider } from "./toolbar.context";

export interface ToolbarOwnProps {
  orientation?: "horizontal" | "vertical";
  loop?: boolean;
  isAttached?: boolean;
  /** Text direction */
  dir?: "ltr" | "rtl";
  /** Merge props onto a single child element instead of rendering a wrapper div (Radix Slot). */
  asChild?: boolean;
  className?: ClassValue;
  children?: ReactNode;
}

export type ToolbarProps = ToolbarOwnProps & Omit<ComponentPropsWithoutRef<"div">, keyof ToolbarOwnProps>;

export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(function Toolbar(
  { orientation = "horizontal", loop = true, isAttached = false, dir, asChild, className, children, ...rest },
  ref,
) {
  const baseClass = toolbarVariants({ orientation, isAttached });

  return (
    <ToolbarProvider value={{ orientation }}>
      <ToolbarPrimitive.Root
        ref={ref}
        orientation={orientation}
        loop={loop}
        dir={dir}
        asChild={asChild}
        data-orientation={orientation}
        className={composeClassName(baseClass, className)}
        {...rest}
      >
        {children}
      </ToolbarPrimitive.Root>
    </ToolbarProvider>
  );
});
