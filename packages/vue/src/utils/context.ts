import { provide, inject, type InjectionKey } from "vue";

/**
 * Creates a typed provide/inject pair with a unique Symbol key.
 *
 * This is the canonical pattern for compound components in Auron — the Vue
 * equivalent of React's createContext/useContext. Every compound component
 * family (Card, Checkbox/Group, Modal, Select, etc.) uses this to share state
 * between a parent provider and its child consumers without prop drilling.
 *
 * Security note (T-00-16): useInject() throws a descriptive error when called
 * outside its provider scope, preventing silent undefined injection that causes
 * confusing runtime errors in compound components.
 *
 * @param contextName - Human-readable name shown in Vue DevTools and error messages
 * @returns { useProvide, useInject, key }
 *
 * @example
 * const { useProvide, useInject } = createContext<ButtonGroupContext>("ButtonGroup")
 *
 * // In ButtonGroup.vue setup():
 * useProvide({ size, variant })
 *
 * // In Button.vue setup() (child of ButtonGroup):
 * const ctx = useInject({ size: "md", variant: "solid" }) // fallback = defaults
 */
export function createContext<T>(contextName: string): {
  useProvide: (value: T) => T;
  useInject: (fallback?: T) => T;
  key: InjectionKey<T>;
} {
  const key: InjectionKey<T> = Symbol(contextName);

  function useProvide(value: T): T {
    provide(key, value);
    return value;
  }

  function useInject(fallback?: T): T {
    const ctx = inject(key, fallback as T);
    if (ctx === undefined) {
      throw new Error(
        `[Auron] ${contextName} context used outside provider`
      );
    }
    return ctx;
  }

  return { useProvide, useInject, key };
}
