import { useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { alertVariants, buttonVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export type AlertSeverity = "default" | "primary" | "accent" | "success" | "warning" | "danger";

// Map public severity API to internal @auronui/styles status variant.
const statusMap: Record<AlertSeverity, AlertSeverity> = {
  default: "default",
  primary: "primary",
  accent: "accent",
  success: "success",
  warning: "warning",
  danger: "danger",
};

export interface AlertOwnProps {
  /** Severity/status of the alert */
  severity?: AlertSeverity;
  /** Whether the alert can be dismissed by the user */
  isClosable?: boolean;
  /** Custom icon, replacing the built-in per-severity icon */
  icon?: ReactNode;
  className?: ClassValue;
  onClose?: () => void;
  children?: ReactNode;
}

export type AlertProps = AlertOwnProps & Omit<ComponentPropsWithoutRef<"div">, keyof AlertOwnProps>;

function DefaultAlertIcon({ severity }: { severity: AlertSeverity }) {
  if (severity === "success") {
    return (
      <svg
        data-slot="alert-default-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="m8.5 12.5 2.5 2.5 4.5-5" />
      </svg>
    );
  }
  if (severity === "warning") {
    return (
      <svg
        data-slot="alert-default-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3.5 2.8 19.5a1.2 1.2 0 0 0 1 1.8h16.4a1.2 1.2 0 0 0 1-1.8L12 3.5Z" />
        <path d="M12 10v4" />
        <path d="M12 17.5h.01" />
      </svg>
    );
  }
  if (severity === "danger") {
    return (
      <svg
        data-slot="alert-default-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="m9 9 6 6" />
        <path d="m15 9-6 6" />
      </svg>
    );
  }
  // default / primary / accent: info circle
  return (
    <svg
      data-slot="alert-default-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01" />
      <path d="M11 12h1v4h1" />
    </svg>
  );
}

export function Alert({
  severity = "default",
  isClosable = false,
  icon,
  className,
  onClose,
  children,
  ...rest
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  function dismiss() {
    setIsVisible(false);
    onClose?.();
  }

  const styles = alertVariants({ status: statusMap[severity] });
  // CloseButton.vue's own default variant/color mapping, used to keep the
  // dismiss button visually identical: ghost variant, color = alert severity.
  const closeButtonClass = buttonVariants({
    variant: "ghost",
    color: statusMap[severity],
    size: "sm",
    isIconOnly: true,
  }).base();

  if (!isVisible) return null;

  return (
    // Deviation from Alert.vue: the Vue version wraps this in
    // AnimatePresence/motion.div for an exit fade+collapse animation.
    // framer-motion isn't used anywhere else in @auronui/react yet, and
    // adding the first usage here (with the jsdom/test reliability work
    // that comes with animation-exit testing) is out of scope for this
    // presentational-component batch — dismissal is an immediate unmount.
    <div role="alert" className={composeClassName(styles.base(), className)} {...rest}>
      <span className={styles.indicator()} aria-hidden="true">
        {icon ?? <DefaultAlertIcon severity={severity} />}
      </span>

      <div className={styles.content()}>{children}</div>

      {isClosable && (
        // Raw <button> (not <Button>): CloseButton hasn't been ported to
        // @auronui/react yet, and pulling in the full Button component
        // here would be out of scope for this batch — inlined with the
        // same X glyph/markup CloseButton.vue uses.
        <button
          type="button"
          className={closeButtonClass}
          aria-label="Dismiss alert"
          data-slot="close-button"
          onClick={dismiss}
        >
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
        </button>
      )}
    </div>
  );
}
