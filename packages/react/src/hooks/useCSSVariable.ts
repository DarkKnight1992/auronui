import { useEffect, useState, type RefObject } from "react";

/**
 * Reads a CSS custom property reactively from an element using plain
 * `getComputedStyle` + `MutationObserver`/`resize` polling (no @vueuse
 * dependency — this package doesn't take one).
 *
 * Re-reads the variable whenever the element's `style`/`class` attributes
 * change (covers inline var overrides and theme-class toggles on the
 * element itself) and on window resize (covers viewport-based custom
 * properties, mirroring the Vue version's vueuse-backed behavior).
 *
 * @param ref - Ref object pointing at the target element
 * @param variable - CSS custom property name (e.g. "--color-primary")
 * @returns Current value of the CSS variable at the element
 */
export function useCSSVariable(ref: RefObject<HTMLElement | null | undefined>, variable: string): string {
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof window === "undefined") {
      setValue("");
      return;
    }

    function read(): void {
      if (!element) return;
      setValue(getComputedStyle(element).getPropertyValue(variable).trim());
    }

    read();

    const observer =
      typeof MutationObserver !== "undefined"
        ? new MutationObserver(read)
        : undefined;
    observer?.observe(element, { attributes: true, attributeFilter: ["style", "class"] });

    window.addEventListener("resize", read);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", read);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current, variable]);

  return value;
}
