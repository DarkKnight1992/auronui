import { forwardRef, type ComponentPropsWithoutRef, type MouseEvent, type ReactNode } from "react";
import { composeClassName, dataAttr, type ClassValue } from "../../utils";
import { useCollapsibleContext } from "./collapsible.context";

export interface CollapsibleTriggerOwnProps {
  className?: ClassValue;
  /** Per-slot class overrides. */
  classNames?: Partial<{ trigger: ClassValue; indicator: ClassValue }>;
  children?: ReactNode;
}

export type CollapsibleTriggerProps = CollapsibleTriggerOwnProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof CollapsibleTriggerOwnProps>;

// Raw <button> (not Auron's <Button>): this mirrors reka-ui's own unstyled
// CollapsibleTrigger primitive in the Vue source — it needs the bare
// `.collapsible__trigger` contract (aria-expanded, data-state), not Button's
// variant/color styling system.
export const CollapsibleTrigger = forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  function CollapsibleTrigger({ className, classNames, children, onClick, ...rest }, ref) {
    const ctx = useCollapsibleContext();

    function handleClick(event: MouseEvent<HTMLButtonElement>): void {
      onClick?.(event);
      if (event.defaultPrevented) return;
      ctx.toggle();
    }

    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={ctx.isOpen}
        aria-disabled={dataAttr(ctx.isDisabled)}
        disabled={ctx.isDisabled || undefined}
        className={composeClassName(ctx.slotFns.trigger(), className, classNames?.trigger)}
        onClick={handleClick}
        {...rest}
      >
        {children}
        <span
          className={composeClassName(ctx.slotFns.indicator(), classNames?.indicator)}
          data-state={ctx.isOpen ? "open" : "closed"}
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
    );
  },
);
