import type { RefObject } from "react";
import type { tabsVariants } from "@auronui/styles";
import { createStrictContext } from "../../utils";

// Return shape of tabsVariants({ variant, color }) — each key is a slot function returning a string
export type TabsSlotFns = ReturnType<typeof tabsVariants>;

export interface TabsContextValue {
  slotFns: TabsSlotFns;
  orientation: "horizontal" | "vertical";
  /**
   * The real DOM node of the rendered `<div role="tablist">`. TabList (our
   * wrapper) forwards this ref onto react-aria-components' TabList. TabIndicator
   * reads it to portal itself directly into that node — see TabIndicator.tsx
   * for why a portal (rather than being passed as a JSX child of TabList) is
   * required.
   */
  tabListRef: RefObject<HTMLDivElement | null>;
}

export const { Provider: TabsProvider, useStrictContext: useTabsContext } =
  createStrictContext<TabsContextValue>("Tabs");
