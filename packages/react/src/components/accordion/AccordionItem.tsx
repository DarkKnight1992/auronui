import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import { useAccordionContext } from "./accordion.context";

export interface AccordionItemOwnProps {
  value: string;
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  asChild?: boolean;
  className?: ClassValue;
  classNames?: Partial<{ item: ClassValue }>;
  children?: ReactNode;
}

export type AccordionItemProps = AccordionItemOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof AccordionItemOwnProps>;

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { value, isDisabled, disabled, asChild, className, classNames, children, ...rest },
  ref,
) {
  const ctx = useAccordionContext();

  const resolvedDisabled = resolveDeprecatedBooleanProp(
    "AccordionItem",
    "isDisabled",
    isDisabled,
    "disabled",
    disabled,
  );

  return (
    <AccordionPrimitive.Item
      ref={ref}
      value={value}
      disabled={resolvedDisabled}
      asChild={asChild}
      className={composeClassName(ctx.slotFns.item(), className, classNames?.item)}
      {...rest}
    >
      {children}
    </AccordionPrimitive.Item>
  );
});
