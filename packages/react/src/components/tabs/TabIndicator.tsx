import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { composeClassName, type ClassValue } from "../../utils";
import { useTabsContext } from "./tabs.context";

export interface TabIndicatorProps {
  className?: ClassValue;
  /** Override classes for individual slots */
  classNames?: Partial<{ tabIndicator: ClassValue }>;
}

// Reka UI (the Vue primitive layer) exposes `--reka-tabs-indicator-size` /
// `--reka-tabs-indicator-position` CSS custom properties on the tab list,
// which `tabs.css` reads directly. react-aria-components has no equivalent, so
// this component measures the selected tab itself and writes the same two CSS
// variables onto the tablist — the shared stylesheet needs no changes.
//
// Must be rendered as a JSX SIBLING of <TabList>, never as its child: RAC's
// TabList uses a collection-based render model (CollectionBuilder) that only
// understands <Tab> items — any other child gets swept into that machinery's
// hidden/offscreen collection-building pass, where refs don't resolve to real
// DOM nodes (this is what previously threw "el?.closest is not a function").
// tabs.css positions `.tabs__indicator` with `position: absolute` relative to
// `.tabs__list` itself (not a wrapper), so it still needs to be a genuine DOM
// *descendant* of the tablist — achieved here via a portal into the tablist
// node captured by TabList through shared context, bypassing the collection
// model entirely (a portal target is just a raw DOM node; CollectionBuilder
// never sees it).
export function TabIndicator({ className, classNames }: TabIndicatorProps) {
  const ctx = useTabsContext();
  const [tabList, setTabList] = useState<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    setTabList(ctx.tabListRef.current);
  });

  useLayoutEffect(() => {
    if (!tabList) return;

    const selected = tabList.querySelector('[role="tab"][aria-selected="true"]') as HTMLElement | null;
    if (!selected) return;

    const size = ctx.orientation === "vertical" ? selected.offsetHeight : selected.offsetWidth;
    const position = ctx.orientation === "vertical" ? selected.offsetTop : selected.offsetLeft;
    tabList.style.setProperty("--reka-tabs-indicator-size", `${size}px`);
    tabList.style.setProperty("--reka-tabs-indicator-position", `${position}px`);
  });

  if (!tabList) return null;

  return createPortal(
    <span
      aria-hidden="true"
      className={composeClassName(ctx.slotFns.tabIndicator(), className, classNames?.tabIndicator)}
    />,
    tabList,
  );
}
