import type { ReactNode } from "react";
import { ListBoxItem as RACListBoxItem } from "react-aria-components";
import { listboxItemVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface ComboBoxItemProps {
  value: string;
  isDisabled?: boolean;
  textValue?: string;
  className?: ClassValue;
  classNames?: Partial<{
    item: ClassValue;
    indicator: ClassValue;
  }>;
  children?: ReactNode;
}

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

export function ComboBoxItem({ value, isDisabled, textValue, className, classNames, children }: ComboBoxItemProps) {
  const itemSlots = listboxItemVariants();

  return (
    <RACListBoxItem
      id={value}
      textValue={textValue ?? value}
      isDisabled={isDisabled}
      data-slot="list-box-item"
      data-item-value={value}
      className={composeClassName(itemSlots.item(), className, classNames?.item)}
    >
      {({ isSelected }) => (
        <>
          {children}
          {isSelected && (
            <span
              className={composeClassName(itemSlots.indicator(), classNames?.indicator)}
              data-slot="list-box-item-indicator"
            >
              {DEFAULT_CHECKMARK}
            </span>
          )}
        </>
      )}
    </RACListBoxItem>
  );
}
