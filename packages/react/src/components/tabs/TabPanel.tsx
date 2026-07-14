import type { ReactNode } from "react";
import { TabPanel as RACTabPanel } from "react-aria-components";
import { composeClassName, type ClassValue } from "../../utils";
import { useTabsContext } from "./tabs.context";

export interface TabPanelProps {
  value: string;
  /** Keep the panel mounted (but inert) even when not selected. */
  shouldForceMount?: boolean;
  className?: ClassValue;
  /** Override classes for individual slots. */
  classNames?: Partial<{ tabPanel: ClassValue }>;
  children?: ReactNode;
}

export function TabPanel({ value, shouldForceMount, className, classNames, children }: TabPanelProps) {
  const ctx = useTabsContext();

  return (
    <RACTabPanel
      id={value}
      shouldForceMount={shouldForceMount}
      data-orientation={ctx.orientation}
      className={composeClassName(ctx.slotFns.tabPanel(), className, classNames?.tabPanel)}
    >
      {children}
    </RACTabPanel>
  );
}
