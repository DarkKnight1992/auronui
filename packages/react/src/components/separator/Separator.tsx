import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { separatorVariants, type SeparatorVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface SeparatorOwnProps {
  orientation?: SeparatorVariants["orientation"];
  variant?: SeparatorVariants["variant"];
  className?: ClassValue;
  /** Per-slot class overrides */
  classNames?: Partial<{
    line: ClassValue;
    content: ClassValue;
  }>;
  children?: ReactNode;
}

export type SeparatorProps = SeparatorOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof SeparatorOwnProps>;

export const Separator = forwardRef<HTMLElement, SeparatorProps>(function Separator(
  { orientation = "horizontal", variant = "default", className, classNames, children, ...rest },
  ref,
) {
  const hasLabel = children !== undefined && children !== null && children !== false;
  const slotFns = separatorVariants({ orientation, variant });
  const classes = composeClassName(slotFns.base(), className);

  if (orientation !== "vertical" && !hasLabel) {
    return <hr ref={ref as never} className={classes} {...rest} />;
  }

  if (orientation === "vertical") {
    return (
      <div
        ref={ref as never}
        className={classes}
        role="separator"
        aria-orientation="vertical"
        {...rest}
      />
    );
  }

  return (
    <div
      ref={ref as never}
      className={classes}
      role="separator"
      aria-orientation="horizontal"
      {...rest}
    >
      <div className={composeClassName(slotFns.line(), classNames?.line)} />
      <div className={composeClassName(slotFns.content(), classNames?.content)}>{children}</div>
      <div className={composeClassName(slotFns.line(), classNames?.line)} />
    </div>
  );
});
