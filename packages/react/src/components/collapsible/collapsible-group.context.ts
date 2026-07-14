import { createContext, useContext } from "react";

export interface CollapsibleGroupRegistryEntry {
  id: string;
  /** Force this Collapsible closed (used for single-open enforcement). */
  close: () => void;
}

export interface CollapsibleGroupContextValue {
  allowMultiple: boolean;
  register: (entry: CollapsibleGroupRegistryEntry) => void;
  unregister: (id: string) => void;
  /** Called by a Collapsible when it opens; in single-open mode this closes siblings. */
  notifyOpen: (openingId: string) => void;
}

const CollapsibleGroupContext = createContext<CollapsibleGroupContextValue | null>(null);

export const CollapsibleGroupProvider = CollapsibleGroupContext.Provider;

export function useCollapsibleGroupContext(): CollapsibleGroupContextValue | null {
  return useContext(CollapsibleGroupContext);
}
