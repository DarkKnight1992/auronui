import { isValidElement, cloneElement, type ReactElement } from "react";
import { useAlertDialogContext } from "./alert-dialog.context";

export interface AlertDialogTriggerProps {
  /** A single element (typically Auron's `<Button>`) that becomes the AlertDialog's open trigger. */
  children: ReactElement<Record<string, unknown>>;
}

/** Wraps a single child element and wires it to open the AlertDialog (asChild-style, mirrors Vue's AlertDialogTrigger.vue). */
export function AlertDialogTrigger({ children }: AlertDialogTriggerProps) {
  const ctx = useAlertDialogContext();
  if (!isValidElement(children)) return children;
  const childProps = children.props as { onClick?: (event: unknown) => void };
  return cloneElement(children, {
    onClick: (event: unknown) => {
      childProps.onClick?.(event);
      ctx.open();
    },
    "aria-haspopup": "dialog",
    "aria-expanded": ctx.isOpen || undefined,
  } as Record<string, unknown>);
}
