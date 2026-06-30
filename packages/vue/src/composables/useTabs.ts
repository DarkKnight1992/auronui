import { ref, type Ref } from 'vue'

export interface UseTabsOptions {
  /** Initial active tab value. */
  defaultTab?: string
}

export interface UseTabsReturn {
  /** Reactive active tab value. */
  activeTab: Ref<string | undefined>
  /** Set the active tab. */
  setTab: (value: string) => void
  /**
   * Pass as `@update:model-value` handler on the Tabs component.
   * Keeps `activeTab` in sync when the component changes tabs internally.
   */
  onTabChange: (value: string) => void
}

/**
 * Manages active tab state for the Tabs component.
 *
 * @example
 * ```ts
 * const tabs = useTabs({ defaultTab: 'overview' })
 * ```
 * ```html
 * <Tabs :model-value="tabs.activeTab" @update:model-value="tabs.onTabChange">
 *   <Tab value="overview">Overview</Tab>
 *   <Tab value="settings">Settings</Tab>
 * </Tabs>
 * ```
 */
export function useTabs(options: UseTabsOptions = {}): UseTabsReturn {
  const activeTab = ref<string | undefined>(options.defaultTab)

  function setTab(value: string): void {
    activeTab.value = value
  }

  function onTabChange(value: string): void {
    activeTab.value = value
  }

  return {
    activeTab,
    setTab,
    onTabChange,
  }
}
