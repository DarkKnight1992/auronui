import { forwardRef, useMemo, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { chipVariants, type ChipVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { warnDeprecatedVariant } from "../../utils/warnDeprecated";

export interface ChipOwnProps {
  color?: ChipVariants["color"];
  size?: ChipVariants["size"];
  /**
   * Visual style of the chip.
   * @deprecated 'outlined' — use 'bordered' instead.
   */
  variant?: ChipVariants["variant"] | "outlined";
  /** Show a colored dot indicator before the label */
  dot?: boolean;
  /** Render a built-in close button that fires onClose */
  isClosable?: boolean;
  /** Aria-label for the close button */
  closeAriaLabel?: string;
  onClose?: () => void;
  className?: ClassValue;
  /** Override classes for named slots */
  classNames?: Partial<{
    base: ClassValue;
    dot: ClassValue;
    startContent: ClassValue;
    label: ClassValue;
    endContent: ClassValue;
    closeButton: ClassValue;
  }>;
  startContent?: ReactNode;
  endContent?: ReactNode;
  children?: ReactNode;
}

export type ChipProps = ChipOwnProps & Omit<ComponentPropsWithoutRef<"span">, keyof ChipOwnProps>;

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(function Chip(
  {
    color = "default",
    size,
    variant = "solid",
    dot = false,
    isClosable = false,
    closeAriaLabel = "Remove",
    onClose,
    className,
    classNames,
    startContent,
    endContent,
    children,
    ...rest
  },
  ref,
) {
  const resolvedVariant = useMemo(() => {
    if (variant === "outlined") {
      warnDeprecatedVariant("Chip", "outlined", "bordered");
      return "bordered" as ChipVariants["variant"];
    }
    return variant;
  }, [variant]);

  const slotFns = chipVariants({ color, size, variant: resolvedVariant });

  return (
    <span ref={ref} className={composeClassName(slotFns.base(), className, classNames?.base)} {...rest}>
      {dot && (
        <span className={composeClassName(slotFns.dot(), classNames?.dot)} aria-hidden="true" />
      )}

      {startContent && (
        <span
          className={composeClassName(slotFns.startContent(), classNames?.startContent)}
          aria-hidden="true"
        >
          {startContent}
        </span>
      )}

      <span className={composeClassName(slotFns.label(), classNames?.label)}>{children}</span>

      {endContent && !isClosable && (
        <span
          className={composeClassName(slotFns.endContent(), classNames?.endContent)}
          aria-hidden="true"
        >
          {endContent}
        </span>
      )}

      {/* Raw <button> (not <Button>): the close affordance is styled via chipVariants'
          'closeButton' slot; <Button> is a full ghost button with its own sizing that would
          break the chip's visual parity. */}
      {isClosable && (
        <button
          type="button"
          className={composeClassName(slotFns.closeButton(), classNames?.closeButton)}
          aria-label={closeAriaLabel}
          onClick={() => onClose?.()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </span>
  );
});
