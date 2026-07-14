import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { menuItemVariants } from "@auronui/styles";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";

export interface ContextMenuCheckboxItemOwnProps {
  textValue?: string;
  isDisabled?: boolean;
  variant?: "default" | "danger";
  className?: ClassValue;
  /** Controlled checked state. */
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  /** Merge props onto the single child element instead of rendering Radix's own wrapper. */
  asChild?: boolean;
  onSelect?: (event: Event) => void;
  children?: ReactNode;
}

export type ContextMenuCheckboxItemProps = ContextMenuCheckboxItemOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof ContextMenuCheckboxItemOwnProps>;

/**
 * Deviation from the Vue version: the Vue `ContextMenuCheckboxItem` supports a dual
 * `modelValue`/`isSelected` v-model pair (a bare `defineModel` plus an explicit
 * `modelValue` prop override, matching the reka-ui/Vue two-way-binding idiom). React
 * has no v-model equivalent — this mirrors `MenubarCheckboxItem`'s plain, fully
 * controlled `checked`/`onCheckedChange` pair instead.
 */
export const ContextMenuCheckboxItem = forwardRef<HTMLDivElement, ContextMenuCheckboxItemProps>(
  function ContextMenuCheckboxItem(
    {
      textValue,
      isDisabled,
      variant = "default",
      className,
      checked,
      onCheckedChange,
      disabled,
      asChild = false,
      onSelect,
      children,
      ...rest
    },
    ref,
  ) {
    const resolvedDisabled = resolveDeprecatedBooleanProp(
      "ContextMenuCheckboxItem",
      "isDisabled",
      isDisabled,
      "disabled",
      disabled,
    );

    const slots = menuItemVariants({ variant });

    return (
      <ContextMenuPrimitive.CheckboxItem
        ref={ref}
        checked={checked}
        textValue={textValue}
        disabled={resolvedDisabled}
        asChild={asChild}
        className={composeClassName(slots.item(), className)}
        onCheckedChange={onCheckedChange}
        onSelect={onSelect}
        {...rest}
      >
        <ContextMenuPrimitive.ItemIndicator className={slots.indicator()} forceMount>
          {/* Checkmark indicator */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            data-slot="menu-item-indicator--checkmark"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </ContextMenuPrimitive.ItemIndicator>

        {children}
      </ContextMenuPrimitive.CheckboxItem>
    );
  },
);
