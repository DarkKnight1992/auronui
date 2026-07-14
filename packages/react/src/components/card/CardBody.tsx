import { forwardRef, useMemo, type ComponentPropsWithoutRef } from "react";
import { cardVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { DEFAULT_CARD_CONTEXT, useCardContext } from "./card.context";

export interface CardBodyOwnProps {
  className?: ClassValue;
  classNames?: Partial<{
    content: ClassValue;
  }>;
}

export type CardBodyProps = CardBodyOwnProps & Omit<ComponentPropsWithoutRef<"div">, keyof CardBodyOwnProps>;

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(function CardBody(
  { className, classNames, children, ...rest },
  ref,
) {
  const ctx = useCardContext(DEFAULT_CARD_CONTEXT);
  const slotFns = useMemo(() => cardVariants({ variant: ctx.variant }), [ctx.variant]);

  return (
    <div
      ref={ref}
      className={composeClassName(slotFns.content(), className, classNames?.content)}
      {...rest}
    >
      {children}
    </div>
  );
});
