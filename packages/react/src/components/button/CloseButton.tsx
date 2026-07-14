import { forwardRef, type ComponentPropsWithoutRef } from "react";
import type { ButtonVariants } from "@auronui/styles";
import { resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import { Button } from "./Button";

export interface CloseButtonOwnProps {
  size?: ButtonVariants["size"];
  variant?: ButtonVariants["variant"];
  color?: ButtonVariants["color"];
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  isLoading?: boolean;
  className?: ClassValue;
}

export type CloseButtonProps = CloseButtonOwnProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof CloseButtonOwnProps | "value">;

export const CloseButton = forwardRef<HTMLElement, CloseButtonProps>(function CloseButton(
  {
    size = "md",
    variant = "ghost",
    color,
    isDisabled,
    disabled,
    isLoading = false,
    className,
    "aria-label": ariaLabel = "Close",
    ...rest
  },
  ref,
) {
  const resolvedDisabled = resolveDeprecatedBooleanProp(
    "CloseButton",
    "isDisabled",
    isDisabled,
    "disabled",
    disabled,
  );

  return (
    <Button
      ref={ref}
      variant={variant}
      color={color}
      isIconOnly
      size={size}
      isDisabled={resolvedDisabled}
      isLoading={isLoading}
      aria-label={ariaLabel}
      className={className}
      {...rest}
    >
      {/* D-16: Inline SVG X glyph — 16×16 viewBox, 2px stroke, currentColor */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </Button>
  );
});
