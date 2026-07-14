import { useLayoutEffect, useRef, type PointerEvent, type ReactNode, type RefObject } from "react";
import { Popover } from "react-aria-components";
import type { Placement } from "react-aria-components";
import type { PlacementAxis } from "react-aria";
import { hoverCardVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { useHoverCardContext } from "./hover-card.context";

export interface HoverCardContentProps {
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  sideFlip?: boolean;
  align?: "start" | "center" | "end";
  alignOffset?: number;
  containerPadding?: number;
  className?: ClassValue;
  children?: ReactNode;
}

function toPlacement(
  side: NonNullable<HoverCardContentProps["side"]>,
  align: NonNullable<HoverCardContentProps["align"]>,
): Placement {
  if (align === "center") return side;
  return `${side} ${align}` as Placement;
}

/**
 * Writes `data-state`/`data-side` onto the popover's DOM node so
 * `hover-card.css` (authored against Reka UI's `data-state="open"|"closed"` +
 * `data-side="top|right|bottom|left"`) applies unchanged — mirrors
 * `TooltipContent`'s `TooltipStateAttrs` bridge for the same reason
 * (react-aria-components exposes this as render props, not DOM attributes).
 */
function HoverCardStateAttrs({
  elementRef,
  isExiting,
  placement,
}: {
  elementRef: RefObject<HTMLElement | null>;
  isExiting: boolean;
  placement: PlacementAxis | null;
}) {
  useLayoutEffect(() => {
    const el = elementRef.current;
    if (!el) return;
    el.setAttribute("data-state", isExiting ? "closed" : "open");
    if (placement) el.setAttribute("data-side", placement);
    else el.removeAttribute("data-side");
  });
  return null;
}

export function HoverCardContent({
  side = "bottom",
  sideOffset = 8,
  sideFlip = true,
  align = "center",
  alignOffset = 0,
  containerPadding = 8,
  className,
  children,
}: HoverCardContentProps) {
  const ctx = useHoverCardContext();
  const contentRef = useRef<HTMLElement | null>(null);
  const styles = hoverCardVariants();
  const placement = toPlacement(side, align);

  function handlePointerEnter() {
    ctx.cancelClose();
  }

  function handlePointerLeave(event: PointerEvent) {
    if (event.pointerType === "touch") return;
    ctx.scheduleClose();
  }

  return (
    <Popover
      ref={contentRef}
      isOpen={ctx.isOpen}
      onOpenChange={(isOpen) => {
        // Only reacts to closes triggered by react-aria itself (Escape key,
        // outside interaction) — opens are exclusively driven by hover/focus
        // scheduling in HoverCard/HoverCardTrigger.
        if (!isOpen) ctx.scheduleClose(true);
      }}
      isNonModal
      triggerRef={ctx.triggerRef}
      placement={placement}
      offset={sideOffset}
      crossOffset={alignOffset}
      shouldFlip={sideFlip}
      containerPadding={containerPadding}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={composeClassName(styles.base(), className)}
    >
      {({ isExiting, placement: resolvedPlacement }) => (
        <>
          <HoverCardStateAttrs elementRef={contentRef} isExiting={isExiting} placement={resolvedPlacement} />
          {children}
        </>
      )}
    </Popover>
  );
}
