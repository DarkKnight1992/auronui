import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ListBox as RACListBox, type ListBoxProps as RACListBoxProps, type Selection } from "react-aria-components";
import { useVirtualizer } from "@tanstack/react-virtual";
import { listboxVariants, type ListBoxVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { Button } from "../button";
import { ListBoxProvider } from "./ListBox.context";
import { ListBoxItem } from "./ListBoxItem";

export type ListBoxShorthandItem = {
  value: string;
  label?: string;
  disabled?: boolean;
  textValue?: string;
};

export type ListBoxSelectionValue = string | string[] | undefined;

export interface ListBoxOwnProps {
  /** Selected value(s). String in single mode, string[] in multiple mode. */
  value?: ListBoxSelectionValue;
  defaultValue?: ListBoxSelectionValue;
  selectionMode?: "single" | "multiple";
  /** Allow selecting multiple values (alias for selectionMode="multiple"). */
  multiple?: boolean;
  variant?: ListBoxVariants["variant"];
  isDisabled?: boolean;
  className?: ClassValue;
  classNames?: Partial<{
    base: ClassValue;
    item: ClassValue;
    indicator: ClassValue;
  }>;
  /** Shorthand API: render list items from an array instead of children. */
  items?: ListBoxShorthandItem[];
  orientation?: "horizontal" | "vertical";
  /** Hide the selected checkmark on all items. */
  hideSelectedIcon?: boolean;
  /** Enable windowed rendering (opt-in). Renders from `items`.
   *
   * Simplification vs. the Vue port: only the visible window of items is
   * rendered as real DOM children (via @tanstack/react-virtual), which means
   * aria-setsize/aria-posinset reflect the rendered subset rather than the
   * full collection. This is a common, accepted tradeoff for virtualized
   * listboxes without a purpose-built ARIA-virtualizer integration.
   */
  virtualized?: boolean;
  /** Estimated row height in px (or per-index fn) for the virtualizer. */
  estimateSize?: number | ((index: number) => number);
  /** Rows rendered outside the visible area. */
  overscan?: number;
  /** Scroll-viewport height for the content when scrolling is active. */
  maxHeight?: string | number;
  /** Whether more pages remain to load (gates load-more). */
  hasMore?: boolean;
  /** A page is currently loading (gates load-more). */
  isLoading?: boolean;
  /** Distance in px from the bottom that triggers load-more. */
  loadMoreDistance?: number;
  /** How the next page is requested: auto on scroll, or a manual button. */
  loadMode?: "scroll" | "button";
  /** Label for the manual load-more button (loadMode="button"). */
  loadMoreLabel?: string;
  /** Called to request the next page of items. */
  onLoadMore?: () => void;
  /** Pass as the `onSelectionChange` handler to keep `value` in sync. */
  onSelectionChange?: (value: ListBoxSelectionValue) => void;
  /** Content shown while a scroll-mode load-more request is pending. */
  loadingContent?: ReactNode;
  children?: ReactNode;
}

export type ListBoxProps = ListBoxOwnProps &
  Omit<RACListBoxProps<object>, keyof ListBoxOwnProps | "children" | "selectionMode" | "selectedKeys" | "defaultSelectedKeys" | "onSelectionChange">;

function toKeys(value: ListBoxSelectionValue): Set<string> {
  if (value == null) return new Set();
  return new Set(Array.isArray(value) ? value : [value]);
}

export function ListBox({
  value,
  defaultValue,
  selectionMode = "single",
  multiple,
  variant = "default",
  isDisabled = false,
  className,
  classNames,
  items,
  orientation,
  hideSelectedIcon = false,
  virtualized = false,
  estimateSize = 36,
  overscan = 12,
  maxHeight = "16rem",
  hasMore = false,
  isLoading = false,
  loadMoreDistance = 120,
  loadMode = "scroll",
  loadMoreLabel = "Load more",
  onLoadMore,
  onSelectionChange,
  loadingContent,
  children,
  ...rest
}: ListBoxProps) {
  const effectiveSelectionMode = multiple ? "multiple" : selectionMode;
  const isControlled = value !== undefined;

  const [internalSelected, setInternalSelected] = useState<ListBoxSelectionValue>(
    defaultValue ?? (effectiveSelectionMode === "multiple" ? [] : undefined),
  );
  const selected = isControlled ? value : internalSelected;
  const selectedKeys = useMemo(() => toKeys(selected), [selected]);

  const handleSelectionChange = useCallback(
    (keys: Selection) => {
      const arr = keys === "all" ? [] : Array.from(keys, (k) => String(k));
      const next: ListBoxSelectionValue =
        effectiveSelectionMode === "single" ? arr[0] : arr;
      if (!isControlled) setInternalSelected(next);
      onSelectionChange?.(next);
    },
    [effectiveSelectionMode, isControlled, onSelectionChange],
  );

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const lastRequestedCount = useRef(-1);

  const handleScroll = useCallback(() => {
    if (loadMode !== "scroll" || !hasMore || isLoading || !onLoadMore) return;
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const count = items?.length ?? 0;
    if (distanceFromBottom <= loadMoreDistance && count !== lastRequestedCount.current) {
      lastRequestedCount.current = count;
      onLoadMore();
    }
  }, [loadMode, hasMore, isLoading, onLoadMore, items, loadMoreDistance]);

  function requestLoadMore() {
    if (hasMore && !isLoading) onLoadMore?.();
  }

  const needsScroll = virtualized;
  const scrollStyle: CSSProperties | undefined = needsScroll
    ? { maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight, overflowY: "auto" }
    : undefined;

  const virtualizer = useVirtualizer({
    count: virtualized ? (items?.length ?? 0) : 0,
    // Only return the real scroll element when actually virtualized — when
    // not, this always returned scrollRef.current regardless, so the
    // virtualizer set up a ResizeObserver on it anyway (wasted work at best).
    // Worse: a large, sudden resize of that element (e.g. a consumer moving
    // every item out of a plain, non-virtualized ListBox in one go) could
    // trigger react-virtual's internal useSyncExternalStore snapshot to
    // recompute in a way React treated as an infinite update loop ("Maximum
    // update depth exceeded" / "getSnapshot should be cached"), even though
    // this ListBox was never virtualized in the first place.
    getScrollElement: () => (virtualized ? scrollRef.current : null),
    estimateSize: typeof estimateSize === "function" ? estimateSize : () => estimateSize,
    overscan,
  });

  const baseClass = listboxVariants({ variant });

  const contextValue = useMemo(
    () => ({ variant, itemVariant: variant, isDisabled, hideSelectedIcon }),
    [variant, isDisabled, hideSelectedIcon],
  );

  let content: ReactNode;
  if (virtualized && items) {
    const virtualItems = virtualizer.getVirtualItems();
    content = virtualItems.map((vi) => {
      const item = items[vi.index];
      if (!item) return null;
      return (
        <ListBoxItem
          key={item.value}
          value={item.value}
          isDisabled={item.disabled}
          textValue={item.textValue}
          classNames={{ item: classNames?.item, indicator: classNames?.indicator }}
          style={{ position: "absolute", top: 0, left: 0, right: 0, transform: `translateY(${vi.start}px)` }}
        >
          {item.label ?? item.value}
        </ListBoxItem>
      );
    });
  } else if (items) {
    content = items.map((item) => (
      <ListBoxItem
        key={item.value}
        value={item.value}
        isDisabled={item.disabled}
        textValue={item.textValue}
        classNames={{ item: classNames?.item, indicator: classNames?.indicator }}
      >
        {item.label ?? item.value}
      </ListBoxItem>
    ));
  } else {
    content = children;
  }

  const boxStyle: CSSProperties = {
    ...scrollStyle,
    ...(virtualized ? { position: "relative", height: virtualizer.getTotalSize() } : undefined),
  };

  return (
    <ListBoxProvider value={contextValue}>
      <RACListBox
        ref={scrollRef}
        orientation={orientation}
        selectionMode={effectiveSelectionMode}
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
        className={composeClassName(baseClass, className, classNames?.base)}
        style={boxStyle}
        onScroll={handleScroll}
        {...rest}
      >
        {content}
      </RACListBox>

      {loadMode === "scroll" && isLoading && (
        <div data-slot="list-box-loading" role="status" aria-live="polite">
          {loadingContent ?? "Loading…"}
        </div>
      )}

      {loadMode === "button" && hasMore && (
        <div className="flex justify-center p-2" data-slot="list-box-load-more">
          <Button size="sm" isLoading={isLoading} disabled={isLoading} data-slot="load-more-button" onClick={requestLoadMore}>
            {loadMoreLabel}
          </Button>
        </div>
      )}
    </ListBoxProvider>
  );
}
