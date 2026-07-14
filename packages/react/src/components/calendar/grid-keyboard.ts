/**
 * Roving-tabindex keyboard navigation for the 3x4 "drill-up" grids (month picker,
 * year picker, month/year range pickers). Mirrors the WAI-ARIA grid pattern's
 * arrow-key semantics (reka-ui/react-aria implement the same shape for the day grid).
 *
 * Pure function, not a hook: each grid component owns its own `focusedIndex` state
 * and a `refs` array of button elements, and calls this to compute the next index
 * on `onKeyDown`.
 */
export function nextGridIndex(
  key: string,
  index: number,
  count: number,
  cols: number,
): number | null {
  if (count === 0) return null;
  const row = Math.floor(index / cols);

  switch (key) {
    case "ArrowRight":
      return index + 1 < count ? index + 1 : index;
    case "ArrowLeft":
      return index - 1 >= 0 ? index - 1 : index;
    case "ArrowDown":
      return index + cols < count ? index + cols : index;
    case "ArrowUp":
      return index - cols >= 0 ? index - cols : index;
    case "Home":
      return row * cols;
    case "End":
      return Math.min(row * cols + cols - 1, count - 1);
    default:
      return null;
  }
}
