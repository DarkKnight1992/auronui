import { ref, watch, type Ref } from "vue";
import { useResizeObserver } from "@vueuse/core";

/**
 * Tracks an element's offsetHeight reactively using @vueuse/core useResizeObserver.
 * Returns 0 before mount or when element is null.
 *
 * @param el - Template ref to the target element
 * @returns Ref<number> — reactive element height in pixels
 */
export function useMeasuredHeight(el: Ref<HTMLElement | null | undefined>): Ref<number> {
  const height = ref<number>(0);

  useResizeObserver(el, (entries) => {
    const entry = entries[0];
    if (entry) {
      height.value = entry.target instanceof HTMLElement ? entry.target.offsetHeight : 0;
    }
  });

  // Set initial height when element becomes available
  watch(
    el,
    (element) => {
      if (element) {
        height.value = element.offsetHeight;
      } else {
        height.value = 0;
      }
    },
    { immediate: true }
  );

  return height;
}
