import { forwardRef, type ComponentPropsWithoutRef } from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { menubarVariants, menuVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface MenubarSubContentOwnProps {
  sideOffset?: number;
  alignOffset?: number;
  className?: ClassValue;
  /** Portal container element. */
  container?: HTMLElement | null;
  /** Keep sub-content mounted even when closed. */
  forceMount?: true;
  /** Keep keyboard focus loop within the content. */
  loop?: boolean;
  /** Avoid collisions with the viewport edges. */
  avoidCollisions?: boolean;
  /** Boundary element(s) for collision detection. */
  collisionBoundary?: Element | null | Array<Element | null>;
  /** Padding around collision boundary. */
  collisionPadding?: number | Partial<Record<"top" | "right" | "bottom" | "left", number>>;
  /** Padding between content and arrow. */
  arrowPadding?: number;
  /** Sticky behavior when scrolling. */
  sticky?: "partial" | "always";
  /** Hide content when fully detached from trigger. */
  hideWhenDetached?: boolean;
  /** When to recalculate position. */
  updatePositionStrategy?: "always" | "optimized";
  /** Merge props onto the single child element instead of rendering Radix's own wrapper. */
  asChild?: boolean;
}

export type MenubarSubContentProps = MenubarSubContentOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof MenubarSubContentOwnProps | "onEscapeKeyDown"> & {
    onEscapeKeyDown?: (event: KeyboardEvent) => void;
    onPointerDownOutside?: (event: Event) => void;
    onFocusOutside?: (event: Event) => void;
    onInteractOutside?: (event: Event) => void;
  };

/**
 * Deviation from the Vue version: same reka-ui/floating-ui-specific positioning props dropped
 * as in MenubarContent (`sideFlip`, `alignFlip`, `positionStrategy`,
 * `disableUpdateOnLayoutShift`, `hideShiftedArrow`, `prioritizePosition`, `reference`, `to`,
 * `portalDisabled`, `defer`) — no Radix equivalent. `close-auto-focus` and `open-auto-focus` are
 * also dropped: Radix's `MenuSubContentProps` explicitly omits `onCloseAutoFocus` and never
 * exposed `onOpenAutoFocus` (both `MenuContentImplPrivateProps` keys are stripped) — a
 * submenu's auto-focus behavior on open/close is always handled internally by Radix, returning
 * focus to/from its trigger.
 */
export const MenubarSubContent = forwardRef<HTMLDivElement, MenubarSubContentProps>(
  function MenubarSubContent(
    {
      sideOffset = 4,
      alignOffset = -5,
      className,
      container,
      forceMount,
      loop,
      avoidCollisions,
      collisionBoundary,
      collisionPadding,
      arrowPadding,
      sticky,
      hideWhenDetached,
      updatePositionStrategy,
      asChild,
      children,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      ...rest
    },
    ref,
  ) {
    const slots = menubarVariants();

    return (
      <MenubarPrimitive.Portal container={container} forceMount={forceMount}>
        <MenubarPrimitive.SubContent
          ref={ref}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          forceMount={forceMount}
          loop={loop}
          avoidCollisions={avoidCollisions}
          collisionBoundary={collisionBoundary}
          collisionPadding={collisionPadding}
          arrowPadding={arrowPadding}
          sticky={sticky}
          hideWhenDetached={hideWhenDetached}
          updatePositionStrategy={updatePositionStrategy}
          asChild={asChild}
          className={composeClassName(slots.popover(), className)}
          onEscapeKeyDown={onEscapeKeyDown}
          onPointerDownOutside={onPointerDownOutside}
          onFocusOutside={onFocusOutside}
          onInteractOutside={onInteractOutside}
          {...rest}
        >
          <div className={menuVariants()}>{children}</div>
        </MenubarPrimitive.SubContent>
      </MenubarPrimitive.Portal>
    );
  },
);
