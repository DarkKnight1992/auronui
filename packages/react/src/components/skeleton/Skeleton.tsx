import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { skeletonVariants, type SkeletonVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface SkeletonOwnProps {
  animationType?: SkeletonVariants["animationType"];
  className?: ClassValue;
  /** Custom class overrides for named slots. */
  classNames?: Partial<{
    base: ClassValue;
  }>;
  children?: ReactNode;
}

export type SkeletonProps = SkeletonOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof SkeletonOwnProps>;

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { animationType = "shimmer", className, classNames, children, ...rest },
  ref,
) {
  const slotFns = skeletonVariants({ animationType });
  const classes = composeClassName(slotFns.base(), className, classNames?.base);

  return (
    <div ref={ref} className={classes} aria-hidden="true" {...rest}>
      {children}
    </div>
  );
});
