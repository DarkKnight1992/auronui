import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { composeClassName, type ClassValue } from "../../utils";
import { useAccordionContext } from "./accordion.context";

export interface AccordionContentOwnProps {
  asChild?: boolean;
  className?: ClassValue;
  /** Per-slot class overrides. */
  classNames?: Partial<{ body: ClassValue; bodyInner: ClassValue }>;
  children?: ReactNode;
}

export type AccordionContentProps = AccordionContentOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof AccordionContentOwnProps>;

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  function AccordionContent({ asChild, className, classNames, children, ...rest }, ref) {
    const ctx = useAccordionContext();
    const bodyClassName = composeClassName(ctx.slotFns.body(), className, classNames?.body);

    if (asChild) {
      return (
        <AccordionPrimitive.Content ref={ref} asChild className={bodyClassName} {...rest}>
          {children}
        </AccordionPrimitive.Content>
      );
    }

    return (
      <AccordionPrimitive.Content ref={ref} className={bodyClassName} {...rest}>
        <div className={composeClassName(ctx.slotFns.bodyInner(), classNames?.bodyInner)}>
          {children}
        </div>
      </AccordionPrimitive.Content>
    );
  },
);
