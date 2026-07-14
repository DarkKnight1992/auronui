import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { composeClassName, type ClassValue } from "../../utils";
import { useEmptyStateContext } from "./empty-state.context";

export interface EmptyStateContentOwnProps {
  className?: ClassValue;
  children?: ReactNode;
}

export type EmptyStateContentProps = EmptyStateContentOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof EmptyStateContentOwnProps>;

export const EmptyStateContent = forwardRef<HTMLDivElement, EmptyStateContentProps>(
  function EmptyStateContent({ className, children, ...rest }, ref) {
    // Reads context to confirm we're in scope; fallback allows standalone use
    useEmptyStateContext({ _brand: "EmptyState" });

    return (
      <div ref={ref} className={composeClassName("empty-state__content", className)} {...rest}>
        {children}
      </div>
    );
  },
);
