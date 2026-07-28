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

export interface AlertDialogActionOwnProps {
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

export type AlertDialogActionProps = AlertDialogActionOwnProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof AlertDialogActionOwnProps>;

/**
 * AlertDialogAction — confirm button for destructive flows.
 *
 * Mirrors Vue's AlertDialogAction.vue: reka-ui's `AlertDialogAction` wraps
 * `DialogClose`, so clicking it both fires the consumer's `onClick` AND
 * closes the dialog — it does not natively distinguish "confirm" from
 * "cancel" behaviorally, only visually (variant/color). This React port
 * preserves that: `onClick` runs first, then `close()` fires, UNLESS
 * `onClick` calls `event.preventDefault()` — e.g. to keep the dialog open
 * while an async action (delete/publish/etc.) is in flight — in which case
 * the caller is responsible for calling `ctx.close()` once it resolves.
 */
export const AlertDialogAction = forwardRef<HTMLButtonElement, AlertDialogActionProps>(function AlertDialogAction(
  { variant = "danger", size = "md", className, classNames, onClick, children, ...rest },
  ref,
) {
  const ctx = useAlertDialogContext();

  const resolvedVariant = useMemo(() => {
    if (variant === "outline") {
      warnDeprecatedVariant("AlertDialogAction", "outline", "bordered");
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
