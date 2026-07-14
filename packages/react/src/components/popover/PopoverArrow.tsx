import { OverlayArrow } from "react-aria-components";
import { composeClassName, type ClassValue } from "../../utils";

export interface PopoverArrowProps {
  width?: number;
  height?: number;
  className?: ClassValue;
}

/**
 * Renders the popover's floating arrow, same approach as `HoverCardArrow`/`TooltipArrow`:
 * react-aria-components' `OverlayArrow` only positions, so a Reka/Radix-shaped triangle SVG is
 * rendered inside it, tagged `data-slot="popover-overlay-arrow"` to match the selector
 * `popover.css` targets for fill + per-side rotation (driven by the `data-side` attribute
 * `PopoverContent`'s `PopoverStateAttrs` bridges onto the popover surface).
 */
export function PopoverArrow({ width = 12, height = 6, className }: PopoverArrowProps) {
  return (
    <OverlayArrow>
      <svg
        width={width}
        height={height}
        viewBox="0 0 12 6"
        preserveAspectRatio="none"
        data-slot="popover-overlay-arrow"
        className={composeClassName(className)}
      >
        <path d="M0 0L6 6L12 0" />
      </svg>
    </OverlayArrow>
  );
}
