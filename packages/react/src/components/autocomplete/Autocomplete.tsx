import { useCallback, useEffect, useId, useMemo, useRef, useState, type Key, type ReactNode } from "react";
import { ComboBox as RACComboBox } from "react-aria-components";
import { autocompleteVariants, type AutocompleteVariants } from "@auronui/styles";
import { composeClassName, dataAttr, type ClassValue } from "../../utils";
import type { ChipProps } from "../chip";
import { AutocompleteProvider } from "./Autocomplete.context";
import { AutocompleteInput } from "./AutocompleteInput";
import { AutocompleteContent } from "./AutocompleteContent";
import { AutocompleteItem } from "./AutocompleteItem";
import { AutocompleteCreateItem, CREATE_ITEM_ID } from "./AutocompleteCreateItem";

export interface AutocompleteItemData {
  value: string;
  label?: string;
  textValue?: string;
  isDisabled?: boolean;
}

export interface AutocompleteOwnProps {
  variant?: AutocompleteVariants["variant"];
  size?: AutocompleteVariants["size"];
  color?: AutocompleteVariants["color"];
  labelPlacement?: AutocompleteVariants["labelPlacement"];
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
    text: ClassValue;
    indicator: ClassValue;
    trigger: ClassValue;
    startContent: ClassValue;
    input: ClassValue;
    clearButton: ClassValue;
    chip: Partial<NonNullable<ChipProps["classNames"]>>;
  }>;

  /** Two-way bound selected value. string in single mode, string[] in multiple mode. */
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  /** Allow selecting multiple values. value becomes string[]. @default false */
  multiple?: boolean;
  /**
   * Controls how chips overflow in multiple mode.
   * Simplification vs. the Vue port: only `wrap` is implemented (chips wrap
   * onto new lines). `collapse` (fixed height + "+N more" badge, which needs
   * a ResizeObserver-driven reflow measurement in the Vue source) is not
   * ported — `wrap` is used for both settings.
   */
  multipleOverflow?: "wrap" | "collapse";
  onOpenChange?: (open: boolean) => void;
  /** Static items list — used when no loadItems is provided. */
  items?: AutocompleteItemData[];
  /**
   * Async data source: called on every query change. Lazy by default — first
   * called when the dropdown opens or the user types, unless a value is
   * pre-selected (so its label can resolve) or `loadOnMount` is set.
   */
  loadItems?: (query: string) => Promise<AutocompleteItemData[]>;
  /**
   * Call `loadItems` as soon as the component mounts. By default it is called
   * lazily — when the dropdown first opens or the user types — unless a value
   * is already selected. @default false
   */
  loadOnMount?: boolean;
  /** Debounce delay for loadItems calls (ms). 0 = no debounce. */
  debounceMs?: number;
  /** Fired when the user creates a new value via the create-item row. */
  onCreate?: (value: string) => void;
  /**
   * Enables the built-in "Create "term"" row when the typed term has no exact
   * match (default chrome only — custom chrome adds <AutocompleteCreateItem>
   * itself). Selecting it sets the typed text as the value and fires `onCreate`.
   */
  creatable?: boolean;
  /** Label for the `creatable` item. Defaults to `Create "<term>"`. */
  createLabel?: string | ((term: string) => string);
  startContent?: ReactNode;
  renderItem?: (item: AutocompleteItemData) => ReactNode;
  children?: ReactNode;
}

export type AutocompleteProps = AutocompleteOwnProps;

export function Autocomplete({
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
  multipleOverflow = "wrap",
  onOpenChange,
  items = [],
  loadItems,
  loadOnMount = false,
  debounceMs = 200,
  onCreate,
  creatable = false,
  createLabel,
  startContent,
  renderItem,
  children,
}: AutocompleteProps) {
  const generatedId = useId();
  const inputId = generatedId;
  const descriptionId = `${inputId}-description`;
  const errorMessageId = `${inputId}-error`;

  const hasLabel = !!label;
  const showOutsideLabel = hasLabel && labelPlacement !== "inside";
  const showError = isInvalid && !!errorMessage;
  const showDescription = !showError && !!description;
  const hasHelper = showError || showDescription;
  const ariaDescribedBy = showError ? errorMessageId : showDescription ? descriptionId : undefined;

  const [internalItems, setInternalItems] = useState<AutocompleteItemData[]>(items);
  useEffect(() => {
    if (!loadItems) setInternalItems(items);
     
  }, [items, loadItems]);

  const itemByValue = useMemo(() => new Map(internalItems.map((i) => [i.value, i])), [internalItems]);
  const labelFor = useCallback((v: string) => itemByValue.get(v)?.label ?? itemByValue.get(v)?.textValue ?? v, [itemByValue]);

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string | string[]>(
    defaultValue ?? (multiple ? [] : ""),
  );
  const currentValue = isControlled ? value : internalValue;

  const selectedValues = useMemo(
    () => (multiple ? ((currentValue as string[] | undefined) ?? []) : []),
    [multiple, currentValue],
  );

  const renderedValuesRef = useRef(selectedValues);
  renderedValuesRef.current = selectedValues;

  function commit(next: string | string[]) {
    if (!isControlled) setInternalValue(next);
    onValueChange?.(next);
  }

  const [searchTerm, setSearchTerm] = useState<string>(() =>
    multiple ? "" : labelFor((currentValue as string) ?? ""),
  );

  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hasLoadedRef = useRef(false);
  // The query last handed to the debounced loader. Starts at the initial term
  // so mounting alone never counts as a query change.
  const lastQueryRef = useRef(searchTerm);
  // Set while the input text is rewritten to a resolved label, so that sync
  // does not count as a new query.
  const syncingLabelRef = useRef(false);

  const runLoadItems = useCallback(
    async (query: string) => {
      if (!loadItems) return;
      hasLoadedRef.current = true;
      setIsLoading(true);
      try {
        setInternalItems(await loadItems(query));
      } finally {
        setIsLoading(false);
      }
    },
    [loadItems],
  );

  const hasSelection = multiple ? selectedValues.length > 0 : !!currentValue;

  // Lazy by default: a mounted-but-unused Autocomplete (say, in a hidden tab)
  // should not hit the network. A pre-selected value still loads up front so
  // its label can resolve.
  useEffect(() => {
    if (loadItems && (loadOnMount || hasSelection)) void runLoadItems(searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loadItems) return;
    if (searchTerm === lastQueryRef.current) return;
    lastQueryRef.current = searchTerm;
    if (syncingLabelRef.current) {
      syncingLabelRef.current = false;
      return;
    }
    if (debounceMs === 0) {
      void runLoadItems(searchTerm);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => void runLoadItems(searchTerm), debounceMs);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, debounceMs, loadItems]);

  // Once items arrive, swap a pre-selected value's raw key in the input for
  // its resolved label (single mode — multiple mode renders labels as chips).
  useEffect(() => {
    if (multiple || !currentValue) return;
    const v = currentValue as string;
    const resolved = labelFor(v);
    if (searchTerm === v && resolved !== v) {
      syncingLabelRef.current = true;
      setSearchTerm(resolved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemByValue]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open && loadItems && !hasLoadedRef.current) void runLoadItems(searchTerm);
      onOpenChange?.(open);
    },
    [loadItems, runLoadItems, searchTerm, onOpenChange],
  );

  const handleInputChange = useCallback((text: string) => {
    setSearchTerm(text);
  }, []);

  const handleSingleSelectionChange = useCallback(
    (key: Key | null) => {
      // The create row performs its own commit via onCreateValue.
      if (key === CREATE_ITEM_ID) return;
      const next = key == null ? "" : String(key);
      commit(next);
      setSearchTerm(labelFor(next));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [labelFor],
  );

  const handleMultiSelectionChange = useCallback(
    (keys: Key[]) => {
      if (keys.includes(CREATE_ITEM_ID)) return;
      const next = keys.map((k) => String(k));
      // react-stately re-emits its current (rendered) value when the menu
      // closes after an item action. That is a resync, not a change — and
      // right after a create it is stale, so committing it would drop the
      // value the create row just added.
      const rendered = renderedValuesRef.current;
      if (next.length === rendered.length && next.every((v, i) => v === rendered[i])) return;
      commit(next);
      setSearchTerm("");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const onMultipleSelect = useCallback(
    (v: string) => {
      const idx = selectedValues.indexOf(v);
      const next = idx === -1 ? [...selectedValues, v] : selectedValues.filter((x) => x !== v);
      commit(next);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedValues],
  );

  const removeValue = useCallback(
    (v: string) => {
      commit(selectedValues.filter((x) => x !== v));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedValues],
  );

  const clearAll = useCallback(() => {
    commit([]);
    setSearchTerm("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isSelected = useCallback((v: string) => selectedValues.includes(v), [selectedValues]);

  const selectedLabels = useMemo(() => selectedValues.map((v) => ({ value: v, label: labelFor(v) || v })), [selectedValues, labelFor]);

  const isFilled = multiple ? selectedValues.length > 0 || !!searchTerm : !!searchTerm;

  const hasExactMatch = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return false;
    return internalItems.some((i) => (i.label ?? i.textValue ?? i.value).toLowerCase() === term);
  }, [searchTerm, internalItems]);

  const handleCreate = useCallback(
    (term: string) => {
      const trimmed = term.trim();
      if (!trimmed) return;
      if (multiple) {
        if (!selectedValues.includes(trimmed)) commit([...selectedValues, trimmed]);
        setSearchTerm("");
      } else {
        commit(trimmed);
        setSearchTerm(trimmed);
      }
      onCreate?.(trimmed);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [multiple, selectedValues, onCreate],
  );

  const slots = useMemo(
    () =>
      autocompleteVariants({
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
      isLoading,
      isFilled,
      fullWidth,
      hasLabel,
      labelPlacement,
      inputId,
      label,
      ariaDescribedBy,
      slots,
      multiple,
      multipleOverflow,
      selectedValues,
      selectedLabels,
      onMultipleSelect,
      removeValue,
      clearAll,
      isSelected,
      searchTerm,
      hasExactMatch,
      onCreateValue: handleCreate,
    }),
    [
      isDisabled,
      isInvalid,
      isReadOnly,
      isRequired,
      isLoading,
      isFilled,
      fullWidth,
      hasLabel,
      labelPlacement,
      inputId,
      label,
      ariaDescribedBy,
      slots,
      multiple,
      multipleOverflow,
      selectedValues,
      selectedLabels,
      onMultipleSelect,
      removeValue,
      clearAll,
      isSelected,
      searchTerm,
      hasExactMatch,
      handleCreate,
    ],
  );

  const usesCustomChrome = children != null;
  const defaultFilter = useCallback(
    (itemText: string, term: string) => itemText.toLowerCase().includes(term.toLowerCase()),
    [],
  );

  return (
    <AutocompleteProvider value={contextValue}>
      <div className={composeClassName(slots.base(), className, classNames?.base)} data-invalid={dataAttr(isInvalid)} data-disabled={dataAttr(isDisabled)}>
        {showOutsideLabel && (
          <label htmlFor={inputId} className={composeClassName(slots.label(), classNames?.label)} data-slot="label">
            {label}
            {isRequired && <span aria-hidden="true"> *</span>}
          </label>
        )}

        <div className={composeClassName(slots.mainWrapper(), classNames?.mainWrapper)}>
          {multiple ? (
            <RACComboBox
              selectionMode="multiple"
              inputValue={searchTerm}
              onInputChange={handleInputChange}
              value={selectedValues as never}
              onChange={handleMultiSelectionChange as never}
              isDisabled={isDisabled}
              isRequired={isRequired}
              isInvalid={isInvalid}
              name={name}
              onOpenChange={handleOpenChange}
              defaultFilter={defaultFilter}
              allowsEmptyCollection
            >
              {usesCustomChrome ? (
                children
              ) : (
                <>
                  <AutocompleteInput
                    placeholder={placeholder}
                    startContent={startContent}
                    classNames={{
                      trigger: classNames?.trigger,
                      label: classNames?.label,
                      startContent: classNames?.startContent,
                      input: classNames?.input,
                      clearButton: classNames?.clearButton,
                      indicator: classNames?.indicator,
                      chip: classNames?.chip,
                    }}
                  />
                  <AutocompleteContent>
                    {internalItems.map((item) => (
                      <AutocompleteItem
                        key={item.value}
                        value={item.value}
                        isDisabled={item.isDisabled}
                        textValue={item.textValue ?? item.label ?? item.value}
                        classNames={{ item: classNames?.item, text: classNames?.text, indicator: classNames?.indicator }}
                      >
                        {renderItem ? renderItem(item) : (item.label ?? item.textValue ?? item.value)}
                      </AutocompleteItem>
                    ))}
                    {creatable && <AutocompleteCreateItem label={createLabel} className={classNames?.item} />}
                  </AutocompleteContent>
                </>
              )}
            </RACComboBox>
          ) : (
            <RACComboBox
              inputValue={searchTerm}
              onInputChange={handleInputChange}
              selectedKey={(currentValue as string) || null}
              onSelectionChange={handleSingleSelectionChange}
              allowsCustomValue={creatable}
              isDisabled={isDisabled}
              isRequired={isRequired}
              isInvalid={isInvalid}
              name={name}
              onOpenChange={handleOpenChange}
              defaultFilter={defaultFilter}
              allowsEmptyCollection
            >
              {usesCustomChrome ? (
                children
              ) : (
                <>
                  <AutocompleteInput
                    placeholder={placeholder}
                    startContent={startContent}
                    classNames={{
                      trigger: classNames?.trigger,
                      label: classNames?.label,
                      startContent: classNames?.startContent,
                      input: classNames?.input,
                      clearButton: classNames?.clearButton,
                      indicator: classNames?.indicator,
                      chip: classNames?.chip,
                    }}
                  />
                  <AutocompleteContent>
                    {internalItems.map((item) => (
                      <AutocompleteItem
                        key={item.value}
                        value={item.value}
                        isDisabled={item.isDisabled}
                        textValue={item.textValue ?? item.label ?? item.value}
                        classNames={{ item: classNames?.item, text: classNames?.text, indicator: classNames?.indicator }}
                      >
                        {renderItem ? renderItem(item) : (item.label ?? item.textValue ?? item.value)}
                      </AutocompleteItem>
                    ))}
                    {creatable && <AutocompleteCreateItem label={createLabel} className={classNames?.item} />}
                  </AutocompleteContent>
                </>
              )}
            </RACComboBox>
          )}

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
    </AutocompleteProvider>
  );
}
