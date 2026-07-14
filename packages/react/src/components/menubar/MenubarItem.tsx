import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { menuItemVariants, type MenuItemVariants } from "@auronui/styles";
import { composeClassName, resolveDeprecatedBooleanProp, type ClassValue } from "../../utils";

export interface MenubarItemOwnProps {
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

export type MenubarItemProps = MenubarItemOwnProps &
  Omit<ComponentPropsWithoutRef<"div">, keyof MenubarItemOwnProps>;

export const MenubarItem = forwardRef<HTMLDivElement, MenubarItemProps>(function MenubarItem(
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
    "MenubarItem",
    "isDisabled",
    isDisabled,
    "disabled",
    disabled,
  );

  const slots = menuItemVariants({ variant });

  return (
    <MenubarPrimitive.Item
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
    </MenubarPrimitive.Item>
  );
});
