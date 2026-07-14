import { createStrictContext } from "../../utils";

export interface SidebarContext {
  /** Effective active href — controlled `activeHref` prop, or auto-detected via useLocationPath(). */
  activeHref: string | undefined;
  /** Current search query. Empty string when search is disabled or empty. */
  searchQuery: string;
  /** Updates the search query — only meaningful when Sidebar renders its own SidebarSearch. */
  setSearchQuery: (value: string) => void;
}

export const sidebarContextDefaults: SidebarContext = {
  activeHref: undefined,
  searchQuery: "",
  setSearchQuery: () => {},
};

export const { Provider: SidebarProvider, useStrictContext: useSidebarContext } =
  createStrictContext<SidebarContext>("Sidebar");
