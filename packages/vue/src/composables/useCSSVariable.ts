import { ref, watch, type Ref } from "vue";
import { useCssVar } from "@vueuse/core";

/**
 * Reads a CSS custom property reactively using @vueuse/core useCssVar.
 *
 * @param el - Template ref to the target element
 * @param variable - CSS custom property name (e.g. "--color-primary")
 * @returns Ref<string> — reactive value of the CSS variable at the element
 */
export function useCSSVariable(
  el: Ref<HTMLElement | null | undefined>,
  variable: string
): Ref<string> {
  // useCssVar returns ShallowRef<string | undefined> — wrap in a string-typed ref
  const raw = useCssVar(variable, el);
  const value = ref<string>(raw.value ?? "");

  watch(raw, (v) => {
    value.value = v ?? "";
  });

  return value;
}
