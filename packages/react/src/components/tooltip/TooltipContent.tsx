import { useLayoutEffect, useRef, type ReactNode, type RefObject } from "react";
import { Tooltip as AriaTooltip } from "react-aria-components";
import type { Placement } from "react-aria-components";
import type { PlacementAxis } from "react-aria";
import { tooltipVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface TooltipContentProps {
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
  side: NonNullable<TooltipContentProps["side"]>,
  align: NonNullable<TooltipContentProps["align"]>,
): Placement {
  if (align === "center") return side;
  return `${side} ${align}` as Placement;
}

/**
 * Writes `data-state`/`data-side` onto the tooltip's DOM node so `tooltip.css`
 * (authored against Reka UI's `data-state="delayed-open"|"instant-open"|"closed"`
 * and `data-side="top|right|bottom|left"` attributes) applies unchanged.
 * react-aria-components exposes the equivalent info as `isEntering`/`isExiting`/
 * `placement` render props instead of DOM attributes, so this bridges the two.
 * It's a real component (not a bare render-prop callback) so `useLayoutEffect`
 * gets its own fiber/hook slot instead of borrowing react-aria's Tooltip's hooks.
 */
function TooltipStateAttrs({
  elementRef,
  isEntering,
  isExiting,
  placement,
}: {
  elementRef: RefObject<HTMLDivElement | null>;
  isEntering: boolean;
  isExiting: boolean;
  placement: PlacementAxis | null;
}) {
  useLayoutEffect(() => {
    const el = elementRef.current;
    if (!el) return;
    el.setAttribute("data-state", isExiting ? "closed" : isEntering ? "delayed-open" : "open");
    if (placement) el.setAttribute("data-side", placement);
    else el.removeAttribute("data-side");
  });
  return null;
}

export function TooltipContent({
  side = "top",
  sideOffset = 8,
  sideFlip = true,
  align = "center",
  alignOffset = 0,
  containerPadding = 8,
  className,
  children,
}: TooltipContentProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const styles = tooltipVariants();
  const placement = toPlacement(side, align);

  return (
    <AriaTooltip
      ref={tooltipRef}
      placement={placement}
      offset={sideOffset}
      crossOffset={alignOffset}
      shouldFlip={sideFlip}
      containerPadding={containerPadding}
      className={composeClassName(styles.base(), className)}
    >
      {({ isEntering, isExiting, placement: resolvedPlacement }) => (
        <>
          <TooltipStateAttrs
            elementRef={tooltipRef}
            isEntering={isEntering}
            isExiting={isExiting}
            placement={resolvedPlacement}
          />
          {children}
        </>
      )}
    </AriaTooltip>
  );
}
