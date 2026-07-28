import { useEffect, useMemo, useRef, type KeyboardEvent, type ReactNode } from "react";
import { treeVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { useTreeContext, DEFAULT_TREE_CONTEXT } from "./tree.context";

export interface TreeItemSlotProps {
  isExpanded: boolean;
  isSelected: boolean;
  hasChildren: boolean;
  handleSelect: () => void;
  handleToggle: () => void;
  toggleClass: string;
  iconClass: string;
}

export interface TreeItemOwnProps<T> {
  value: T;
  /** Stable key for this node — same string returned by Tree's `getKey`. */
  itemKey: string;
  level: number;
  className?: ClassValue;
  classNames?: Partial<{
    item: ClassValue;
    itemContent: ClassValue;
  }>;
  onSelect?: () => void;
  onToggle?: () => void;
  children: (slotProps: TreeItemSlotProps) => ReactNode;
}

/**
 * TreeItem — a single row within `<Tree>`.
 *
 * The Vue port had to work around a reka-ui bug where `TreeItem`'s keydown
 * handler only fired `select` (not `toggle`) on Enter/Space, unlike its click
 * handler, which fired both — folder nodes couldn't be expanded/collapsed
 * from the keyboard without also reaching for arrow keys. This React version
 * has no reka-ui dependency, so both the click handler and the keydown
 * handler call the *same* `activate()` function from the start, keeping them
 * symmetric by construction instead of retrofitting a fix.
 *
 * Full WAI-ARIA TreeView keyboard navigation
 * (https://www.w3.org/WAI/ARIA/apg/patterns/treeview/) is hand-built here
 * since there's no reka-ui equivalent to lean on for React: roving tabindex
 * (only `ctx.activeKey` is a tab stop; every other row is `tabIndex={-1}`,
 * reachable solely via arrow keys once the tree itself has focus),
 * ArrowUp/Down to move between visible rows, ArrowRight to expand a
 * collapsed node or step into its first child, ArrowLeft to collapse an
 * expanded node or step out to its parent. Expand/collapse triggered from
 * arrow keys reuses this row's own `handleToggle()` (not a Tree-level
 * shortcut) specifically so `onToggle` still fires for arrow-driven
 * expansion exactly like it does for Enter/Space and click — the same class
 * of bug the Vue side had to fix (a consumer lazy-loading children on
 * `toggle` must hear about every way a node can expand).
 */
export function TreeItem<T>({
  value,
  itemKey,
  level,
  className,
  classNames,
  onSelect,
  onToggle,
  children,
}: TreeItemOwnProps<T>) {
  const ctx = useTreeContext(DEFAULT_TREE_CONTEXT);
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ctx.registerNode(itemKey, nodeRef.current);
    return () => ctx.registerNode(itemKey, null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemKey, ctx.registerNode]);

  const hasChildren = useMemo(() => {
    const kids = ctx.getChildren(value);
    return Array.isArray(kids) ? kids.length > 0 : !!kids;
  }, [ctx, value]);

  const isSelected = ctx.isSelected(itemKey);
  const isExpanded = ctx.isExpanded(itemKey);
  const isActive = ctx.activeKey === itemKey;

  const slotFns = useMemo(() => treeVariants({ size: ctx.size }), [ctx.size]);

  function handleSelect() {
    if (ctx.isDisabled) return;
    ctx.select(itemKey);
    onSelect?.();
  }

  function handleToggle() {
    if (ctx.isDisabled) return;
    if (!hasChildren) return;
    ctx.toggleExpand(itemKey);
    onToggle?.();
  }

  function activate() {
    handleSelect();
    handleToggle();
  }

  function handleClick() {
    activate();
  }

  function handleFocus() {
    ctx.setActiveKey(itemKey);
  }

  function handleKeyDown(ev: KeyboardEvent<HTMLDivElement>) {
    if (ev.target !== ev.currentTarget) return;

    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      activate();
      return;
    }

    if (ev.key === "ArrowDown") {
      ev.preventDefault();
      const idx = ctx.navOrder.findIndex((n) => n.key === itemKey);
      const next = idx === -1 ? undefined : ctx.navOrder[idx + 1];
      if (next) ctx.focusNode(next.key);
      return;
    }

    if (ev.key === "ArrowUp") {
      ev.preventDefault();
      const idx = ctx.navOrder.findIndex((n) => n.key === itemKey);
      const prev = idx > 0 ? ctx.navOrder[idx - 1] : undefined;
      if (prev) ctx.focusNode(prev.key);
      return;
    }

    if (ev.key === "ArrowRight") {
      if (!hasChildren) return;
      ev.preventDefault();
      if (!isExpanded) {
        handleToggle();
        return;
      }
      const idx = ctx.navOrder.findIndex((n) => n.key === itemKey);
      const child = idx === -1 ? undefined : ctx.navOrder[idx + 1];
      if (child && child.parentKey === itemKey) ctx.focusNode(child.key);
      return;
    }

    if (ev.key === "ArrowLeft") {
      ev.preventDefault();
      if (hasChildren && isExpanded) {
        handleToggle();
        return;
      }
      const idx = ctx.navOrder.findIndex((n) => n.key === itemKey);
      const parentKey = idx === -1 ? null : ctx.navOrder[idx]!.parentKey;
      if (parentKey) ctx.focusNode(parentKey);
      return;
    }
  }

  return (
    <div
      ref={nodeRef}
      role="treeitem"
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-selected={isSelected}
      aria-disabled={ctx.isDisabled || undefined}
      aria-level={level}
      tabIndex={ctx.isDisabled ? -1 : isActive ? 0 : -1}
      data-slot="tree-item"
      data-selected={isSelected || undefined}
      data-expanded={isExpanded || undefined}
      className={composeClassName(slotFns.item(), className, classNames?.item)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
    >
      <div
        className={composeClassName(slotFns.itemContent(), classNames?.itemContent)}
        style={{ "--tree-indent": level - 1 } as React.CSSProperties}
        data-selected={isSelected || undefined}
        data-expanded={isExpanded || undefined}
      >
        {children({
          isExpanded,
          isSelected,
          hasChildren,
          handleSelect,
          handleToggle,
          toggleClass: slotFns.itemToggle(),
          iconClass: slotFns.itemIcon(),
        })}
      </div>
    </div>
  );
}
