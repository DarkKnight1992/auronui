import { forwardRef, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { splitterVariants, type SplitterVariants } from "@auronui/styles";
import { composeClassName, dataAttr, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";
import { useSplitterGroupContext } from "./splitter.context";

export interface SplitterResizeHandleOwnProps {
  id?: string;
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  className?: ClassValue;
  /** Per-slot class overrides */
  classNames?: Partial<{
    handle: ClassValue;
    handleBar: ClassValue;
  }>;
  tabIndex?: number;
  onDragging?: (isDragging: boolean) => void;
  children?: ReactNode;
  /** @internal Injected by SplitterGroup. Not part of the public API. */
  direction?: SplitterVariants["direction"];
  /** @internal Injected by SplitterGroup — apply an incremental percentage delta to the adjacent pair. */
  onDrag?: (deltaPercent: number) => void;
  /** @internal Injected by SplitterGroup — current percentage of the panel before this handle. */
  valueNow?: number;
  /** @internal Injected by SplitterGroup — px size of the group along its resize axis. */
  getContainerSize?: () => number;
  /** @internal Injected by SplitterGroup — keyboard resize increment in percentage points. */
  keyboardResizeBy?: number;
}

export type SplitterResizeHandleProps = SplitterResizeHandleOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof SplitterResizeHandleOwnProps>;

export const SplitterResizeHandle = forwardRef<HTMLDivElement, SplitterResizeHandleProps>(
  function SplitterResizeHandle(
    {
      id,
      isDisabled,
      disabled,
      className,
      classNames,
      tabIndex = 0,
      onDragging,
      children,
      direction: injectedDirection,
      onDrag,
      valueNow,
      getContainerSize,
      keyboardResizeBy = 10,
      ...rest
    },
    forwardedRef,
  ) {
    // Falls back to the ambient context when used standalone (rare) or when
    // SplitterGroup hasn't injected direction yet.
    const groupCtx = useSplitterGroupContext({ direction: "horizontal" });
    const direction = injectedDirection ?? groupCtx.direction ?? "horizontal";

    const resolvedDisabled = resolveDeprecatedBooleanProp(
      "SplitterResizeHandle",
      "isDisabled",
      isDisabled,
      "disabled",
      disabled,
    );

    const [isDragging, setIsDragging] = useState(false);
    const lastPosRef = useRef(0);
    const innerRef = useRef<HTMLDivElement | null>(null);

    function setRefs(node: HTMLDivElement | null) {
      innerRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }

    function setDragging(next: boolean) {
      setIsDragging(next);
      onDragging?.(next);
    }

    function applyDeltaPx(deltaPx: number) {
      const containerSize = getContainerSize?.() ?? 0;
      if (!containerSize || !onDrag) return;
      onDrag((deltaPx / containerSize) * 100);
    }

    function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
      if (resolvedDisabled) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      lastPosRef.current = direction === "vertical" ? event.clientY : event.clientX;
      setDragging(true);
    }

    function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
      if (resolvedDisabled || !isDragging) return;
      const pos = direction === "vertical" ? event.clientY : event.clientX;
      const deltaPx = pos - lastPosRef.current;
      lastPosRef.current = pos;
      applyDeltaPx(deltaPx);
    }

    function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
      if (!isDragging) return;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      setDragging(false);
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
      if (resolvedDisabled || !onDrag) return;
      const isHorizontal = direction === "horizontal";
      const increaseKey = isHorizontal ? "ArrowRight" : "ArrowDown";
      const decreaseKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
      if (event.key === increaseKey) {
        event.preventDefault();
        onDrag(keyboardResizeBy);
      } else if (event.key === decreaseKey) {
        event.preventDefault();
        onDrag(-keyboardResizeBy);
      } else if (event.key === "Home") {
        event.preventDefault();
        onDrag(-100);
      } else if (event.key === "End") {
        event.preventDefault();
        onDrag(100);
      }
    }

    const slotFns = splitterVariants({ direction });

    return (
      <div
        ref={setRefs}
        id={id}
        role="separator"
        aria-orientation={direction === "horizontal" ? "vertical" : "horizontal"}
        aria-valuenow={valueNow !== undefined ? Math.round(valueNow) : undefined}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-disabled={dataAttr(resolvedDisabled)}
        data-slot="splitter-handle"
        data-disabled={dataAttr(resolvedDisabled)}
        data-state={isDragging ? "drag" : undefined}
        tabIndex={resolvedDisabled ? -1 : tabIndex}
        className={composeClassName(slotFns.handle(), className, classNames?.handle)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children ?? <div className={composeClassName(slotFns.handleBar(), classNames?.handleBar)} />}
      </div>
    );
  },
);
