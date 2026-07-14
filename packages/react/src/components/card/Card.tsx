import { forwardRef, useMemo, type ComponentPropsWithoutRef, type KeyboardEvent, type MouseEvent } from "react";
import { cardVariants, type CardVariants } from "@auronui/styles";
import { composeClassName, dataAttr, type ClassValue } from "../../utils";
import { CardProvider, type CardContext } from "./card.context";

export interface CardOwnProps {
  variant?: CardVariants["variant"];
  shadow?: CardVariants["shadow"];
  radius?: CardVariants["radius"];
  isHoverable?: boolean;
  isPressable?: boolean;
  isDisabled?: boolean;
  fullWidth?: boolean;
  className?: ClassValue;
  classNames?: Partial<{
    base: ClassValue;
  }>;
  onPress?: (event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => void;
}

export type CardProps = CardOwnProps & Omit<ComponentPropsWithoutRef<"div">, keyof CardOwnProps>;

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    variant = "default",
    shadow = "sm",
    radius = "lg",
    isHoverable = false,
    isPressable = false,
    isDisabled = false,
    fullWidth = false,
    className,
    classNames,
    onPress,
    onClick,
    onKeyDown,
    children,
    ...rest
  },
  ref,
) {
  const contextValue: CardContext = {
    variant,
    shadow,
    radius,
    isHoverable,
    isPressable,
    isDisabled,
    fullWidth,
  };

  const slotFns = useMemo(
    () =>
      cardVariants({
        variant,
        shadow,
        radius,
        isHoverable,
        isPressable,
        isDisabled,
        fullWidth,
      }),
    [variant, shadow, radius, isHoverable, isPressable, isDisabled, fullWidth],
  );

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    onClick?.(event);
    if (isDisabled) return;
    if (isPressable) onPress?.(event);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    if (!isPressable || isDisabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onPress?.(event);
    }
  }

  return (
    <CardProvider value={contextValue}>
      <div
        ref={ref}
        className={composeClassName(slotFns.base(), className, classNames?.base)}
        role={isPressable ? "button" : undefined}
        tabIndex={isPressable && !isDisabled ? 0 : undefined}
        aria-disabled={dataAttr(isDisabled)}
        data-disabled={dataAttr(isDisabled)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </div>
    </CardProvider>
  );
});
