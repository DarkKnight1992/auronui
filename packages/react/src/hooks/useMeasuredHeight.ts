import { useEffect, useState, type RefObject } from "react";

/**
 * Tracks an element's offsetHeight reactively using a plain `ResizeObserver`.
 * Returns 0 before mount or when the ref's element is null.
 *
 * @param ref - Ref object pointing at the target element
 * @returns Current element height in pixels
 */
export function useMeasuredHeight(ref: RefObject<HTMLElement | null>): number {
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      setHeight(0);
      return;
    }

    setHeight(element.offsetHeight);

    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const target = entry.target;
        setHeight(target instanceof HTMLElement ? target.offsetHeight : 0);
      }
    });
    observer.observe(element);

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current]);

  return height;
}
