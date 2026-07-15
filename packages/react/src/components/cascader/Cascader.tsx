import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { cascaderVariants, type CascaderVariants } from "@auronui/styles";
import { composeClassName, dataAttr, type ClassValue } from "../../utils";
import { useFormField } from "../../hooks";

export interface CascaderOwnProps<T> {
  items: T[];
  getKey: (item: T) => string;
  getChildren?: (item: T) => T[] | undefined;
  getLabel?: (item: T) => string;
  placeholder?: string;
  separator?: string;
  variant?: CascaderVariants["variant"];
  color?: CascaderVariants["color"];
  label?: string;
  description?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  className?: ClassValue;
  classNames?: Partial<{
    base: ClassValue;
    label: ClassValue;
    trigger: ClassValue;
    panel: ClassValue;
    column: ClassValue;
    item: ClassValue;
    helperWrapper: ClassValue;
    description: ClassValue;
    errorMessage: ClassValue;
  }>;
}

/**
 * Cascader — chained/hierarchical linked select (region -> city -> district).
 * Choosing a value at level N reveals/filters the options at level N+1.
 *
 * Ported from Vue's Cascader, which is built on the shared `Popover` +
 * plain buttons per column. A React `Popover` doesn't exist in this package
 * yet, so this component implements its own minimal absolutely-positioned
 * panel (outside-click + Escape to close) directly against `cascaderVariants`
 * — swap the inline panel for a shared `Popover` primitive once one lands,
 * the trigger/panel/column/item class contract is already aligned for that.
 */
export function Cascader<T extends object>({
  items,
  getKey,
  getChildren = (item: T) => (item as { children?: T[] }).children,
  getLabel,
  placeholder = "Select…",
  separator = " / ",
  variant = "flat",
  color = "default",
  label,
  description,
  errorMessage,
  isInvalid = false,
  isDisabled = false,
  isRequired = false,
  value: valueProp,
  defaultValue = [],
  onValueChange,
  className,
  classNames,
}: CascaderOwnProps<T>) {
  const generatedId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue);
  const value = valueProp !== undefined ? valueProp : internalValue;

  const rootRef = useRef<HTMLDivElement>(null);
  const columnRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const { descriptionId, errorMessageId, showError, showDescription, hasHelper, ariaDescribedBy, hasLabel } =
    useFormField({
      fieldId: generatedId,
      label,
      description,
      errorMessage,
      isInvalid,
      isDisabled,
      isReadOnly: false,
      isRequired,
      labelPlacement: "outside",
    });

  const labelOf = useCallback(
    (item: T) => (getLabel ? getLabel(item) : String((item as { label?: string }).label ?? getKey(item))),
    [getLabel, getKey],
  );

  const childrenOf = useCallback((item: T) => getChildren(item), [getChildren]);

  const path = useMemo<T[]>(() => {
    const result: T[] = [];
    let level: T[] | undefined = items;
    for (const key of value) {
      const match = level?.find((i) => getKey(i) === key);
      if (!match) break;
      result.push(match);
      level = childrenOf(match);
    }
    return result;
  }, [value, items, getKey, childrenOf]);

  const columns = useMemo<T[][]>(() => {
    const cols: T[][] = [items];
    for (const item of path) {
      const kids = childrenOf(item);
      if (!kids || !kids.length) break;
      cols.push(kids);
    }
    return cols;
  }, [items, path, childrenOf]);

  const displayLabel = path.length ? path.map(labelOf).join(separator) : "";

  function isActive(item: T, colIndex: number): boolean {
    const selected = path[colIndex];
    return selected !== undefined && getKey(item) === getKey(selected);
  }

  function focusFirstIn(colIndex: number) {
    const col = columnRefs.current[colIndex];
    const first = col?.querySelector<HTMLElement>('[data-slot="cascader-item"]');
    first?.focus();
  }

  function selectAt(colIndex: number, item: T) {
    if (isDisabled) return;
    const newPath = [...path.slice(0, colIndex), item];
    const newKeys = newPath.map(getKey);
    setInternalValue(newKeys);
    onValueChange?.(newKeys);

    const kids = childrenOf(item);
    if (!kids || !kids.length) {
      setIsOpen(false);
    } else {
      requestAnimationFrame(() => focusFirstIn(colIndex + 1));
    }
  }

  function handleColumnKeydown(ev: ReactKeyboardEvent<HTMLButtonElement>, colIndex: number, item: T) {
    if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
      ev.preventDefault();
      const col = columnRefs.current[colIndex];
      if (!col) return;
      const buttons = Array.from(col.querySelectorAll<HTMLElement>('[data-slot="cascader-item"]'));
      const currentIndex = buttons.indexOf(ev.target as HTMLElement);
      const nextIndex =
        ev.key === "ArrowDown" ? Math.min(currentIndex + 1, buttons.length - 1) : Math.max(currentIndex - 1, 0);
      buttons[nextIndex]?.focus();
      return;
    }
    if (ev.key === "ArrowRight") {
      const kids = childrenOf(item);
      if (kids && kids.length) {
        ev.preventDefault();
        selectAt(colIndex, item);
      }
      return;
    }
    if (ev.key === "ArrowLeft") {
      if (colIndex > 0) {
        ev.preventDefault();
        const prevCol = columnRefs.current[colIndex - 1];
        const activeButton = prevCol?.querySelector<HTMLElement>('[data-active="true"]');
        (activeButton ?? prevCol?.querySelector<HTMLElement>('[data-slot="cascader-item"]'))?.focus();
      }
      return;
    }
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      selectAt(colIndex, item);
    }
    if (ev.key === "Escape") {
      setIsOpen(false);
    }
  }

  useEffect(() => {
    if (!isOpen) return;
    function handlePointerDown(ev: PointerEvent) {
      if (!rootRef.current?.contains(ev.target as Node)) setIsOpen(false);
    }
    function handleKeydown(ev: globalThis.KeyboardEvent) {
      if (ev.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [isOpen]);

  const slotFns = useMemo(
    () => cascaderVariants({ variant, color, isInvalid, isDisabled }),
    [variant, color, isInvalid, isDisabled],
  );

  return (
    <div
      ref={rootRef}
      className={composeClassName(slotFns.base(), className, classNames?.base)}
      data-slot="cascader-root"
      data-invalid={dataAttr(isInvalid)}
      data-disabled={dataAttr(isDisabled)}
      data-required={dataAttr(isRequired)}
    >
      {hasLabel && (
        <label htmlFor={generatedId} className={composeClassName(slotFns.label(), classNames?.label)}>
          {label}
          {isRequired && <span aria-hidden="true"> *</span>}
        </label>
      )}

      <div style={{ position: "relative" }}>
        <button
          id={generatedId}
          type="button"
          className={composeClassName(slotFns.trigger(), classNames?.trigger)}
          data-slot="cascader-trigger"
          disabled={isDisabled}
          aria-haspopup="true"
          aria-expanded={isOpen}
          aria-invalid={isInvalid || undefined}
          aria-describedby={ariaDescribedBy}
          data-disabled={dataAttr(isDisabled)}
          onClick={() => !isDisabled && setIsOpen((open) => !open)}
        >
          <span
            className={composeClassName(slotFns.triggerValue(), classNames?.trigger)}
            data-slot="cascader-trigger-value"
            data-placeholder={dataAttr(!path.length)}
          >
            {displayLabel || placeholder}
          </span>
          <span className={slotFns.triggerIcon()} aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </button>

        {isOpen && (
          <div
            className={composeClassName(slotFns.panel(), classNames?.panel)}
            role="group"
            aria-label={label ?? "Cascader options"}
            style={{ position: "absolute", top: "100%", left: 0, zIndex: 50, marginTop: 4 }}
          >
            {columns.map((column, colIndex) => (
              <div
                key={colIndex}
                ref={(el) => {
                  columnRefs.current[colIndex] = el;
                }}
                className={composeClassName(slotFns.column(), classNames?.column)}
                data-slot="cascader-column"
                role="group"
              >
                {column.map((item) => (
                  <button
                    key={getKey(item)}
                    type="button"
                    className={composeClassName(slotFns.item(), classNames?.item)}
                    data-slot="cascader-item"
                    data-active={dataAttr(isActive(item, colIndex))}
                    onClick={() => selectAt(colIndex, item)}
                    onKeyDown={(ev) => handleColumnKeydown(ev, colIndex, item)}
                  >
                    <span>{labelOf(item)}</span>
                    {(childrenOf(item)?.length ?? 0) > 0 && (
                      <span className={slotFns.itemIcon()} aria-hidden="true" data-slot="cascader-item-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {hasHelper && (
        <div className={composeClassName(slotFns.helperWrapper(), classNames?.helperWrapper)}>
          {showError ? (
            <div id={errorMessageId} className={composeClassName(slotFns.errorMessage(), classNames?.errorMessage)}>
              {errorMessage}
            </div>
          ) : showDescription ? (
            <div id={descriptionId} className={composeClassName(slotFns.description(), classNames?.description)}>
              {description}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
