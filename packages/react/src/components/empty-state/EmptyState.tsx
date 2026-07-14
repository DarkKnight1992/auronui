import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { emptyStateVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { EmptyStateProvider } from "./empty-state.context";

export interface EmptyStateOwnProps {
  className?: ClassValue;
  children?: ReactNode;
}

export type EmptyStateProps = EmptyStateOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof EmptyStateOwnProps>;

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { className, children, ...rest },
  ref,
) {
  const classes = composeClassName(emptyStateVariants(), className);

  return (
    <EmptyStateProvider value={{ _brand: "EmptyState" }}>
      <div ref={ref} className={classes} aria-live="polite" {...rest}>
        {children}
      </div>
    </EmptyStateProvider>
  );
});
