import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { timelineVariants, type TimelineVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { TimelineProvider } from "./timeline.context";

export interface TimelineOwnProps {
  orientation?: TimelineVariants["orientation"];
  className?: ClassValue;
  classNames?: Partial<{
    base: ClassValue;
  }>;
  children?: ReactNode;
}

export type TimelineProps = TimelineOwnProps & Omit<ComponentPropsWithoutRef<"div">, keyof TimelineOwnProps>;

/**
 * Timeline — vertical (or horizontal) sequence of dated/stepped events:
 * activity feeds, changelogs, order-status history. Read-only historical
 * record — distinct from Stepper, which is an interactive process control.
 * Pure presentational compound component, no headless primitive backing.
 */
export function Timeline({
  orientation = "vertical",
  className,
  classNames,
  children,
  ...rest
}: TimelineProps) {
  const styles = timelineVariants({ orientation });

  return (
    <div
      className={composeClassName(styles.base(), className, classNames?.base)}
      data-slot="timeline"
      role="list"
      {...rest}
    >
      <TimelineProvider value={{ orientation }}>{children}</TimelineProvider>
    </div>
  );
}
