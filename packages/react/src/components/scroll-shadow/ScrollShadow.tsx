import { forwardRef, useEffect, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { scrollShadowVariants } from "@auronui/styles";
import { composeClassName, dataAttr, type ClassValue } from "../../utils";

/**
 * ScrollShadow — An overflow container that shows/hides top/bottom (or left/right)
 * shadows based on scroll position.
 *
 * Implementation: a native `onScroll` handler computes the "arrived state" (are we
 * at the top/bottom/left/right edge?) directly from scrollTop/scrollHeight/clientHeight
 * (mirrors @vueuse/core's `useScroll` arrivedState, ported by hand since this package
 * has no @vueuse/core equivalent). Data-attributes drive shadow visibility via CSS
 * mask-image in @auronui/styles.
 *
 * Data-attribute semantics (matches scroll-shadow.css):
 *   data-top-scroll="true"    -> content exists ABOVE current viewport (scrolled down) -> top shadow shown
 *   data-bottom-scroll="true" -> content exists BELOW current viewport -> bottom shadow shown
 *   data-left-scroll="true"   -> content exists to the LEFT (scrolled right) -> left shadow shown
 *   data-right-scroll="true"  -> content exists to the RIGHT -> right shadow shown
 */
export interface ScrollShadowOwnProps {
  orientation?: "vertical" | "horizontal" | "both";
  hideScrollBar?: boolean;
  size?: number;
  offset?: number;
  visibility?: "auto" | "top" | "bottom" | "left" | "right" | "both" | "none";
  className?: ClassValue;
  /** Per-slot class overrides. */
  classNames?: Partial<{
    base: ClassValue;
  }>;
  children?: ReactNode;
}

export type ScrollShadowProps = ScrollShadowOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof ScrollShadowOwnProps>;

interface ArrivedState {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
}

const ARRIVED_TOLERANCE_PX = 1;

function measureArrivedState(el: HTMLElement): ArrivedState {
  const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = el;
  return {
    top: scrollTop <= ARRIVED_TOLERANCE_PX,
    bottom: scrollTop + clientHeight >= scrollHeight - ARRIVED_TOLERANCE_PX,
    left: scrollLeft <= ARRIVED_TOLERANCE_PX,
    right: scrollLeft + clientWidth >= scrollWidth - ARRIVED_TOLERANCE_PX,
  };
}

export const ScrollShadow = forwardRef<HTMLDivElement, ScrollShadowProps>(function ScrollShadow(
  {
    orientation = "vertical",
    hideScrollBar = false,
    size = 40,
    offset: _offset = 0,
    visibility: _visibility = "auto",
    className,
    classNames,
    style,
    children,
    onScroll,
    ...rest
  },
  forwardedRef,
) {
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [arrivedState, setArrivedState] = useState<ArrivedState>({
    top: true,
    bottom: true,
    left: true,
    right: true,
  });

  function setRefs(node: HTMLDivElement | null) {
    innerRef.current = node;
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
  }

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    setArrivedState(measureArrivedState(el));
    // No ResizeObserver dependency here on purpose — content-size changes without a
    // scroll event (e.g. dynamic children) won't re-measure; consumers relying on
    // that edge case should trigger a synthetic scroll or resize the container.
  }, []);

  function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    setArrivedState(measureArrivedState(event.currentTarget));
    onScroll?.(event);
  }

  // data-*-scroll="true" when there IS more content in that direction (i.e. NOT at that edge)
  const topScroll = !arrivedState.top;
  const bottomScroll = !arrivedState.bottom;
  const leftScroll = !arrivedState.left;
  const rightScroll = !arrivedState.right;

  const slotFns = scrollShadowVariants({
    orientation: orientation === "both" ? "vertical" : orientation,
    hideScrollBar,
  });

  return (
    <div
      ref={setRefs}
      className={composeClassName(slotFns.base(), className, classNames?.base)}
      data-orientation={orientation}
      data-top-scroll={dataAttr(topScroll)}
      data-bottom-scroll={dataAttr(bottomScroll)}
      data-left-scroll={dataAttr(leftScroll)}
      data-right-scroll={dataAttr(rightScroll)}
      style={{ ...style, ["--scroll-shadow-size" as string]: `${size}px` }}
      onScroll={handleScroll}
      {...rest}
    >
      {children}
    </div>
  );
});
