import { useLayoutEffect, useRef, type ReactNode, type RefObject } from "react";
import { Dialog as AriaDialog, Popover as AriaPopover } from "react-aria-components";
import type { Placement } from "react-aria-components";
import type { PlacementAxis } from "react-aria";
import { popoverVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { usePopoverContext } from "./popover.context";

export interface PopoverContentProps {
  /** @default 'bottom' */
  side?: "top" | "right" | "bottom" | "left";
  /** @default 8 */
  sideOffset?: number;
  /** @default true */
  sideFlip?: boolean;
  /** @default 'center' */
  align?: "start" | "center" | "end";
  /** @default 0 */
  alignOffset?: number;
  /** @default 8 */
  collisionPadding?: number;
  className?: ClassValue;
  /**
   * Accessible name for the dialog. Required unless `children` includes a heading — Vue's
   * `Popover` has no dedicated title subcomponent either (`popoverVariants().heading` exists as a
   * CSS slot only), so this is the escape hatch react-aria-components' `useDialog()` needs to
   * avoid an unlabelled-dialog a11y violation when the content has no heading of its own.
   */
  "aria-label"?: string;
  children?: ReactNode;
}

function toPlacement(
  side: NonNullable<PopoverContentProps["side"]>,
  align: NonNullable<PopoverContentProps["align"]>,
): Placement {
  if (align === "center") return side;
  return `${side} ${align}` as Placement;
}

/**
 * Writes `data-state`/`data-side` onto the popover's DOM node so `popover.css` (authored against
 * reka-ui's `data-state="open"|"closed"` + `data-side="top|right|bottom|left"`) applies unchanged
 * — react-aria-components exposes this as the `isExiting`/`placement` render props, not DOM
 * attributes. Mirrors `HoverCardContent`'s `HoverCardStateAttrs`/`TooltipContent`'s equivalent
 * bridge.
 */
function PopoverStateAttrs({
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

/**
 * The popover surface, portaled and positioned by react-aria-components' `Popover` used
 * standalone (`isOpen`/`triggerRef` driven externally from `Popover`'s context) — same recipe as
 * `HoverCardContent`, so floating-ui placement/collision logic is reused rather than reimplemented.
 *
 * If a `PopoverAnchor` attached its ref, positioning targets that element instead of the trigger.
 *
 * Prop mapping vs. the Vue/reka-ui version:
 * - `side` + `align` -> RAC's single `placement` string (e.g. `"bottom start"`), since RAC's
 *   `Placement` type already uses the same logical `start`/`end` vocabulary reka-ui does.
 * - `sideOffset` -> `offset`, `alignOffset` -> `crossOffset`, `sideFlip` -> `shouldFlip`,
 *   `collisionPadding` -> `containerPadding` (RAC only accepts a single number here, not a
 *   per-side object, unlike reka-ui — a deviation).
 * - `avoidCollisions`, `alignFlip`, `collisionBoundary`, `arrowPadding`, `hideShiftedArrow`,
 *   `sticky`, `hideWhenDetached`, `positionStrategy`, `updatePositionStrategy`,
 *   `disableUpdateOnLayoutShift`, `prioritizePosition` have no RAC equivalent and are dropped.
 */
export function PopoverContent({
  side = "bottom",
  sideOffset = 8,
  sideFlip = true,
  align = "center",
  alignOffset = 0,
  collisionPadding = 8,
  className,
  "aria-label": ariaLabel,
  children,
}: PopoverContentProps) {
  const ctx = usePopoverContext();
  const contentRef = useRef<HTMLElement | null>(null);
  const styles = popoverVariants();
  const placement = toPlacement(side, align);

  return (
    <AriaPopover
      ref={contentRef}
      isOpen={ctx.isOpen}
      onOpenChange={(next) => (next ? ctx.open() : ctx.close())}
      isNonModal={!ctx.modal}
      triggerRef={ctx.anchorRef.current ? ctx.anchorRef : ctx.triggerRef}
      placement={placement}
      offset={sideOffset}
      crossOffset={alignOffset}
      shouldFlip={sideFlip}
      containerPadding={collisionPadding}
      className={composeClassName(styles.base(), className)}
    >
      {({ isExiting, placement: resolvedPlacement }) => (
        <>
          <PopoverStateAttrs elementRef={contentRef} isExiting={isExiting} placement={resolvedPlacement} />
          <AriaDialog aria-label={ariaLabel} className={styles.dialog()}>
            {children}
          </AriaDialog>
        </>
      )}
    </AriaPopover>
  );
}
