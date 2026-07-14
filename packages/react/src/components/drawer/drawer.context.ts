import type { RefObject } from "react";
import { createStrictContext } from "../../utils";

export type DrawerPlacement = "top" | "right" | "bottom" | "left";
export type DrawerSize = "sm" | "md" | "lg" | "xl" | "full";

export interface DrawerContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  /** Ref attached to the trigger element by <DrawerTrigger>. */
  triggerRef: RefObject<HTMLElement | null>;
  placement: DrawerPlacement;
  /** Reserved for parity with the Vue package's API; not currently consumed by drawer.styles.ts. */
  size: DrawerSize;
  inline: boolean;
  hideBackdrop: boolean;
  dock: boolean;
}

export const { Provider: DrawerContextProvider, useStrictContext: useDrawerContext } =
  createStrictContext<DrawerContextValue>("Drawer");
