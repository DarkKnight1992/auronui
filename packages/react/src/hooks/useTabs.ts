import { useCallback, useState } from "react";

export interface UseTabsOptions {
  /** Initial active tab value. */
  defaultTab?: string;
}

export interface UseTabsReturn {
  /** Currently active tab value. */
  activeTab: string | undefined;
  /** Set the active tab. */
  setTab: (value: string) => void;
  /**
   * Pass as the `onValueChange` handler on the Tabs component.
   * Keeps `activeTab` in sync when the component changes tabs internally.
   */
  onTabChange: (value: string) => void;
}

/**
 * Manages active tab state for the Tabs component.
 *
 * @example
 * ```tsx
 * const tabs = useTabs({ defaultTab: 'overview' })
 * ```
 * ```tsx
 * <Tabs value={tabs.activeTab} onValueChange={tabs.onTabChange}>
 *   <Tab value="overview">Overview</Tab>
 *   <Tab value="settings">Settings</Tab>
 * </Tabs>
 * ```
 */
export function useTabs(options: UseTabsOptions = {}): UseTabsReturn {
  const [activeTab, setActiveTab] = useState<string | undefined>(options.defaultTab);

  const setTab = useCallback((value: string): void => setActiveTab(value), []);
  const onTabChange = useCallback((value: string): void => setActiveTab(value), []);

  return { activeTab, setTab, onTabChange };
}
