import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { splitterVariants } from "@auronui/styles";
import { composeClassName, dataAttr, type ClassValue } from "../../utils";

export interface SplitterPanelOwnProps {
  id?: string;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  collapsible?: boolean;
  collapsedSize?: number;
  /** Visual/DOM order among sibling panels (rarely needed — JSX order is used by default). */
  order?: number;
  className?: ClassValue;
  /** Override classes for individual slots. */
  classNames?: Partial<{
    panel: ClassValue;
  }>;
  onCollapse?: () => void;
  onExpand?: () => void;
  onResize?: (size: number) => void;
  children?: ReactNode;
  /**
   * @internal Injected by SplitterGroup — the panel's resolved size (percentage).
   * Not part of the public API; do not pass manually.
   */
  size?: number;
}

export type SplitterPanelProps = SplitterPanelOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof SplitterPanelOwnProps>;

export const SplitterPanel = forwardRef<HTMLDivElement, SplitterPanelProps>(function SplitterPanel(
  {
    id,
    size,
    minSize,
    maxSize,
    collapsible,
    collapsedSize,
    order,
    className,
    classNames,
    children,
    style,
    // Consumed by SplitterGroup only — swallow so they don't leak onto the DOM node.
    defaultSize: _defaultSize,
    onCollapse: _onCollapse,
    onExpand: _onExpand,
    onResize: _onResize,
    ...rest
  },
  ref,
) {
  const slotFns = splitterVariants();
  const resolvedSize = size ?? 0;
  const isCollapsed = Boolean(collapsible && collapsedSize !== undefined && resolvedSize <= collapsedSize);

  return (
    <div
      ref={ref}
      id={id}
      className={composeClassName(slotFns.panel(), className, classNames?.panel)}
      data-slot="splitter-panel"
      data-collapsed={dataAttr(isCollapsed)}
      style={{
        ...style,
        flexBasis: `${resolvedSize}%`,
        flexGrow: 0,
        flexShrink: 0,
        order,
        minWidth: minSize !== undefined ? 0 : undefined,
      }}
      {...rest}
    >
      {children}
    </div>
  );
});
