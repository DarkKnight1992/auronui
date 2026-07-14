import { useLayoutEffect, useRef, type ReactNode, type RefObject } from "react";
import { ModalOverlay as AriaModalOverlay } from "react-aria-components";
import { modalVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { useModalContext } from "./modal.context";

export interface ModalOverlayProps {
  children: ReactNode;
  className?: ClassValue;
  /** Whether clicking outside / pressing Escape dismisses the Modal. Defaults to true. */
  isDismissable?: boolean;
}

/**
 * Writes `data-state="open"|"closed"` onto the backdrop's DOM node so `modal.css`
 * (authored against reka-ui's `data-state` attribute) applies unchanged —
 * react-aria-components exposes this as the `isExiting` render prop, not a DOM
 * attribute. Mirrors `PopoverContent`'s `PopoverStateAttrs`/`HoverCardContent`'s
 * equivalent bridge.
 */
function ModalBackdropStateAttrs({
  elementRef,
  isExiting,
}: {
  elementRef: RefObject<HTMLDivElement | null>;
  isExiting: boolean;
}) {
  useLayoutEffect(() => {
    elementRef.current?.setAttribute("data-state", isExiting ? "closed" : "open");
  });
  return null;
}

/**
 * Renders react-aria-components' `ModalOverlay` (the dimmed backdrop),
 * styled via `modalVariants().backdrop`.
 *
 * Deviation from Vue: Vue's `ModalOverlay.vue` renders as a sibling of
 * `DialogContent` inside a shared portal wrapper (reka-ui's `DialogOverlay`
 * has no structural requirement to contain the dialog). react-aria-components
 * requires `ModalOverlay` to be the ancestor of `Modal`/`Dialog` so they can
 * share overlay state through React context — so `ModalContent` nests its
 * dialog box inside this component instead of rendering it alongside.
 */
export function ModalOverlay({ children, className, isDismissable = true }: ModalOverlayProps) {
  const ctx = useModalContext();
  const styles = modalVariants();
  const overlayRef = useRef<HTMLDivElement | null>(null);

  return (
    <AriaModalOverlay
      ref={overlayRef}
      isOpen={ctx.isOpen}
      onOpenChange={(next) => (next ? ctx.open() : ctx.close())}
      isDismissable={isDismissable}
      className={composeClassName(styles.backdrop({ variant: ctx.variant }), className)}
    >
      {({ isExiting }) => (
        <>
          <ModalBackdropStateAttrs elementRef={overlayRef} isExiting={isExiting} />
          {children}
        </>
      )}
    </AriaModalOverlay>
  );
}
