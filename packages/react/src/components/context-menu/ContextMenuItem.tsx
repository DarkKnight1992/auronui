import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { menuItemVariants, type MenuItemVariants } from "@auronui/styles";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";

export interface ContextMenuItemOwnProps {
  textValue?: string;
  isDisabled?: boolean;
  variant?: MenuItemVariants["variant"];
  shortcut?: string;
  description?: string;
  className?: ClassValue;
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean;
  /** Merge props onto the single child element instead of rendering Radix's own wrapper. */
  asChild?: boolean;
  onSelect?: (event: Event) => void;
  startContent?: ReactNode;
  endContent?: ReactNode;
  children?: ReactNode;
}

export type ContextMenuItemProps = ContextMenuItemOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof ContextMenuItemOwnProps>;

export const ContextMenuItem = forwardRef<HTMLDivElement, ContextMenuItemProps>(
  function ContextMenuItem(
    {
      textValue,
      isDisabled,
      variant = "default",
      shortcut,
      description,
      className,
      disabled,
      asChild = false,
      onSelect,
      startContent,
      endContent,
      children,
      ...rest
    },
    ref,
  ) {
    const resolvedDisabled = resolveDeprecatedBooleanProp(
      "ContextMenuItem",
      "isDisabled",
      isDisabled,
      "disabled",
      disabled,
    );

    const slots = menuItemVariants({ variant });

    return (
      <ContextMenuPrimitive.Item
        ref={ref}
        textValue={textValue}
        disabled={resolvedDisabled}
        asChild={asChild}
        className={composeClassName(slots.item(), className)}
        onSelect={onSelect}
        {...rest}
      >
        {startContent}

        <div className="flex flex-1 flex-col">
          <span data-slot="label">{children}</span>
          {description && <span data-slot="description">{description}</span>}
        </div>

        {/* Raw <kbd> (not <Kbd>): a menu shortcut renders as plain muted text; <Kbd> applies a
            boxed keycap style that would break visual parity with HeroUI's menu shortcuts. */}
        {shortcut && (
          <kbd data-slot="shortcut" className="ml-auto text-xs text-muted font-mono">
            {shortcut}
          </kbd>
        )}

        {endContent}
      </ContextMenuPrimitive.Item>
    );
  },
);
