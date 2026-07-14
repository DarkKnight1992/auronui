import { forwardRef, useMemo, type ComponentPropsWithoutRef } from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { menubarVariants, menuVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface MenubarContentOwnProps {
  ariaLabel?: string;
  sideOffset?: number;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  alignOffset?: number;
  className?: ClassValue;
  /** Portal container element. */
  container?: HTMLElement | null;
  /** Force content to stay mounted even when closed. */
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

export type MenubarContentProps = MenubarContentOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof MenubarContentOwnProps | "onEscapeKeyDown" | "onFocus"> & {
    onEscapeKeyDown?: (event: KeyboardEvent) => void;
    onPointerDownOutside?: (event: Event) => void;
    onFocusOutside?: (event: Event) => void;
    onInteractOutside?: (event: Event) => void;
    onCloseAutoFocus?: (event: Event) => void;
  };

/**
 * Deviation from the Vue version: reka-ui/floating-ui-specific positioning props
 * (`sideFlip`, `alignFlip`, `positionStrategy`, `disableUpdateOnLayoutShift`,
 * `hideShiftedArrow`, `prioritizePosition`, `reference`, `to`, `portalDisabled`,
 * `defer`) have no equivalent on Radix's Popper-based `Content` and are dropped.
 * Radix always flips side/align automatically when `avoidCollisions` is true.
 */
export const MenubarContent = forwardRef<HTMLDivElement, MenubarContentProps>(
  function MenubarContent(
    {
      ariaLabel,
      sideOffset = 8,
      side = "bottom",
      align = "start",
      alignOffset = 0,
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
      onCloseAutoFocus,
      ...rest
    },
    ref,
  ) {
    const slots = useMemo(() => menubarVariants(), []);

    return (
      <MenubarPrimitive.Portal container={container} forceMount={forceMount}>
        <MenubarPrimitive.Content
          ref={ref}
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          aria-label={ariaLabel}
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
          onCloseAutoFocus={onCloseAutoFocus}
          {...rest}
        >
          <div className={menuVariants()}>{children}</div>
        </MenubarPrimitive.Content>
      </MenubarPrimitive.Portal>
    );
  },
);
