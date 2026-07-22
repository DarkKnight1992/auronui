import { useLayoutEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import { Dialog as AriaDialog, Modal as AriaModal } from "react-aria-components";
import { drawerVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { useOverlayLayer } from "../../hooks/useOverlayLayer";
import { useDrawerContext } from "./drawer.context";
import { DrawerOverlay } from "./DrawerOverlay";

export interface DrawerContentProps {
  children: ReactNode;
  className?: ClassValue;
}

/**
 * Writes `data-state="open"|"closed"` onto the panel's DOM node so `drawer.css`'s per-placement
 * slide keyframes (authored against reka-ui's `data-state` attribute) apply unchanged —
 * react-aria-components exposes this as the `isExiting` render prop, not a DOM attribute. Mirrors
 * `DrawerOverlay`'s `DrawerBackdropStateAttrs` / `HoverCardContent`'s equivalent bridge.
 */
function DrawerPanelStateAttrs({
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
 * The drawer panel itself.
 *
 * - dock mode: a plain DOM-flow `div` toggled via `hidden` (no react-aria-components dialog
 *   machinery). The Vue version animates the dock width/height slide with a Vue `<Transition>`,
 *   which has no React equivalent in scope here; omitted — the panel appears/disappears instantly.
 * - default / inline modes: `DrawerOverlay` (backdrop) > react-aria-components `Modal` (positioned
 *   panel, styled via `drawerVariants().dialog(...)`) > `Dialog` (a11y semantics / focus scope),
 *   matching this package's `ModalOverlay` > `Modal` > `Dialog` split in `ModalContent`.
 */
export function DrawerContent({ children, className }: DrawerContentProps) {
  const ctx = useDrawerContext();
  const styles = drawerVariants();
  const panelRef = useRef<HTMLDivElement | null>(null);
  // Called unconditionally (Rules of Hooks) even though dock mode — a plain
  // DOM-flow panel, not a page-level overlay — doesn't use the claimed layer.
  const layer = useOverlayLayer();

  if (ctx.dock) {
    return (
      <div
        className={composeClassName(styles.dialog({ placement: ctx.placement, dock: true }), className)}
        data-placement={ctx.placement}
        data-state={ctx.isOpen ? "open" : "closed"}
        hidden={!ctx.isOpen}
      >
        {children}
      </div>
    );
  }

  return (
    <DrawerOverlay style={{ "--z-modal-backdrop": layer.backdropZIndex } as CSSProperties}>
      <AriaModal
        ref={panelRef}
        className={composeClassName(
          styles.dialog({ placement: ctx.placement, inline: ctx.inline }),
          className,
        )}
        style={{ "--z-modal": layer.panelZIndex } as CSSProperties}
        data-placement={ctx.placement}
      >
        {({ isExiting }) => (
          <>
            <DrawerPanelStateAttrs elementRef={panelRef} isExiting={isExiting} />
            <AriaDialog className="flex min-h-0 flex-1 flex-col outline-none">{children}</AriaDialog>
          </>
        )}
      </AriaModal>
    </DrawerOverlay>
  );
}
