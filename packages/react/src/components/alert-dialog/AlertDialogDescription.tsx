import type { ReactNode } from "react";
import { Text } from "react-aria-components";
import { composeClassName, type ClassValue } from "../../utils";
import { useAlertDialogContext } from "./alert-dialog.context";

export interface AlertDialogDescriptionProps {
  children?: ReactNode;
  className?: ClassValue;
}

/**
 * Renders `<Text slot="description">` sharing the same `id` that
 * `AlertDialogContent` wires as `Dialog`'s `aria-describedby` (via
 * `AlertDialogContext.descriptionId`) — see `ModalDescription` for the full
 * rationale on why this wiring is manual (react-aria-components' `Dialog`
 * only auto-wires `aria-labelledby` from a title `Heading`, not descriptions).
 */
export function AlertDialogDescription({ children, className }: AlertDialogDescriptionProps) {
  const ctx = useAlertDialogContext();
  return (
    <Text id={ctx.descriptionId} slot="description" className={composeClassName("text-sm text-muted", className)}>
      {children}
    </Text>
  );
}
