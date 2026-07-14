import { forwardRef, useMemo, type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { accordionVariants, type AccordionVariants } from "@auronui/styles";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import { AccordionProvider } from "./accordion.context";
import { AccordionItem } from "./AccordionItem";
import { AccordionHeader } from "./AccordionHeader";
import { AccordionTrigger } from "./AccordionTrigger";
import { AccordionContent } from "./AccordionContent";

type AccordionShorthandItem = {
  value: string;
  title: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
};

export interface AccordionOwnProps {
  type: "single" | "multiple";
  /** Controlled expanded value(s). String in single mode, string[] in multiple mode. */
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  /** Single mode only: whether the open item can be collapsed back to none. */
  collapsible?: boolean;
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  dir?: "ltr" | "rtl";
  orientation?: "horizontal" | "vertical";
  variant?: AccordionVariants["variant"];
  size?: AccordionVariants["size"];
  /** Merge props onto a single child element instead of rendering a wrapper div (Radix Slot). */
  asChild?: boolean;
  className?: ClassValue;
  /** Override classes for individual slots (base, item, trigger, indicator, body, bodyInner) */
  classNames?: Partial<{
    base: ClassValue;
    item: ClassValue;
    trigger: ClassValue;
    indicator: ClassValue;
    body: ClassValue;
    bodyInner: ClassValue;
  }>;
  /** Shorthand API: render items from an array instead of the compound slot API */
  items?: AccordionShorthandItem[];
  children?: ReactNode;
}

export type AccordionProps = AccordionOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof AccordionOwnProps>;

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  {
    type,
    value,
    defaultValue,
    onValueChange,
    collapsible = true,
    isDisabled,
    disabled,
    dir,
    orientation,
    variant = "default",
    size = "md",
    asChild,
    className,
    classNames,
    items,
    children,
    ...rest
  },
  ref,
) {
  const resolvedDisabled = resolveDeprecatedBooleanProp(
    "Accordion",
    "isDisabled",
    isDisabled,
    "disabled",
    disabled,
  );

  const slotFns = useMemo(() => accordionVariants({ variant, size }), [variant, size]);

  const rootClassName = composeClassName(slotFns.base(), className, classNames?.base);

  const content = items
    ? items.map((item) => (
        <AccordionItem
          key={item.value}
          value={item.value}
          isDisabled={item.disabled}
          classNames={{ item: classNames?.item }}
        >
          <AccordionHeader>
            <AccordionTrigger
              classNames={{ trigger: classNames?.trigger, indicator: classNames?.indicator }}
            >
              {item.title}
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionContent classNames={{ body: classNames?.body, bodyInner: classNames?.bodyInner }}>
            {item.content}
          </AccordionContent>
        </AccordionItem>
      ))
    : children;

  return (
    <AccordionProvider value={{ slotFns }}>
      {type === "multiple" ? (
        <AccordionPrimitive.Root
          ref={ref}
          type="multiple"
          value={value as string[] | undefined}
          defaultValue={defaultValue as string[] | undefined}
          onValueChange={onValueChange as ((value: string[]) => void) | undefined}
          disabled={resolvedDisabled}
          dir={dir}
          orientation={orientation}
          asChild={asChild}
          className={rootClassName}
          {...rest}
        >
          {content}
        </AccordionPrimitive.Root>
      ) : (
        <AccordionPrimitive.Root
          ref={ref}
          type="single"
          collapsible={collapsible}
          value={value as string | undefined}
          defaultValue={defaultValue as string | undefined}
          onValueChange={onValueChange as ((value: string) => void) | undefined}
          disabled={resolvedDisabled}
          dir={dir}
          orientation={orientation}
          asChild={asChild}
          className={rootClassName}
          {...rest}
        >
          {content}
        </AccordionPrimitive.Root>
      )}
    </AccordionProvider>
  );
});
