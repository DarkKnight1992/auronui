import { useId, useMemo, type ReactNode } from "react";
import type { AlertDialogVariants } from "@auronui/styles";
import { useOverlayState } from "../../hooks";
import { AlertDialogProvider, type AlertDialogPlacement } from "./alert-dialog.context";

export interface AlertDialogProps {
  children: ReactNode;
  defaultOpen?: boolean;
  /** Controlled open state. Omit for uncontrolled usage. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: AlertDialogVariants["size"];
  variant?: AlertDialogVariants["variant"];
  placement?: AlertDialogPlacement;
  status?: AlertDialogVariants["status"];
}

/**
 * AlertDialog root — same architecture as `Modal` (owns open state via
 * `useOverlayState`, threads size/variant/placement/status + open/close/toggle
 * down to descendants via context). See Modal.tsx for the full rationale on
 * why this owns state itself instead of relying on react-aria-components'
 * `DialogTrigger`.
 */
export function AlertDialog({
  children,
  defaultOpen = false,
  open,
  onOpenChange,
  size = "md",
  variant = "opaque",
  placement = "center",
  status = "danger",
}: AlertDialogProps) {
  const state = useOverlayState({ value: open, defaultOpen, onOpenChange });
  const descriptionId = useId();

  const contextValue = useMemo(
    () => ({
      isOpen: state.isOpen,
      open: state.open,
      close: state.close,
      toggle: state.toggle,
      size,
      variant,
      placement,
      status,
      descriptionId,
    }),
    [state.isOpen, state.open, state.close, state.toggle, size, variant, placement, status, descriptionId],
  );

  return <AlertDialogProvider value={contextValue}>{children}</AlertDialogProvider>;
}
