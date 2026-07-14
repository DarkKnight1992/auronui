import type { ReactNode } from "react";
import {
  DEFAULT_TOOLTIP_PROVIDER_CONTEXT,
  TooltipProviderContextProvider,
} from "./tooltip-provider.context";

export interface TooltipProviderProps {
  /** Default delay (ms) before a tooltip opens. @default 700 */
  delayDuration?: number;
  /** Default delay (ms) before a tooltip closes. @default 300 */
  closeDelay?: number;
  /** Default for whether the tooltip content stays open while hovered. @default false */
  disableHoverableContent?: boolean;
  isDisabled?: boolean;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  /** Default open trigger for descendant tooltips. @default "hover" */
  trigger?: "hover" | "focus";
  children?: ReactNode;
}

/**
 * Supplies app-wide defaults (delay, closeDelay, disabled, trigger) to descendant
 * `Tooltip` roots. react-aria-components' tooltip warmup/cooldown timer is already
 * global (module-level state inside `useTooltipTriggerState`), so this provider does
 * not need to coordinate anything itself — it is a plain default-value context,
 * mirroring the Vue package's `TooltipProvider` API surface for parity.
 */
export function TooltipProvider({
  delayDuration = DEFAULT_TOOLTIP_PROVIDER_CONTEXT.delayDuration,
  closeDelay = DEFAULT_TOOLTIP_PROVIDER_CONTEXT.closeDelay,
  disableHoverableContent = DEFAULT_TOOLTIP_PROVIDER_CONTEXT.disableHoverableContent,
  isDisabled,
  disabled,
  trigger = DEFAULT_TOOLTIP_PROVIDER_CONTEXT.trigger,
  children,
}: TooltipProviderProps) {
  const resolvedDisabled = isDisabled ?? disabled ?? DEFAULT_TOOLTIP_PROVIDER_CONTEXT.isDisabled;

  return (
    <TooltipProviderContextProvider
      value={{
        delayDuration,
        closeDelay,
        disableHoverableContent,
        isDisabled: resolvedDisabled,
        trigger,
      }}
    >
      {children}
    </TooltipProviderContextProvider>
  );
}
