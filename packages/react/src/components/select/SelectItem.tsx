import type { ReactNode } from "react";
import { ListBoxItem as RACListBoxItem } from "react-aria-components";
import { listboxItemVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import type { SelectItemValue } from "./Select.context";

export interface SelectItemProps {
  value: SelectItemValue;
  textValue?: string;
  isDisabled?: boolean;
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

export function SelectItem({ value, textValue, isDisabled, className, classNames, children }: SelectItemProps) {
  const itemSlots = listboxItemVariants();

  return (
    <RACListBoxItem
      id={String(value)}
      textValue={textValue ?? String(value)}
      isDisabled={isDisabled}
      data-slot="list-box-item"
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
