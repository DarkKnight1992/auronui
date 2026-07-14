import type { ReactNode } from "react";
import { TabList as RACTabList } from "react-aria-components";
import { composeClassName, type ClassValue } from "../../utils";
import { useTabsContext } from "./tabs.context";

export interface TabListProps {
  className?: ClassValue;
  /** Override classes on individual slots */
  classNames?: Partial<{ tabList: ClassValue }>;
  children?: ReactNode;
}

// NOTE: the Vue TabList supports an `overflow: 'arrows' | 'dropdown'` mode that
// measures tab widths and either scroll-arrows or collapses overflowing tabs into
// a "+N" dropdown menu. That DOM-measurement-heavy behavior was intentionally not
// ported in this pass (out of scope for the primitive-swap batch) — this TabList
// only implements the default (no-overflow-handling) mode. Revisit as a follow-up
// if arrow/dropdown overflow is needed for React.
export function TabList({ className, classNames, children }: TabListProps) {
  const ctx = useTabsContext();

  return (
    <RACTabList
      ref={ctx.tabListRef}
      data-orientation={ctx.orientation}
      className={composeClassName(ctx.slotFns.tabList(), className, classNames?.tabList)}
    >
      {children}
    </RACTabList>
  );
}
