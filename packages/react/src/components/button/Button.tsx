import { forwardRef, useMemo, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";
import { buttonVariants, type ButtonVariants } from "@auronui/styles";
import { composeClassName, dataAttr, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import { warnDeprecatedVariant } from "../../utils/warnDeprecated";
import { Spinner } from "../spinner";
import { DEFAULT_BUTTON_GROUP_CONTEXT, useButtonGroupContext } from "./button-group.context";

const LEGACY_VARIANTS: Record<string, { variant: string; color: string }> = {
  primary: { variant: "solid", color: "primary" },
  secondary: { variant: "default", color: "default" },
  tertiary: { variant: "default", color: "default" },
  danger: { variant: "solid", color: "danger" },
  "danger-soft": { variant: "soft", color: "danger" },
  success: { variant: "solid", color: "success" },
  "success-soft": { variant: "soft", color: "success" },
  warning: { variant: "solid", color: "warning" },
  "warning-soft": { variant: "soft", color: "warning" },
};

export interface ButtonOwnProps {
  /** @deprecated 'outline' — use 'bordered' instead. */
  variant?: ButtonVariants["variant"] | "outline";
  color?: ButtonVariants["color"];
  size?: ButtonVariants["size"];
  radius?: ButtonVariants["radius"];
  isIconOnly?: boolean;
  fullWidth?: boolean;
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  isLoading?: boolean;
  as?: ElementType;
  className?: ClassValue;
  /** Override classes for individual slots (base, startContent, label, endContent, spinner) */
  classNames?: Partial<{
    base: ClassValue;
    startContent: ClassValue;
    label: ClassValue;
    endContent: ClassValue;
    spinner: ClassValue;
  }>;
  value?: string | number;
  startContent?: ReactNode;
  endContent?: ReactNode;
  children?: ReactNode;
}

export type ButtonProps = ButtonOwnProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof ButtonOwnProps>;

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  {
    variant,
    color,
    size,
    radius,
    isIconOnly = false,
    fullWidth = false,
    isDisabled,
    disabled,
    isLoading = false,
    as: As = "button",
    className,
    classNames,
    value,
    startContent,
    endContent,
    children,
    onClick,
    ...rest
  },
  ref,
) {
  const groupCtx = useButtonGroupContext(DEFAULT_BUTTON_GROUP_CONTEXT);

  const isSelected = groupCtx.isValueSelected(value);

  const resolvedDisabled = resolveDeprecatedBooleanProp(
    "Button",
    "isDisabled",
    isDisabled,
    "disabled",
    disabled,
  );

  // group disabled ALWAYS wins over child prop; all other props: child prop wins over group value
  const effectiveDisabled = groupCtx.disabled || resolvedDisabled;
  const finalVariant = variant ?? groupCtx.variant;
  const finalColor = color ?? groupCtx.color;
  const finalSize = size ?? groupCtx.size;
  const finalFullWidth = fullWidth || groupCtx.fullWidth;

  const resolvedVariant = useMemo(() => {
    const v = finalVariant;
    if (!v) return v;
    if (v === "outline") {
      warnDeprecatedVariant("Button", "outline", "bordered");
      return "bordered" as ButtonVariants["variant"];
    }
    return (LEGACY_VARIANTS[v]?.variant ?? v) as ButtonVariants["variant"];
  }, [finalVariant]);

  const resolvedColor = useMemo(() => {
    const v = finalVariant;
    if (color === undefined && v && LEGACY_VARIANTS[v]) {
      return LEGACY_VARIANTS[v].color as ButtonVariants["color"];
    }
    return finalColor;
  }, [color, finalVariant, finalColor]);

  const slotFns = useMemo(
    () =>
      buttonVariants({
        variant: resolvedVariant,
        color: resolvedColor,
        size: finalSize,
        radius,
        isIconOnly,
        fullWidth: finalFullWidth,
        isLoading,
      }),
    [resolvedVariant, resolvedColor, finalSize, radius, isIconOnly, finalFullWidth, isLoading],
  );

  const spinnerSize = finalSize === "xs" || finalSize === "sm" ? "sm" : finalSize === "lg" || finalSize === "xl" ? "lg" : "md";

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    if (value !== undefined) groupCtx.selectValue(value);
    onClick?.(event as never);
  }

  const Comp = As as ElementType;

  return (
    <Comp
      ref={ref}
      type={As === "button" ? "button" : undefined}
      className={composeClassName(slotFns.base(), className, classNames?.base)}
      disabled={effectiveDisabled || isLoading || undefined}
      data-disabled={dataAttr(effectiveDisabled)}
      data-loading={dataAttr(isLoading)}
      data-orientation={groupCtx.orientation}
      data-selected={dataAttr(isSelected)}
      onClick={handleClick}
      {...rest}
    >
      {startContent && (
        <span className={composeClassName(slotFns.startContent(), classNames?.startContent)}>
          {startContent}
        </span>
      )}

      <span className={composeClassName(slotFns.label(), classNames?.label)}>{children}</span>

      {endContent && (
        <span className={composeClassName(slotFns.endContent(), classNames?.endContent)}>
          {endContent}
        </span>
      )}

      {isLoading && (
        <span
          className={composeClassName(slotFns.spinner(), classNames?.spinner)}
          aria-hidden="true"
          data-slot="spinner"
        >
          <Spinner size={spinnerSize} color="current" />
        </span>
      )}
    </Comp>
  );
});
