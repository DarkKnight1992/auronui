import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { timelineVariants, type TimelineVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { useTimelineContext, timelineContextDefaults } from "./timeline.context";

export interface TimelineItemOwnProps {
  title?: string;
  description?: string;
  timestamp?: string;
  status?: TimelineVariants["status"];
  color?: TimelineVariants["color"];
  icon?: ReactNode;
  className?: ClassValue;
  classNames?: Partial<{
    item: ClassValue;
    dot: ClassValue;
    line: ClassValue;
    content: ClassValue;
    title: ClassValue;
    description: ClassValue;
    timestamp: ClassValue;
  }>;
  children?: ReactNode;
}

export type TimelineItemProps = TimelineItemOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof TimelineItemOwnProps>;

/**
 * TimelineItem — one entry in a Timeline: a dot, a connecting line to the
 * next item, and a content area (title/description/timestamp, or fully
 * custom via children).
 */
export function TimelineItem({
  title,
  description,
  timestamp,
  status = "pending",
  color,
  icon,
  className,
  classNames,
  children,
  ...rest
}: TimelineItemProps) {
  const ctx = useTimelineContext(timelineContextDefaults);
  const styles = timelineVariants({ orientation: ctx.orientation, status, color });

  return (
    <div
      className={composeClassName(styles.item(), className, classNames?.item)}
      data-slot="timeline-item"
      role="listitem"
      {...rest}
    >
      <span className={composeClassName(styles.dot(), classNames?.dot)} data-slot="timeline-dot" aria-hidden="true">
        {icon}
      </span>
      <span className={composeClassName(styles.line(), classNames?.line)} data-slot="timeline-line" aria-hidden="true" />
      <div className={composeClassName(styles.content(), classNames?.content)} data-slot="timeline-content">
        {children ?? (
          <>
            {title && (
              <span className={composeClassName(styles.title(), classNames?.title)} data-slot="timeline-title">
                {title}
              </span>
            )}
            {description && (
              <span
                className={composeClassName(styles.description(), classNames?.description)}
                data-slot="timeline-description"
              >
                {description}
              </span>
            )}
            {timestamp && (
              <span
                className={composeClassName(styles.timestamp(), classNames?.timestamp)}
                data-slot="timeline-timestamp"
              >
                {timestamp}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
