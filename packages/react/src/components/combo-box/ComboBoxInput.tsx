import type { ReactNode } from "react";
import { Group, Input, Button as RACButton } from "react-aria-components";
import { dataAttr } from "../../utils";
import { useComboBoxContext } from "./ComboBox.context";

export interface ComboBoxInputProps {
  placeholder?: string;
  autoFocus?: boolean;
  clearIcon?: ReactNode;
  triggerIcon?: ReactNode;
}

const DEFAULT_CLEAR_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const DEFAULT_TRIGGER_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    data-slot="combo-box-trigger-default-icon"
    aria-hidden="true"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export function ComboBoxInput({ placeholder, autoFocus, clearIcon, triggerIcon }: ComboBoxInputProps) {
  const ctx = useComboBoxContext();

  return (
    // RAC's ComboBox anchors the popover's width/position to this Group (falling
    // back to just the <Input> + toggle button if no Group is rendered) — without
    // it, the popover silently excluded the clear button and the wrapper's own
    // padding/border, rendering narrower than the visible field.
    <Group className={ctx.slots.inputGroup()} data-slot="input-group">
      <Input placeholder={placeholder} autoFocus={autoFocus} className={ctx.slots.input()} data-slot="input" autoComplete="off" />
      {/* slot="clear" opts this Button out of ComboBox's default (unnamed-slot)
          ButtonContext — otherwise it would also receive the dropdown-toggle
          press handler merged in, alongside our own onPress below. */}
      <RACButton
        slot="clear"
        className={ctx.slots.clearButton()}
        data-slot="clear-button"
        data-empty={dataAttr(!ctx.hasValue)}
        aria-label="Clear"
        onPress={ctx.clearValue}
      >
        {clearIcon ?? DEFAULT_CLEAR_ICON}
      </RACButton>
      <RACButton className={ctx.slots.trigger()} data-slot="selector-button" aria-label="Toggle suggestions">
        {triggerIcon ?? DEFAULT_TRIGGER_ICON}
      </RACButton>
    </Group>
  );
}
