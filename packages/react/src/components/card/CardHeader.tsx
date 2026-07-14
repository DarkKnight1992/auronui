import { forwardRef, useMemo, type ComponentPropsWithoutRef } from "react";
import { cardVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { DEFAULT_CARD_CONTEXT, useCardContext } from "./card.context";

export interface CardHeaderOwnProps {
  divider?: boolean;
  className?: ClassValue;
  classNames?: Partial<{
    header: ClassValue;
  }>;
}

export type CardHeaderProps = CardHeaderOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof CardHeaderOwnProps>;

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
  { divider = false, className, classNames, children, ...rest },
  ref,
) {
  const ctx = useCardContext(DEFAULT_CARD_CONTEXT);
  const slotFns = useMemo(() => cardVariants({ variant: ctx.variant }), [ctx.variant]);

  return (
    <div
      ref={ref}
      className={composeClassName(
        slotFns.header(),
        divider && "card__header--divided",
        className,
        classNames?.header,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
