import { forwardRef, useMemo, type ComponentPropsWithoutRef } from "react";
import { cardVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { DEFAULT_CARD_CONTEXT, useCardContext } from "./card.context";

export interface CardFooterOwnProps {
  divider?: boolean;
  className?: ClassValue;
  classNames?: Partial<{
    footer: ClassValue;
  }>;
}

export type CardFooterProps = CardFooterOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof CardFooterOwnProps>;

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter(
  { divider = false, className, classNames, children, ...rest },
  ref,
) {
  const ctx = useCardContext(DEFAULT_CARD_CONTEXT);
  const slotFns = useMemo(() => cardVariants({ variant: ctx.variant }), [ctx.variant]);

  return (
    <div
      ref={ref}
      className={composeClassName(
        slotFns.footer(),
        divider && "card__footer--divided",
        className,
        classNames?.footer,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
