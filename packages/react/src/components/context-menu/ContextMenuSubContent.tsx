import { forwardRef, type ComponentPropsWithoutRef } from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { contextMenuVariants, menuVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface ContextMenuSubContentOwnProps {
  sideOffset?: number;
  alignOffset?: number;
  /** Controls the direction the sub-content appears from its anchor menu item. @default "start" */
  align?: "start" | "end";
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

export type ContextMenuSubContentProps = ContextMenuSubContentOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof ContextMenuSubContentOwnProps | "onEscapeKeyDown" | "onFocus"> & {
    onEscapeKeyDown?: (event: KeyboardEvent) => void;
    onPointerDownOutside?: (event: Event) => void;
    onFocusOutside?: (event: Event) => void;
    onInteractOutside?: (event: Event) => void;
  };

/**
 * Deviation from the Vue version: the Vue `ContextMenuSubContent` supports
 * `sideFlip`/`alignFlip`/`positionStrategy`/`disableUpdateOnLayoutShift`/
 * `hideShiftedArrow`/`prioritizePosition`/`reference`/`to`/`portalDisabled`/`defer`/`as`
 * (no Radix equivalent — same rationale as `ContextMenuContent`) and emits
 * `open-auto-focus`/`close-auto-focus`. Radix's `ContextMenuSubContent` type
 * (`MenuSubContentProps`) explicitly omits both auto-focus callbacks for sub-content
 * (focus handling is delegated to the parent `Content`'s focus scope), so neither is
 * exposed here. `align` is also narrower than the main `Content` — Radix's sub-content
 * can only align `"start"` (default) or `"end"` along the side it opens from, never
 * `"center"`.
 */
export const ContextMenuSubContent = forwardRef<HTMLDivElement, ContextMenuSubContentProps>(
  function ContextMenuSubContent(
    {
      sideOffset = 4,
      alignOffset = -5,
      align,
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
    const slots = contextMenuVariants();

    return (
      <ContextMenuPrimitive.Portal container={container} forceMount={forceMount}>
        <ContextMenuPrimitive.SubContent
          ref={ref}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          align={align}
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
        </ContextMenuPrimitive.SubContent>
      </ContextMenuPrimitive.Portal>
    );
  },
);
