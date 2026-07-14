import type { ReactElement } from "react";
import { SubmenuTrigger } from "react-aria-components";
import { DropdownSubProvider } from "./DropdownSub.context";

export interface DropdownSubProps {
  /** The delay (ms) before the submenu opens on hover. Default 200 (react-aria-components' default). */
  delay?: number;
  /**
   * Whether hovering the trigger opens the submenu. When false, hover-opening is effectively
   * disabled (a very large delay) while click/keyboard activation (Enter/ArrowRight) still
   * opens it instantly — react-aria-components' `useSubmenuTrigger` fires `onPress` independent
   * of the hover `delay`, so this mirrors reka-ui's DropdownSub.vue `openOnHover` behavior
   * without needing to intercept pointer events manually.
   */
  openOnHover?: boolean;
  /** Exactly two children: the trigger item (<DropdownSubTrigger>) and the submenu content (<DropdownSubContent>). */
  children: [ReactElement, ReactElement];
}

export function DropdownSub({ delay = 200, openOnHover = true, children }: DropdownSubProps) {
  return (
    <DropdownSubProvider value={{ openOnHover }}>
      <SubmenuTrigger delay={openOnHover ? delay : Number.MAX_SAFE_INTEGER}>{children}</SubmenuTrigger>
    </DropdownSubProvider>
  );
}
