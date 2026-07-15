import { useCallback, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { Select as RACSelect, type Key } from "react-aria-components";
import { selectVariants, type SelectVariants } from "@auronui/styles";
import { composeClassName, dataAttr, type ClassValue } from "../../utils";
import type { ChipProps } from "../chip";
import { SelectProvider } from "./Select.context";
import type { SelectItemValue, SelectItemData } from "./Select.context";
import { SelectTrigger } from "./SelectTrigger";
import { SelectValue } from "./SelectValue";
import { SelectContent } from "./SelectContent";
import { SelectItem } from "./SelectItem";

export type { SelectItemValue, SelectItemData };

export interface SelectOwnProps {
  variant?: SelectVariants["variant"];
  size?: SelectVariants["size"];
  color?: SelectVariants["color"];
  labelPlacement?: SelectVariants["labelPlacement"];
  fullWidth?: boolean;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  placeholder?: string;
  name?: string;
  label?: string;
  description?: string;
  errorMessage?: string;
  className?: ClassValue;
  classNames?: Partial<{
    base: ClassValue;
    label: ClassValue;
    mainWrapper: ClassValue;
    helperWrapper: ClassValue;
    errorMessage: ClassValue;
    description: ClassValue;
    item: ClassValue;
    indicator: ClassValue;
    trigger: ClassValue;
    startContent: ClassValue;
    triggerIndicator: ClassValue;
    value: ClassValue;
    chip: Partial<NonNullable<ChipProps["classNames"]>>;
  }>;

  /** Two-way bound selected value. Accepts string or numeric keys. */
  value?: SelectItemValue | SelectItemValue[];
  defaultValue?: SelectItemValue | SelectItemValue[];
  onValueChange?: (value: SelectItemValue | SelectItemValue[]) => void;
  /** Allow selecting multiple values. value becomes an array. @default false */
  multiple?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  /** Data-driven items for the terse API. */
  items?: SelectItemData[];
  renderItem?: (item: SelectItemData) => ReactNode;
  startContent?: ReactNode;
  children?: ReactNode;
}

export type SelectProps = SelectOwnProps;

function toRACValue(value: SelectItemValue | SelectItemValue[] | undefined, multiple: boolean): Key | Key[] | null {
  if (multiple) return (value as SelectItemValue[] | undefined)?.map((v) => String(v)) ?? [];
  return value == null ? null : String(value);
}

export function Select({
  variant = "flat",
  size = "md",
  color = "default",
  labelPlacement = "inside",
  fullWidth = false,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  placeholder,
  name,
  label,
  description,
  errorMessage,
  className,
  classNames,
  value,
  defaultValue,
  onValueChange,
  multiple = false,
  open,
  defaultOpen,
  onOpenChange,
  items = [],
  renderItem,
  startContent,
  children,
}: SelectProps) {
  const generatedId = useId();
  const triggerId = generatedId;
  const descriptionId = `${triggerId}-description`;
  const errorMessageId = `${triggerId}-error`;

  const hasLabel = !!label;
  const showOutsideLabel = hasLabel && labelPlacement !== "inside";
  const showError = isInvalid && !!errorMessage;
  const showDescription = !showError && !!description;
  const hasHelper = showError || showDescription;
  const ariaDescribedBy = showError ? errorMessageId : showDescription ? descriptionId : undefined;

  const itemRegistry = useRef(new Map<SelectItemValue, string>());
  for (const item of items) {
    itemRegistry.current.set(item.value, item.label ?? String(item.value));
  }

  const itemLabel = useCallback((v: SelectItemValue | SelectItemValue[] | undefined | null): string => {
    if (v == null) return "";
    if (Array.isArray(v)) {
      return v
        .map((x) => String(itemRegistry.current.get(x) ?? x))
        .filter((s) => s.length > 0)
        .join(", ");
    }
    return itemRegistry.current.get(v) ?? String(v);
  }, []);

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<SelectItemValue | SelectItemValue[] | undefined>(
    defaultValue ?? (multiple ? [] : undefined),
  );
  const currentValue = isControlled ? value : internalValue;

  const removeValue = useCallback(
    (v: SelectItemValue) => {
      const current = Array.isArray(currentValue) ? currentValue : [];
      const next = current.filter((x) => x !== v);
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [currentValue, isControlled, onValueChange],
  );

  const handleChange = useCallback(
    (key: Key | Key[] | null) => {
      let next: SelectItemValue | SelectItemValue[];
      if (multiple) {
        next = (key as Key[]).map((k) => String(k));
      } else {
        next = key == null ? "" : String(key);
      }
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [multiple, isControlled, onValueChange],
  );

  const isFilled = multiple ? Array.isArray(currentValue) && currentValue.length > 0 : currentValue != null && currentValue !== "";

  const slots = useMemo(
    () =>
      selectVariants({
        variant,
        size,
        color,
        fullWidth,
        isInvalid,
        isDisabled,
        isReadonly: isReadOnly,
        hasLabel,
        labelPlacement,
      }),
    [variant, size, color, fullWidth, isInvalid, isDisabled, isReadOnly, hasLabel, labelPlacement],
  );

  const contextValue = useMemo(
    () => ({
      isDisabled,
      isInvalid,
      isReadonly: isReadOnly,
      isRequired,
      fullWidth,
      hasLabel,
      labelPlacement,
      triggerId,
      label,
      ariaDescribedBy,
      slots,
      multiple,
      isFilled,
      itemLabel,
      removeValue,
    }),
    [isDisabled, isInvalid, isReadOnly, isRequired, fullWidth, hasLabel, labelPlacement, triggerId, label, ariaDescribedBy, slots, multiple, isFilled, itemLabel, removeValue],
  );

  const usesCustomChrome = children != null;

  return (
    <SelectProvider value={contextValue}>
      <div className={composeClassName(slots.base(), className, classNames?.base)} data-invalid={dataAttr(isInvalid)} data-disabled={dataAttr(isDisabled)}>
        {showOutsideLabel && (
          <label htmlFor={triggerId} className={composeClassName(slots.label(), classNames?.label)} data-slot="label">
            {label}
            {isRequired && <span aria-hidden="true"> *</span>}
          </label>
        )}

        <div className={composeClassName(slots.mainWrapper(), classNames?.mainWrapper)}>
          <RACSelect
            value={toRACValue(currentValue, multiple) as never}
            onChange={handleChange as never}
            selectionMode={multiple ? "multiple" : "single"}
            isDisabled={isDisabled}
            isRequired={isRequired}
            isInvalid={isInvalid}
            name={name}
            placeholder={placeholder}
            isOpen={open}
            defaultOpen={defaultOpen}
            onOpenChange={onOpenChange}
          >
            {usesCustomChrome ? (
              children
            ) : (
              <>
                <SelectTrigger
                  startContent={startContent}
                  classNames={{ trigger: classNames?.trigger, label: classNames?.label, startContent: classNames?.startContent }}
                >
                  <SelectValue placeholder={placeholder} classNames={{ value: classNames?.value, chip: classNames?.chip }} />
                </SelectTrigger>
                <SelectContent>
                  {items.map((item) => (
                    <SelectItem
                      key={item.value}
                      value={item.value}
                      textValue={item.textValue ?? item.label}
                      isDisabled={item.isDisabled}
                      classNames={{ item: classNames?.item, indicator: classNames?.indicator }}
                    >
                      {renderItem ? renderItem(item) : (item.label ?? String(item.value))}
                    </SelectItem>
                  ))}
                </SelectContent>
              </>
            )}
          </RACSelect>

          {hasHelper && (
            <div className={composeClassName(slots.helperWrapper(), classNames?.helperWrapper)} data-slot="helper-wrapper">
              {showError ? (
                <p id={errorMessageId} className={composeClassName(slots.errorMessage(), classNames?.errorMessage)} aria-live="polite" data-slot="error-message">
                  {errorMessage}
                </p>
              ) : (
                <p id={descriptionId} className={composeClassName(slots.description(), classNames?.description)} data-slot="description">
                  {description}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </SelectProvider>
  );
}
