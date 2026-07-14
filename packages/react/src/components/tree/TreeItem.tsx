import { useMemo, type KeyboardEvent, type ReactNode } from "react";
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

  const hasChildren = useMemo(() => {
    const kids = ctx.getChildren(value);
    return Array.isArray(kids) ? kids.length > 0 : !!kids;
  }, [ctx, value]);

  const isSelected = ctx.isSelected(itemKey);
  const isExpanded = ctx.isExpanded(itemKey);

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

  function handleKeyDown(ev: KeyboardEvent<HTMLDivElement>) {
    if (ev.target !== ev.currentTarget) return;
    if (ev.key !== "Enter" && ev.key !== " ") return;
    ev.preventDefault();
    activate();
  }

  return (
    <div
      role="treeitem"
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-selected={isSelected}
      aria-disabled={ctx.isDisabled || undefined}
      tabIndex={ctx.isDisabled ? -1 : 0}
      data-slot="tree-item"
      data-selected={isSelected || undefined}
      data-expanded={isExpanded || undefined}
      className={composeClassName(slotFns.item(), className, classNames?.item)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
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
