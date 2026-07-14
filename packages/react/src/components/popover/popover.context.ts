import type { RefObject } from "react";
import { createStrictContext } from "../../utils";

export interface PopoverContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  /** Ref attached to the trigger element by <PopoverTrigger>. */
  triggerRef: RefObject<HTMLElement | null>;
  /** Ref attached by <PopoverAnchor>, when used, to anchor the popover to a different element than the trigger. */
  anchorRef: RefObject<HTMLElement | null>;
  /** Mirrors Vue's `modal` prop (default `false`): whether the popover traps focus / blocks outside interaction like a modal. */
  modal: boolean;
}

export const { Provider: PopoverContextProvider, useStrictContext: usePopoverContext } =
  createStrictContext<PopoverContextValue>("Popover");
