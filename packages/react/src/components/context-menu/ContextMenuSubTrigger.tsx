import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { menuItemVariants } from "@auronui/styles";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";

export interface ContextMenuSubTriggerOwnProps {
  isDisabled?: boolean;
  textValue?: string;
  className?: ClassValue;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  /** Merge props onto the single child element instead of rendering Radix's own wrapper. */
  asChild?: boolean;
  children?: ReactNode;
}

export type ContextMenuSubTriggerProps = ContextMenuSubTriggerOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof ContextMenuSubTriggerOwnProps>;

export const ContextMenuSubTrigger = forwardRef<HTMLDivElement, ContextMenuSubTriggerProps>(
  function ContextMenuSubTrigger(
    { isDisabled, textValue, className, disabled, asChild = false, children, ...rest },
    ref,
  ) {
    const resolvedDisabled = resolveDeprecatedBooleanProp(
      "ContextMenuSubTrigger",
      "isDisabled",
      isDisabled,
      "disabled",
      disabled,
    );

    const slots = menuItemVariants({ variant: "default" });

    return (
      <ContextMenuPrimitive.SubTrigger
        ref={ref}
        disabled={resolvedDisabled}
        textValue={textValue}
        asChild={asChild}
        className={composeClassName(slots.item(), className)}
        {...rest}
      >
        {children}
        <span className={slots.submenuIndicator()} aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            data-slot="submenu-indicator"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>
      </ContextMenuPrimitive.SubTrigger>
    );
  },
);
