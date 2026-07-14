import type { ReactNode } from "react";
import { Group, Input, Button as RACButton } from "react-aria-components";
import { composeClassName, dataAttr, type ClassValue } from "../../utils";
import { Chip, type ChipProps } from "../chip";
import { Spinner } from "../spinner";
import { useAutocompleteContext } from "./Autocomplete.context";

export interface AutocompleteInputProps {
  placeholder?: string;
  autoFocus?: boolean;
  startContent?: ReactNode;
  clearIcon?: ReactNode;
  triggerIcon?: ReactNode;
  classNames?: Partial<{
    trigger: ClassValue;
    label: ClassValue;
    startContent: ClassValue;
    input: ClassValue;
    clearButton: ClassValue;
    indicator: ClassValue;
    chip: Partial<NonNullable<ChipProps["classNames"]>>;
  }>;
}

const DEFAULT_CLEAR_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const DEFAULT_TRIGGER_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export function AutocompleteInput({ placeholder, autoFocus, startContent, clearIcon, triggerIcon, classNames }: AutocompleteInputProps) {
  const ctx = useAutocompleteContext();
  const showInsideLabel = ctx.hasLabel && ctx.labelPlacement === "inside";
  const effectivePlaceholder = ctx.multiple && ctx.selectedValues.length > 0 ? undefined : placeholder;

  return (
    // RAC's ComboBox (which Autocomplete is built on) anchors the popover's
    // width/position to this Group (falling back to just the <Input> + toggle
    // button if no Group is rendered) — without it, the popover silently
    // excluded the clear button and the wrapper's own padding/border,
    // rendering narrower than the visible field.
    <Group
      className={composeClassName(ctx.slots.trigger(), classNames?.trigger)}
      data-filled={ctx.hasLabel ? dataAttr(ctx.isFilled) : undefined}
      data-invalid={dataAttr(ctx.isInvalid)}
      data-disabled={dataAttr(ctx.isDisabled)}
      data-readonly={dataAttr(ctx.isReadonly)}
      data-multiple-overflow={ctx.multiple ? ctx.multipleOverflow : undefined}
      data-slot="trigger"
    >
      {showInsideLabel && (
        <span className={composeClassName(ctx.slots.label(), classNames?.label)} data-slot="label">
          {ctx.label}
          {ctx.isRequired && <span aria-hidden="true"> *</span>}
        </span>
      )}
      {startContent && (
        <span className={composeClassName(ctx.slots.startContent(), classNames?.startContent)} data-slot="start-content">
          {startContent}
        </span>
      )}
      {ctx.multiple &&
        ctx.selectedLabels.map((item) => (
          <Chip
            key={item.value}
            size="sm"
            isClosable
            closeAriaLabel={`Remove ${item.label}`}
            data-slot="selected-chip"
            classNames={classNames?.chip}
            onClose={() => ctx.removeValue(item.value)}
          >
            {item.label}
          </Chip>
        ))}
      <Input
        id={ctx.inputId}
        autoFocus={autoFocus}
        placeholder={effectivePlaceholder}
        readOnly={ctx.isReadonly}
        required={ctx.isRequired}
        aria-invalid={ctx.isInvalid || undefined}
        aria-describedby={ctx.ariaDescribedBy}
        aria-label={ctx.hasLabel ? ctx.label : undefined}
        className={composeClassName(ctx.slots.input(), classNames?.input)}
        data-slot="input"
        autoComplete="off"
      />
      {/* slot="clear" opts this Button out of ComboBox's default (unnamed-slot)
          ButtonContext, which otherwise carries the dropdown-toggle press handler. */}
      <RACButton
        slot="clear"
        className={composeClassName(ctx.slots.clearButton(), classNames?.clearButton)}
        data-empty={!ctx.isFilled || ctx.isReadonly || ctx.isDisabled ? "true" : undefined}
        data-slot="clear-button"
        aria-label="Clear"
        onPress={() => (ctx.multiple ? ctx.clearAll() : undefined)}
      >
        {clearIcon ?? DEFAULT_CLEAR_ICON}
      </RACButton>
      {ctx.isLoading ? (
        <span
          className={composeClassName(ctx.slots.indicator(), classNames?.indicator)}
          data-slot="autocomplete-loading-indicator"
          role="status"
          aria-live="polite"
          aria-label="Loading suggestions"
        >
          <Spinner size="sm" />
        </span>
      ) : (
        <RACButton
          className={composeClassName(ctx.slots.indicator(), classNames?.indicator)}
          data-slot="autocomplete-default-indicator"
          aria-label="Toggle suggestions"
        >
          {triggerIcon ?? DEFAULT_TRIGGER_ICON}
        </RACButton>
      )}
    </Group>
  );
}
