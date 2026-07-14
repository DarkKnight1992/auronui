import type { RefObject } from "react";
import { createStrictContext } from "../../utils";

export interface HoverCardContextValue {
  isOpen: boolean;
  triggerRef: RefObject<HTMLElement | null>;
  /** Opens the card. Debounced by `openDelay` unless `immediate` (keyboard focus). */
  scheduleOpen: (immediate?: boolean) => void;
  /** Closes the card. Debounced by `closeDelay` unless `immediate` (blur, Escape). */
  scheduleClose: (immediate?: boolean) => void;
  /** Cancels a pending scheduled close (e.g. pointer re-entered trigger or content). */
  cancelClose: () => void;
}

export const { Provider: HoverCardContextProvider, useStrictContext: useHoverCardContext } =
  createStrictContext<HoverCardContextValue>("HoverCard");
