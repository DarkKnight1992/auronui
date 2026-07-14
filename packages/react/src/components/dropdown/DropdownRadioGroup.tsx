import { useState, type Key, type ReactNode } from "react";
import { MenuSection, type Selection } from "react-aria-components";

export interface DropdownRadioGroupProps {
  /** Controlled selected value. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  children?: ReactNode;
}

/**
 * Maps to react-aria-components' <MenuSection selectionMode="single">, which is the idiomatic
 * RAC primitive for a single-select group of items scoped to a subset of the menu — a direct,
 * accurate fit for reka-ui's DropdownMenuRadioGroup (unlike DropdownCheckboxItem, which needed
 * a workaround since it has no grouping concept in the Vue source).
 */
export function DropdownRadioGroup({ value, defaultValue = "", onChange, children }: DropdownRadioGroupProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const resolvedValue = value ?? uncontrolledValue;

  function handleSelectionChange(keys: Selection) {
    if (keys === "all") return;
    const next = (Array.from(keys as Set<Key>)[0] as string | undefined) ?? "";
    setUncontrolledValue(next);
    onChange?.(next);
  }

  return (
    <MenuSection
      selectionMode="single"
      selectedKeys={resolvedValue ? [resolvedValue] : []}
      onSelectionChange={handleSelectionChange}
    >
      {children}
    </MenuSection>
  );
}
