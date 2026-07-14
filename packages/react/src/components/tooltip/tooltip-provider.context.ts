import { createStrictContext } from "../../utils";

/**
 * Config supplied by `TooltipProvider` to descendant `Tooltip` roots.
 *
 * Unlike Reka UI's `TooltipProvider` (which coordinates a shared "skip delay"
 * timer across sibling tooltips), react-aria-components' `useTooltipTriggerState`
 * already implements a global warmup/cooldown timer internally (module-level
 * state shared by every `TooltipTrigger` in the app) — so `skipDelayDuration`
 * has no equivalent knob to forward here. This context exists purely to let
 * consumers set app-wide *defaults* for `delayDuration`/`closeDelay`/etc. that
 * an individual `Tooltip` can still override, mirroring the Vue API surface.
 */
export interface TooltipProviderContext {
  delayDuration: number;
  closeDelay: number;
  disableHoverableContent: boolean;
  isDisabled: boolean;
  trigger: "hover" | "focus";
}

export const DEFAULT_TOOLTIP_PROVIDER_CONTEXT: TooltipProviderContext = {
  delayDuration: 700,
  closeDelay: 300,
  disableHoverableContent: false,
  isDisabled: false,
  trigger: "hover",
};

export const {
  Provider: TooltipProviderContextProvider,
  useStrictContext: useTooltipProviderContext,
} = createStrictContext<TooltipProviderContext>("TooltipProvider");
