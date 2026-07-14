import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { composeClassName, type ClassValue } from "../../utils";
import { useAccordionContext } from "./accordion.context";

export interface AccordionHeaderOwnProps {
  asChild?: boolean;
  className?: ClassValue;
  classNames?: Partial<{ heading: ClassValue }>;
  children?: ReactNode;
}

export type AccordionHeaderProps = AccordionHeaderOwnProps &
  Omit<ComponentPropsWithoutRef<"h3">, keyof AccordionHeaderOwnProps>;

export const AccordionHeader = forwardRef<HTMLHeadingElement, AccordionHeaderProps>(
  function AccordionHeader({ asChild, className, classNames, children, ...rest }, ref) {
    const ctx = useAccordionContext();

    return (
      <AccordionPrimitive.Header
        ref={ref}
        asChild={asChild}
        className={composeClassName(ctx.slotFns.heading(), className, classNames?.heading)}
        {...rest}
      >
        {children}
      </AccordionPrimitive.Header>
    );
  },
);
