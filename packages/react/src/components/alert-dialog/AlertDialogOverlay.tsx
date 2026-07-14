import { useLayoutEffect, useRef, type ReactNode, type RefObject } from "react";
import { ModalOverlay as AriaModalOverlay } from "react-aria-components";
import { alertDialogVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { useAlertDialogContext } from "./alert-dialog.context";

export interface AlertDialogOverlayProps {
  children: ReactNode;
  className?: ClassValue;
}

/**
 * Writes `data-state="open"|"closed"` onto the backdrop's DOM node so
 * alert-dialog.css applies unchanged — see `ModalOverlay.tsx`'s identical
 * `ModalBackdropStateAttrs`. AlertDialog never got this fix originally because
 * it's a fully separate implementation (own overlay/content/CSS), not a
 * consumer of `modal/ModalOverlay.tsx`.
 */
function AlertDialogBackdropStateAttrs({
  elementRef,
  isExiting,
}: {
  elementRef: RefObject<HTMLElement | null>;
  isExiting: boolean;
}) {
  useLayoutEffect(() => {
    elementRef.current?.setAttribute("data-state", isExiting ? "closed" : "open");
  });
  return null;
}

/**
 * Renders react-aria-components' `ModalOverlay` (the dimmed backdrop) styled
 * via `alertDialogVariants().backdrop`.
 *
 * Alert dialogs are never dismissable by outside click/Escape per the WAI-ARIA
 * alertdialog pattern (an explicit Action/Cancel button is required) —
 * `isDismissable` is always `false`, unlike `Modal`'s `ModalOverlay`.
 */
export function AlertDialogOverlay({ children, className }: AlertDialogOverlayProps) {
  const ctx = useAlertDialogContext();
  const styles = alertDialogVariants();
  const overlayRef = useRef<HTMLDivElement | null>(null);

  return (
    <AriaModalOverlay
      ref={overlayRef}
      isOpen={ctx.isOpen}
      onOpenChange={(next) => (next ? ctx.open() : ctx.close())}
      isDismissable={false}
      className={composeClassName(styles.backdrop({ variant: ctx.variant }), className)}
    >
      {({ isExiting }) => (
        <>
          <AlertDialogBackdropStateAttrs elementRef={overlayRef} isExiting={isExiting} />
          {children}
        </>
      )}
    </AriaModalOverlay>
  );
}
