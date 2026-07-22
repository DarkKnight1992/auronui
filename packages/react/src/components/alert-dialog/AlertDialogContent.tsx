import { useLayoutEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import { Dialog as AriaDialog, Modal as AriaModal } from "react-aria-components";
import { alertDialogVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { useOverlayLayer } from "../../hooks/useOverlayLayer";
import { useAlertDialogContext } from "./alert-dialog.context";
import { AlertDialogOverlay } from "./AlertDialogOverlay";

export interface AlertDialogContentProps {
  children: ReactNode;
  className?: ClassValue;
}

/**
 * Writes `data-state="open"|"closed"` onto both the positioning `<div>`
 * (`.alert-dialog__container`) and the dialog box (`.alert-dialog__dialog`) —
 * see `modal/ModalContent.tsx`'s identical `ModalDialogStateAttrs`.
 */
function AlertDialogStateAttrs({
  containerRef,
  dialogRef,
  isExiting,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  dialogRef: RefObject<HTMLDivElement | null>;
  isExiting: boolean;
}) {
  useLayoutEffect(() => {
    const state = isExiting ? "closed" : "open";
    containerRef.current?.setAttribute("data-state", state);
    dialogRef.current?.setAttribute("data-state", state);
  });
  return null;
}

/**
 * Renders the backdrop (`AlertDialogOverlay`) + positioning wrapper
 * (`.alert-dialog__container`) + dialog surface (react-aria-components'
 * `Modal`, styled as `.alert-dialog__dialog`) + dialog semantics (`Dialog`
 * with `role="alertdialog"`), matching `alertDialogVariants`' backdrop/
 * container/dialog slots one-for-one with Vue's `AlertDialogOverlay` +
 * `AlertDialogContent` split.
 *
 * `role="alertdialog"` is passed straight through to react-aria-components'
 * `Dialog` — `AriaDialogProps.role` is explicitly typed as
 * `'dialog' | 'alertdialog'` and read directly by `useDialog()`, so no extra
 * plumbing is required to get the correct ARIA role (confirmed by reading
 * `react-aria`'s `useDialog` source).
 */
export function AlertDialogContent({ children, className }: AlertDialogContentProps) {
  const ctx = useAlertDialogContext();
  const styles = alertDialogVariants();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const layer = useOverlayLayer();

  return (
    <AlertDialogOverlay style={{ "--z-modal-backdrop": layer.backdropZIndex } as CSSProperties}>
      <div
        ref={containerRef}
        className={styles.container()}
        style={{ "--z-modal": layer.panelZIndex } as CSSProperties}
        data-placement={ctx.placement}
      >
        <AriaModal
          ref={dialogRef}
          className={composeClassName(styles.dialog({ size: ctx.size }), className)}
          data-placement={ctx.placement}
        >
          {({ isExiting }) => (
            <>
              <AlertDialogStateAttrs containerRef={containerRef} dialogRef={dialogRef} isExiting={isExiting} />
              <AriaDialog role="alertdialog" aria-describedby={ctx.descriptionId} className="contents">
                {children}
              </AriaDialog>
            </>
          )}
        </AriaModal>
      </div>
    </AlertDialogOverlay>
  );
}
