import { useLayoutEffect, useRef, type ReactNode, type RefObject } from "react";
import { ModalOverlay as AriaModalOverlay } from "react-aria-components";
import { drawerVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { useDrawerContext } from "./drawer.context";

export interface DrawerOverlayProps {
  children: ReactNode;
  className?: ClassValue;
}

/**
 * Writes `data-state="open"|"closed"` onto the overlay's DOM node so `drawer.css` (authored
 * against reka-ui's `data-state` attribute) applies unchanged — react-aria-components exposes
 * this as the `isExiting` render prop, not a DOM attribute. Mirrors `HoverCardContent`'s
 * `HoverCardStateAttrs`/`TooltipContent`'s equivalent bridge.
 */
function DrawerBackdropStateAttrs({
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
 * Renders react-aria-components' `ModalOverlay` (the dimmed backdrop behind the drawer panel),
 * styled via `drawerVariants().backdrop`. Used internally by `DrawerContent` for default / inline
 * modes (dock mode has no backdrop).
 *
 * Deviation from Vue: Vue's `DrawerOverlay.vue` renders as a sibling of `DialogContent` inside a
 * shared `DialogPortal`. react-aria-components requires `ModalOverlay` to be the ancestor of
 * `Modal`/`Dialog` so they can share overlay state through React context — so `DrawerContent`
 * nests its panel inside this component instead of rendering it alongside, matching this
 * package's `ModalOverlay`/`ModalContent` split.
 */
export function DrawerOverlay({ children, className }: DrawerOverlayProps) {
  const ctx = useDrawerContext();
  const styles = drawerVariants();
  const overlayRef = useRef<HTMLDivElement | null>(null);

  return (
    <AriaModalOverlay
      ref={overlayRef}
      isOpen={ctx.isOpen}
      onOpenChange={(next) => (next ? ctx.open() : ctx.close())}
      isDismissable={!ctx.hideBackdrop}
      isKeyboardDismissDisabled={ctx.hideBackdrop}
      className={composeClassName(
        styles.backdrop(),
        ctx.hideBackdrop && "pointer-events-none opacity-0",
        className,
      )}
    >
      {({ isExiting }) => (
        <>
          <DrawerBackdropStateAttrs elementRef={overlayRef} isExiting={isExiting} />
          {children}
        </>
      )}
    </AriaModalOverlay>
  );
}
