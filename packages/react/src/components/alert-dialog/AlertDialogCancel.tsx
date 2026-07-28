import { forwardRef, useMemo, type ComponentPropsWithoutRef, type MouseEvent } from "react";
import { buttonVariants, type ButtonVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { warnDeprecatedVariant } from "../../utils/warnDeprecated";
import { useAlertDialogContext } from "./alert-dialog.context";

const LEGACY_VARIANTS: Record<string, ButtonVariants["variant"]> = {
  primary: "primary",
  secondary: "secondary",
  tertiary: "secondary",
  danger: "danger",
  "danger-soft": "danger-soft",
  success: "success",
  "success-soft": "success-soft",
  warning: "warning",
  "warning-soft": "warning-soft",
  ghost: "ghost",
  bordered: "bordered",
};

export interface AlertDialogCancelOwnProps {
  /** @deprecated 'outline' — use 'bordered' instead. */
  variant?:
    | "danger"
    | "danger-soft"
    | "primary"
    | "secondary"
    | "ghost"
    | "bordered"
    | "outline"
    | "success"
    | "success-soft"
    | "warning"
    | "warning-soft"
    | "tertiary";
  size?: ButtonVariants["size"];
  className?: ClassValue;
  classNames?: Partial<{ base: ClassValue }>;
}

export type AlertDialogCancelProps = AlertDialogCancelOwnProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof AlertDialogCancelOwnProps>;

/** AlertDialogCancel — dismiss button for alert dialogs. Always closes on click, same as AlertDialogAction (see its doc comment). */
export const AlertDialogCancel = forwardRef<HTMLButtonElement, AlertDialogCancelProps>(function AlertDialogCancel(
  { variant = "secondary", size = "md", className, classNames, onClick, children, ...rest },
  ref,
) {
  const ctx = useAlertDialogContext();

  const resolvedVariant = useMemo(() => {
    if (variant === "outline") {
      warnDeprecatedVariant("AlertDialogCancel", "outline", "bordered");
      return "bordered" as ButtonVariants["variant"];
    }
    return (LEGACY_VARIANTS[variant] ?? variant) as ButtonVariants["variant"];
  }, [variant]);

  const slotFns = useMemo(() => buttonVariants({ variant: resolvedVariant, size }), [resolvedVariant, size]);

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    ctx.close();
  }

  return (
    <button
      ref={ref}
      type="button"
      className={composeClassName(slotFns.base(), className, classNames?.base)}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  );
});
