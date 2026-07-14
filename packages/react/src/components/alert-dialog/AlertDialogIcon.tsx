import type { ReactNode } from "react";
import { alertDialogVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { useAlertDialogContext } from "./alert-dialog.context";

export interface AlertDialogIconProps {
  children?: ReactNode;
  className?: ClassValue;
  status?: "default" | "accent" | "danger" | "success" | "warning";
}

function DefaultIcon({ status }: { status: "default" | "accent" | "danger" | "success" | "warning" }) {
  const common = {
    "data-slot": "alert-dialog-default-icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (status === "danger") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="m9 9 6 6" />
        <path d="m15 9-6 6" />
      </svg>
    );
  }
  if (status === "warning") {
    return (
      <svg {...common}>
        <path d="M12 3.5 2.8 19.5a1.2 1.2 0 0 0 1 1.8h16.4a1.2 1.2 0 0 0 1-1.8L12 3.5Z" />
        <path d="M12 10v4" />
        <path d="M12 17.5h.01" />
      </svg>
    );
  }
  if (status === "success") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="m8.5 12.5 2.5 2.5 4.5-5" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01" />
      <path d="M11 12h1v4h1" />
    </svg>
  );
}

/** Status-colored icon badge. Renders a built-in glyph per status unless `children` overrides it. */
export function AlertDialogIcon({ children, className, status }: AlertDialogIconProps) {
  const ctx = useAlertDialogContext();
  const styles = alertDialogVariants();
  const resolvedStatus = status ?? ctx.status ?? "danger";

  return (
    <span className={composeClassName(styles.icon({ status: resolvedStatus }), className)} aria-hidden="true">
      {children ?? <DefaultIcon status={resolvedStatus} />}
    </span>
  );
}
