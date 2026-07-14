import type { ReactNode } from "react";
import { TooltipTrigger as AriaTooltipTrigger } from "react-aria-components";
import { DEFAULT_TOOLTIP_PROVIDER_CONTEXT, useTooltipProviderContext } from "./tooltip-provider.context";

export interface TooltipProps {
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  /** Delay (ms) before the tooltip opens. Falls back to `TooltipProvider`'s value, then 700. */
  delayDuration?: number;
  /** Delay (ms) before the tooltip closes. Falls back to `TooltipProvider`'s value, then 300. */
  closeDelay?: number;
  isDisabled?: boolean;
  /** By default opens for both focus and hover; restrict to one. */
  trigger?: "hover" | "focus";
  children: ReactNode;
}

/**
 * Tooltip root. Wraps react-aria-components' `TooltipTrigger`, which manages
 * hover/focus-driven open state and positions the paired `Tooltip` (rendered by
 * our `TooltipContent`). Expects a `TooltipTrigger` + `TooltipContent` as children,
 * same compound shape as the Vue package.
 */
export function Tooltip({
  defaultOpen,
  open,
  onOpenChange,
  delayDuration,
  closeDelay,
  isDisabled,
  trigger,
  children,
}: TooltipProps) {
  const providerCtx = useTooltipProviderContext(DEFAULT_TOOLTIP_PROVIDER_CONTEXT);

  return (
    <AriaTooltipTrigger
      defaultOpen={defaultOpen}
      isOpen={open}
      onOpenChange={onOpenChange}
      delay={delayDuration ?? providerCtx.delayDuration}
      closeDelay={closeDelay ?? providerCtx.closeDelay}
      isDisabled={isDisabled ?? providerCtx.isDisabled}
      trigger={trigger ?? providerCtx.trigger}
    >
      {children}
    </AriaTooltipTrigger>
  );
}
