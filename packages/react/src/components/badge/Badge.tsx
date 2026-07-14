import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { badgeVariants, type BadgeVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface BadgeOwnProps {
  color?: BadgeVariants["color"];
  size?: BadgeVariants["size"];
  variant?: BadgeVariants["variant"];
  placement?: BadgeVariants["placement"];
  className?: ClassValue;
  /** Per-slot class name overrides. */
  classNames?: Partial<{
    anchor: ClassValue;
    base: ClassValue;
    label: ClassValue;
  }>;
  /** Content rendered inside the badge itself (e.g. a count) */
  label?: ReactNode;
  /** The anchored element the badge is attached to */
  children?: ReactNode;
}

export type BadgeProps = BadgeOwnProps & Omit<ComponentPropsWithoutRef<"div">, keyof BadgeOwnProps>;

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(function Badge(
  {
    color = "default",
    size = "md",
    variant = "primary",
    placement = "top-right",
    className,
    classNames,
    label,
    children,
    ...rest
  },
  ref,
) {
  const slotFns = badgeVariants({ color, size, variant, placement });

  return (
    <div ref={ref} className={composeClassName(slotFns.anchor(), classNames?.anchor)} {...rest}>
      {children}
      <span className={composeClassName(slotFns.base(), className, classNames?.base)}>
        <span className={composeClassName(slotFns.label(), classNames?.label)}>{label}</span>
      </span>
    </div>
  );
});
