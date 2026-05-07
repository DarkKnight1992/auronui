import { ref, onMounted, type Ref } from "vue";

/**
 * Returns a reactive boolean ref that is `false` during SSR and before mount,
 * and `true` after the component has mounted in the browser.
 *
 * @example
 * ```ts
 * const isMounted = useIsMounted()
 * // isMounted.value === false (during SSR or before onMounted)
 * // isMounted.value === true  (after onMounted fires)
 * ```
 */
export function useIsMounted(): Ref<boolean> {
  const isMounted = ref(false);

  onMounted(() => {
    isMounted.value = true;
  });

  return isMounted;
}
