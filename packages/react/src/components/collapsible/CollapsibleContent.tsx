import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { composeClassName, type ClassValue } from "../../utils";
import { useCollapsibleContext } from "./collapsible.context";

export interface CollapsibleContentOwnProps {
  className?: ClassValue;
  /** Override classes for individual slots. */
  classNames?: Partial<{ body: ClassValue; bodyInner: ClassValue }>;
  children?: ReactNode;
}

export type CollapsibleContentProps = CollapsibleContentOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof CollapsibleContentOwnProps>;

export const CollapsibleContent = forwardRef<HTMLDivElement, CollapsibleContentProps>(
  function CollapsibleContent({ className, classNames, children, ...rest }, ref) {
    const ctx = useCollapsibleContext();

    return (
      <div
        ref={ref}
        hidden={!ctx.isOpen}
        data-state={ctx.isOpen ? "open" : "closed"}
        className={composeClassName(ctx.slotFns.body(), className, classNames?.body)}
        {...rest}
      >
        <div className={composeClassName(ctx.slotFns.bodyInner(), classNames?.bodyInner)}>{children}</div>
      </div>
    );
  },
);
