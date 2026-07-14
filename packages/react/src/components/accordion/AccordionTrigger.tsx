import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { composeClassName, type ClassValue } from "../../utils";
import { useAccordionContext } from "./accordion.context";

export interface AccordionTriggerOwnProps {
  asChild?: boolean;
  className?: ClassValue;
  /** Per-slot class overrides. */
  classNames?: Partial<{ trigger: ClassValue; indicator: ClassValue }>;
  /** Replace the default chevron icon. Note: ignored when `asChild` is set, since Radix's
   * Slot requires exactly one child element in that mode. */
  indicator?: ReactNode;
  children?: ReactNode;
}

export type AccordionTriggerProps = AccordionTriggerOwnProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof AccordionTriggerOwnProps>;

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  function AccordionTrigger({ asChild, className, classNames, indicator, children, ...rest }, ref) {
    const ctx = useAccordionContext();
    const triggerClassName = composeClassName(ctx.slotFns.trigger(), className, classNames?.trigger);

    if (asChild) {
      return (
        <AccordionPrimitive.Trigger
          ref={ref}
          asChild
          data-slot="accordion-trigger"
          className={triggerClassName}
          {...rest}
        >
          {children}
        </AccordionPrimitive.Trigger>
      );
    }

    return (
      <AccordionPrimitive.Trigger
        ref={ref}
        data-slot="accordion-trigger"
        className={triggerClassName}
        {...rest}
      >
        {children}
        <span
          className={composeClassName(ctx.slotFns.indicator(), classNames?.indicator)}
          aria-hidden="true"
        >
          {indicator ?? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              focusable="false"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          )}
        </span>
      </AccordionPrimitive.Trigger>
    );
  },
);
