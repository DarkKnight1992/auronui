import { useLayoutEffect, useRef, type ReactNode } from "react";
import { Tab as RACTab } from "react-aria-components";
import { composeClassName, type ClassValue } from "../../utils";
import { useTabsContext } from "./tabs.context";

export interface TabProps {
  value: string;
  isDisabled?: boolean;
  className?: ClassValue;
  /** Override classes for individual slots. */
  classNames?: Partial<{ tab: ClassValue }>;
  children?: ReactNode;
}

/**
 * Writes `data-state="active"` onto the tab's own DOM node so tabs.css's
 * selected-tab styling — gated on `[data-state="active"]`, reka-ui's
 * convention — applies unchanged. RAC only sets `data-selected` (present/
 * absent, no `="active"` value) on its own Tab, so it never matched: every
 * tab silently fell back to the dimmed `text-foreground/50` inactive style
 * regardless of selection. Mirrors the *StateAttrs bridging pattern used
 * elsewhere in this port (Modal, DateInput, ...).
 */
function TabStateAttrs({
  elementRef,
  isSelected,
}: {
  elementRef: React.RefObject<HTMLElement | null>;
  isSelected: boolean;
}) {
  useLayoutEffect(() => {
    if (isSelected) elementRef.current?.setAttribute("data-state", "active");
    else elementRef.current?.removeAttribute("data-state");
  });
  return null;
}

export function Tab({ value, isDisabled, className, classNames, children }: TabProps) {
  const ctx = useTabsContext();
  const ref = useRef<HTMLElement | null>(null);

  return (
    <RACTab
      ref={ref as React.RefObject<HTMLDivElement>}
      id={value}
      isDisabled={isDisabled}
      data-tab-value={value}
      className={composeClassName(ctx.slotFns.tab(), className, classNames?.tab)}
    >
      {(renderProps) => (
        <>
          <TabStateAttrs elementRef={ref} isSelected={renderProps.isSelected} />
          {children}
        </>
      )}
    </RACTab>
  );
}
