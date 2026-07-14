import { createContext as createReactContext, useContext } from "react";

/**
 * Creates a typed Context/useContext pair that throws when consumed outside
 * its provider — the canonical pattern for compound components in Auron.
 * Mirrors the Vue package's createContext (provide/inject) helper so every
 * compound family (Card, Checkbox/Group, Modal, Select, etc.) shares the
 * same contract across both frameworks.
 *
 * @example
 * const { Provider, useStrictContext } = createStrictContext<ButtonGroupContext>("ButtonGroup")
 *
 * // ButtonGroup.tsx
 * <Provider value={{ size, variant }}>{children}</Provider>
 *
 * // Button.tsx (child of ButtonGroup)
 * const ctx = useStrictContext({ size: "md", variant: "solid" }) // fallback = defaults
 */
export function createStrictContext<T>(contextName: string) {
  const Context = createReactContext<T | undefined>(undefined);

  function useStrictContext(fallback?: T): T {
    const ctx = useContext(Context);
    if (ctx === undefined) {
      if (fallback !== undefined) return fallback;
      throw new Error(`[Auron] ${contextName} context used outside provider`);
    }
    return ctx;
  }

  return { Provider: Context.Provider, useStrictContext, Context };
}
