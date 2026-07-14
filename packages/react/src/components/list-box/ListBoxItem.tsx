import { forwardRef, type ReactNode } from "react";
import { ListBoxItem as RACListBoxItem, type ListBoxItemProps as RACListBoxItemProps } from "react-aria-components";
import { listboxItemVariants, type ListBoxItemVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { DEFAULT_LIST_BOX_CONTEXT, useListBoxContext } from "./ListBox.context";

export interface ListBoxItemOwnProps {
  value: string;
  textValue?: string;
  isDisabled?: boolean;
  variant?: ListBoxItemVariants["variant"];
  className?: ClassValue;
  classNames?: Partial<{
    item: ClassValue;
    indicator: ClassValue;
  }>;
  /** Hide this item's selected indicator. Falls back to the ListBox setting. */
  hideSelectedIcon?: boolean;
  startContent?: ReactNode;
  endContent?: ReactNode;
  /** Custom selected-state icon. Defaults to a checkmark. */
  selectedIcon?: ReactNode;
  children?: ReactNode;
}

export type ListBoxItemProps = ListBoxItemOwnProps &
  Omit<RACListBoxItemProps<object>, keyof ListBoxItemOwnProps | "children" | "id">;

const DEFAULT_CHECKMARK = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    data-slot="list-box-item-indicator--checkmark"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const ListBoxItem = forwardRef<HTMLDivElement, ListBoxItemProps>(function ListBoxItem(
  {
    value,
    textValue,
    isDisabled,
    variant,
    className,
    classNames,
    hideSelectedIcon,
    startContent,
    endContent,
    selectedIcon,
    children,
    ...rest
  },
  forwardedRef,
) {
  const ctx = useListBoxContext(DEFAULT_LIST_BOX_CONTEXT);

  const finalVariant = variant ?? ctx.itemVariant;
  const finalDisabled = ctx.isDisabled || isDisabled;
  const finalHideSelectedIcon = hideSelectedIcon ?? ctx.hideSelectedIcon;

  const slotFns = listboxItemVariants({ variant: finalVariant });

  return (
    <RACListBoxItem
      ref={forwardedRef}
      id={value}
      textValue={textValue ?? value}
      isDisabled={finalDisabled}
      className={composeClassName(slotFns.item(), className, classNames?.item)}
      {...rest}
    >
      {({ isSelected }) => (
        <>
          {startContent}
          {children}
          {endContent}
          {!finalHideSelectedIcon && isSelected && (
            <span
              className={composeClassName(slotFns.indicator(), classNames?.indicator)}
              data-slot="list-box-item-indicator"
            >
              {selectedIcon ?? DEFAULT_CHECKMARK}
            </span>
          )}
        </>
      )}
    </RACListBoxItem>
  );
});
