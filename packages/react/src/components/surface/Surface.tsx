import { forwardRef, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";
import { surfaceVariants, type SurfaceVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { SurfaceProvider } from "./surface.context";

export interface SurfaceOwnProps {
  as?: ElementType;
  variant?: SurfaceVariants["variant"];
  className?: ClassValue;
  children?: ReactNode;
}

export type SurfaceProps = SurfaceOwnProps & Omit<ComponentPropsWithoutRef<"div">, keyof SurfaceOwnProps>;

export const Surface = forwardRef<HTMLElement, SurfaceProps>(function Surface(
  { as: As = "div", variant = "default", className, children, ...rest },
  ref,
) {
  const classes = composeClassName(surfaceVariants({ variant }), className);
  const Comp = As as ElementType;

  return (
    <SurfaceProvider value={{ variant }}>
      <Comp ref={ref} className={classes} {...rest}>
        {children}
      </Comp>
    </SurfaceProvider>
  );
});
