import { forwardRef, type ComponentPropsWithoutRef } from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { contextMenuVariants, menuVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface ContextMenuContentOwnProps {
  ariaLabel?: string;
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
  /** Hide content when fully detached from the pointer position. */
  hideWhenDetached?: boolean;
  /** When to recalculate position. */
  updatePositionStrategy?: "always" | "optimized";
  /** Merge props onto the single child element instead of rendering Radix's own wrapper. */
  asChild?: boolean;
}

export type ContextMenuContentProps = ContextMenuContentOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof ContextMenuContentOwnProps | "onEscapeKeyDown" | "onFocus"> & {
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
 * `defer`, `as`) have no equivalent on Radix's Popper-based `Content` and are
 * dropped — matching this repo's `MenubarContent` precedent. There is no `side`/
 * `align`/`sideOffset` (same as the Vue version — the content is positioned at the
 * cursor/right-click point, not relative to the trigger).
 */
export const ContextMenuContent = forwardRef<HTMLDivElement, ContextMenuContentProps>(
  function ContextMenuContent(
    {
      ariaLabel,
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
    const slots = contextMenuVariants();

    return (
      <ContextMenuPrimitive.Portal container={container} forceMount={forceMount}>
        <ContextMenuPrimitive.Content
          ref={ref}
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
        </ContextMenuPrimitive.Content>
      </ContextMenuPrimitive.Portal>
    );
  },
);
