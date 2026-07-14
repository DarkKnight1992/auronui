import { forwardRef, type ComponentPropsWithoutRef, type ElementType } from "react";
import { aspectRatioVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface AspectRatioOwnProps {
  ratio?: number;
  as?: ElementType;
  className?: ClassValue;
  classNames?: Partial<{
    base: ClassValue;
  }>;
}

export type AspectRatioProps = AspectRatioOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof AspectRatioOwnProps>;

export const AspectRatio = forwardRef<HTMLElement, AspectRatioProps>(function AspectRatio(
  { ratio = 1, as: As = "div", className, classNames, style, children, ...rest },
  ref,
) {
  const slotFns = aspectRatioVariants();
  const Comp = As as ElementType;

  return (
    <Comp
      ref={ref}
      data-slot="aspect-ratio"
      className={composeClassName(slotFns.base(), className, classNames?.base)}
      style={{ ...style, aspectRatio: ratio }}
      {...rest}
    >
      {children}
    </Comp>
  );
});
