import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { splitterVariants, type SplitterVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { SplitterGroupProvider } from "./splitter.context";
import { SplitterPanel, type SplitterPanelProps } from "./SplitterPanel";
import { SplitterResizeHandle, type SplitterResizeHandleProps } from "./SplitterResizeHandle";

export interface SplitterGroupOwnProps {
  id?: string;
  direction?: SplitterVariants["direction"];
  /** Kept for Vue-parity API surface; layout persistence is left to the consumer in this port. */
  autoSaveId?: string;
  className?: ClassValue;
  /** Per-slot class name overrides. */
  classNames?: Partial<{
    group: ClassValue;
  }>;
  /** Keyboard resize increment in percentage points (default: 10). */
  keyboardResizeBy?: number;
  onLayout?: (sizes: number[]) => void;
  children?: ReactNode;
}

export type SplitterGroupProps = SplitterGroupOwnProps &
  Omit<React.ComponentPropsWithoutRef<"div">, keyof SplitterGroupOwnProps>;

function computeDefaultSizes(defaults: Array<number | undefined>): number[] {
  const sumProvided = defaults.reduce<number>((sum, v) => sum + (v ?? 0), 0);
  const missingCount = defaults.filter((v) => v === undefined).length;
  const remaining = Math.max(0, 100 - sumProvided);
  const each = missingCount > 0 ? remaining / missingCount : 0;
  return defaults.map((v) => v ?? each);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export const SplitterGroup = forwardRef<HTMLDivElement, SplitterGroupProps>(function SplitterGroup(
  { id, direction = "horizontal", autoSaveId: _autoSaveId, className, classNames, keyboardResizeBy = 10, onLayout, children, ...rest },
  forwardedRef,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  function setRefs(node: HTMLDivElement | null) {
    containerRef.current = node;
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
  }

  const childArray = useMemo(() => Children.toArray(children) as ReactElement[], [children]);

  const panelElements = useMemo(
    () => childArray.filter((child) => isValidElement(child) && child.type === SplitterPanel),
    [childArray],
  );

  const [sizes, setSizes] = useState<number[]>(() =>
    computeDefaultSizes(panelElements.map((p) => (p.props as SplitterPanelProps).defaultSize)),
  );

  // Panel count changed (children added/removed) — re-derive sizes so indices stay valid.
  const panelCountRef = useRef(panelElements.length);
  if (panelCountRef.current !== panelElements.length) {
    panelCountRef.current = panelElements.length;
  }

  const getContainerSize = useCallback((): number => {
    const el = containerRef.current;
    if (!el) return 0;
    return direction === "horizontal" ? el.clientWidth : el.clientHeight;
  }, [direction]);

  function applyDelta(beforeIndex: number, deltaPercent: number, constraints: Array<{ min: number; max: number }>) {
    setSizes((prev) => {
      if (prev.length !== panelElements.length) return prev;
      const next = [...prev];
      const beforeMin = constraints[beforeIndex]?.min ?? 0;
      const beforeMax = constraints[beforeIndex]?.max ?? 100;
      const afterMin = constraints[beforeIndex + 1]?.min ?? 0;
      const afterMax = constraints[beforeIndex + 1]?.max ?? 100;

      // The pair's combined size is conserved — growing "before" shrinks "after"
      // by exactly the same amount, clamped so neither exceeds its own bounds.
      const pairTotal = next[beforeIndex] + next[beforeIndex + 1];
      let before = clamp(next[beforeIndex] + deltaPercent, beforeMin, beforeMax);
      let after = pairTotal - before;
      if (after < afterMin) after = afterMin;
      if (after > afterMax) after = afterMax;
      before = clamp(pairTotal - after, beforeMin, beforeMax);
      after = pairTotal - before;

      next[beforeIndex] = before;
      next[beforeIndex + 1] = after;

      onLayout?.(next);
      return next;
    });
  }

  const constraints = panelElements.map((p) => {
    const props = p.props as SplitterPanelProps;
    return { min: props.minSize ?? 0, max: props.maxSize ?? 100 };
  });

  let panelIndex = -1;
  let handleIndex = -1;
  const rendered = childArray.map((child, i) => {
    if (!isValidElement(child)) return child;

    if (child.type === SplitterPanel) {
      panelIndex += 1;
      const idx = panelIndex;
      return cloneElement(child as ReactElement<SplitterPanelProps>, {
        key: child.key ?? `panel-${i}`,
        size: sizes[idx],
      });
    }

    if (child.type === SplitterResizeHandle) {
      handleIndex += 1;
      const idx = handleIndex;
      return cloneElement(child as ReactElement<SplitterResizeHandleProps>, {
        key: child.key ?? `handle-${i}`,
        direction,
        valueNow: sizes[idx],
        getContainerSize,
        keyboardResizeBy,
        onDrag: (deltaPercent: number) => applyDelta(idx, deltaPercent, constraints),
      });
    }

    return child;
  });

  const slotFns = splitterVariants({ direction });

  return (
    <SplitterGroupProvider value={{ direction }}>
      <div
        ref={setRefs}
        id={id}
        data-slot="splitter-group"
        data-orientation={direction}
        className={composeClassName(slotFns.group(), className, classNames?.group)}
        {...rest}
      >
        {rendered}
      </div>
    </SplitterGroupProvider>
  );
});
