import { OverlayArrow } from "react-aria-components";
import { composeClassName, type ClassValue } from "../../utils";

export interface HoverCardArrowProps {
  width?: number;
  height?: number;
  className?: ClassValue;
}

/**
 * Renders the hover card's floating arrow, same approach as `TooltipArrow`:
 * react-aria-components' `OverlayArrow` only positions, so a Reka/Radix-shaped
 * triangle SVG is rendered inside it, tagged `data-slot="hover-card-overlay-arrow"`
 * to match the selector `hover-card.css` targets for fill + per-side rotation.
 */
export function HoverCardArrow({ width = 12, height = 6, className }: HoverCardArrowProps) {
  return (
    <OverlayArrow>
      <svg
        width={width}
        height={height}
        viewBox="0 0 12 6"
        preserveAspectRatio="none"
        data-slot="hover-card-overlay-arrow"
        className={composeClassName(className)}
      >
        <path d="M0 0L6 6L12 0" />
      </svg>
    </OverlayArrow>
  );
}
