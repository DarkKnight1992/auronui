import { ref, onMounted, type Ref } from "vue";

/**
 * Returns a reactive boolean ref that is `false` during SSR and before
 * hydration, and `true` after the component has hydrated in the browser.
 *
 * SSR safety: The ref is initialized to `false`. During SSR, `onMounted`
 * never runs, so server-rendered markup will always see `false`. On the
 * client, `onMounted` fires after Vue's DOM patching (hydration) completes,
 * setting the ref to `true`.
 *
 * @remarks
 * If a component conditionally renders different markup based on `isHydrated`,
 * it must either match the server output exactly or wrap the conditional
 * content in `<ClientOnly>` (Nuxt) / `<Suspense>` to avoid hydration mismatches.
 *
 * @example
 * ```ts
 * const isHydrated = useIsHydrated()
 * // isHydrated.value === false (during SSR, safe for server rendering)
 * // isHydrated.value === true  (after client hydration completes)
 * ```
 */
export function useIsHydrated(): Ref<boolean> {
  const isHydrated = ref(false);

  onMounted(() => {
    isHydrated.value = true;
  });

  return isHydrated;
}
