import { useLayoutEffect, useRef, type ReactNode, type RefObject } from "react";
import { Dialog as AriaDialog, Modal as AriaModal } from "react-aria-components";
import { modalVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { useModalContext } from "./modal.context";
import { ModalOverlay } from "./ModalOverlay";

export interface ModalContentProps {
  children: ReactNode;
  className?: ClassValue;
  /** Dialog accessibility role. AlertDialogContent reuses this component with "alertdialog". */
  role?: "dialog" | "alertdialog";
  /** Whether clicking outside / pressing Escape dismisses the Modal. Defaults to true, matching Vue's default DialogContent behavior. */
  isDismissable?: boolean;
}

/**
 * Writes `data-state="open"|"closed"` onto both the positioning `<div>`
 * (`.modal__container`, a plain element with no render props of its own) and the
 * dialog box (`.modal__dialog`) so modal.css's zoom/slide enter-exit blocks — gated
 * on `[data-state="open"|"closed"]`, reka-ui's convention — apply unchanged. RAC only
 * exposes this as the `isExiting` render prop on `AriaModal` itself, not a DOM
 * attribute and not to arbitrary ancestor/sibling elements, so both refs are driven
 * from that one callback. Mirrors `PopoverContent`'s `PopoverStateAttrs`.
 */
function ModalDialogStateAttrs({
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
 * Renders the backdrop (`ModalOverlay`) + positioning wrapper (`.modal__container`)
 * + dialog surface (react-aria-components' `Modal`, styled as `.modal__dialog`) +
 * dialog semantics (`Dialog`), matching `modalVariants`' backdrop/container/dialog
 * slots one-for-one with Vue's `ModalOverlay` + `DialogContent` split.
 */
export function ModalContent({ children, className, role = "dialog", isDismissable = true }: ModalContentProps) {
  const ctx = useModalContext();
  const styles = modalVariants();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  return (
    <ModalOverlay isDismissable={isDismissable}>
      <div
        ref={containerRef}
        className={styles.container({ scroll: ctx.scroll, size: ctx.size })}
        data-placement={ctx.placement}
      >
        <AriaModal
          ref={dialogRef}
          className={composeClassName(styles.dialog({ size: ctx.size, scroll: ctx.scroll }), className)}
          data-placement={ctx.placement}
        >
          {({ isExiting }) => (
            <>
              <ModalDialogStateAttrs containerRef={containerRef} dialogRef={dialogRef} isExiting={isExiting} />
              <AriaDialog role={role} aria-describedby={ctx.descriptionId} className="contents">
                {children}
              </AriaDialog>
            </>
          )}
        </AriaModal>
      </div>
    </ModalOverlay>
  );
}
