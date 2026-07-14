import { useCallback, useId, useMemo, useState, type Key, type ReactNode } from "react";
import { ComboBox as RACComboBox } from "react-aria-components";
import { comboBoxVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { ComboBoxProvider } from "./ComboBox.context";
import { ComboBoxInput } from "./ComboBoxInput";
import { ComboBoxContent } from "./ComboBoxContent";
import { ComboBoxItem } from "./ComboBoxItem";

export interface ComboBoxItemData {
  value: string;
  label?: string;
  textValue?: string;
  isDisabled?: boolean;
}

export interface ComboBoxOwnProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /**
   * Called when the dropdown's open state changes.
   *
   * Note: unlike Select, react-aria-components' ComboBox does not support a
   * controlled `isOpen`/`defaultOpen` pair (a native combobox's menu opens
   * from focus/typing, not external control) — only this change callback.
   */
  onOpenChange?: (open: boolean) => void;
  items?: ComboBoxItemData[];
  label?: string;
  placeholder?: string;
  description?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  allowsCustomValue?: boolean;
  fullWidth?: boolean;
  /** Custom filter function: return true to include item. */
  filterFunction?: (itemText: string, searchTerm: string) => boolean;
  className?: ClassValue;
  classNames?: Partial<{
    base: ClassValue;
    item: ClassValue;
    indicator: ClassValue;
  }>;
  name?: string;
  renderItem?: (item: ComboBoxItemData) => ReactNode;
  children?: ReactNode;
}

export type ComboBoxProps = ComboBoxOwnProps;

export function ComboBox({
  value,
  defaultValue,
  onValueChange,
  onOpenChange,
  items = [],
  label,
  placeholder,
  description,
  errorMessage,
  isInvalid = false,
  isDisabled = false,
  isRequired = false,
  allowsCustomValue = false,
  fullWidth = false,
  filterFunction,
  className,
  classNames,
  name,
  renderItem,
  children,
}: ComboBoxProps) {
  const labelId = useId();

  const itemByValue = useMemo(() => new Map(items.map((i) => [i.value, i])), [items]);

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const currentValue = isControlled ? value : internalValue;

  const [inputValue, setInputValue] = useState<string>(() => {
    const item = currentValue != null ? itemByValue.get(currentValue) : undefined;
    return item ? (item.label ?? item.textValue ?? item.value) : (currentValue ?? "");
  });

  const commit = useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const handleSelectionChange = useCallback(
    (key: Key | null) => {
      const next = key == null ? "" : String(key);
      commit(next);
      const item = next ? itemByValue.get(next) : undefined;
      setInputValue(item ? (item.label ?? item.textValue ?? item.value) : next);
    },
    [commit, itemByValue],
  );

  const handleInputChange = useCallback(
    (text: string) => {
      setInputValue(text);
      if (allowsCustomValue) commit(text);
    },
    [allowsCustomValue, commit],
  );

  const clearValue = useCallback(() => {
    setInputValue("");
    commit("");
  }, [commit]);

  const slots = useMemo(() => comboBoxVariants({ fullWidth }), [fullWidth]);

  const contextValue = useMemo(
    () => ({ isDisabled, isInvalid, fullWidth, slots, hasValue: inputValue.length > 0, clearValue }),
    [isDisabled, isInvalid, fullWidth, slots, inputValue, clearValue],
  );

  const usesCustomChrome = children != null;
  const defaultFilter = filterFunction
    ? filterFunction
    : (itemText: string, searchTerm: string) => itemText.toLowerCase().includes(searchTerm.toLowerCase());

  return (
    <ComboBoxProvider value={contextValue}>
      <div className={composeClassName(slots.base(), className, classNames?.base)} aria-invalid={isInvalid || undefined} data-slot="combo-box">
        {label && (
          <label id={labelId} data-slot="label">
            {label}
            {isRequired && <span aria-hidden="true"> *</span>}
          </label>
        )}

        <RACComboBox
          inputValue={inputValue}
          onInputChange={handleInputChange}
          selectedKey={currentValue ?? null}
          onSelectionChange={handleSelectionChange}
          allowsCustomValue={allowsCustomValue}
          isDisabled={isDisabled}
          isRequired={isRequired}
          isInvalid={isInvalid}
          name={name}
          onOpenChange={onOpenChange}
          defaultFilter={defaultFilter}
          aria-labelledby={label ? labelId : undefined}
        >
          {usesCustomChrome ? (
            children
          ) : (
            <>
              <ComboBoxInput placeholder={placeholder} />
              <ComboBoxContent>
                {items.map((item) => (
                  <ComboBoxItem
                    key={item.value}
                    value={item.value}
                    isDisabled={item.isDisabled}
                    textValue={item.textValue ?? item.label ?? item.value}
                    classNames={{ item: classNames?.item, indicator: classNames?.indicator }}
                  >
                    {renderItem ? renderItem(item) : (item.label ?? item.textValue ?? item.value)}
                  </ComboBoxItem>
                ))}
              </ComboBoxContent>
            </>
          )}
        </RACComboBox>

        {(description || (isInvalid && errorMessage)) && (
          <div data-slot="helper-wrapper">
            {isInvalid && errorMessage ? (
              <p data-slot="error-message" aria-live="polite">
                {errorMessage}
              </p>
            ) : (
              description && <p data-slot="description">{description}</p>
            )}
          </div>
        )}
      </div>
    </ComboBoxProvider>
  );
}
