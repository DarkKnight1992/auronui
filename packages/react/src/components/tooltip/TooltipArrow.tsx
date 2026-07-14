import { OverlayArrow } from "react-aria-components";
import { composeClassName, type ClassValue } from "../../utils";

export interface TooltipArrowProps {
  width?: number;
  height?: number;
  className?: ClassValue;
}

/**
 * Renders the tooltip's floating-arrow. react-aria-components has no dedicated
 * arrow subcomponent, but `tooltip.css` targets a real DOM node via
 * `[data-slot="overlay-arrow"]` (fill/stroke + per-side rotation), so this wraps
 * react-aria-components' generic `OverlayArrow` (which only provides positioning)
 * with the same triangle SVG shape Reka UI/Radix use, tagged with that data-slot.
 */
export function TooltipArrow({ width = 12, height = 6, className }: TooltipArrowProps) {
  return (
    <OverlayArrow>
      <svg
        width={width}
        height={height}
        viewBox="0 0 12 6"
        preserveAspectRatio="none"
        data-slot="overlay-arrow"
        className={composeClassName(className)}
      >
        <path d="M0 0L6 6L12 0" />
      </svg>
    </OverlayArrow>
  );
}
