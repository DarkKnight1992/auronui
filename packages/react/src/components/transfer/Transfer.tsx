import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import { transferVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { SearchField } from "../search-field";
import { ListBox, ListBoxItem, type ListBoxSelectionValue } from "../list-box";

export interface TransferItem {
  value: string;
  label?: string;
  isDisabled?: boolean;
}

/**
 * Attaches native HTML5 drag-and-drop to a ListBoxItem imperatively via ref,
 * bypassing JSX props entirely. Two reasons this can't just be
 * `draggable`/`onDragStart`/`onDragEnd` props on `<ListBoxItem>` directly,
 * unlike Vue's reka-ui ListBoxItem which accepts them that way:
 *
 * 1. react-aria-components' own types deliberately omit drag-and-drop DOM
 *    props (it has its own, much heavier native DnD system instead), and its
 *    internal filterDOMProps() silently strips draggable/onDragStart/onDragEnd
 *    at runtime even if TS were tricked into accepting them.
 * 2. Wrapping <ListBoxItem> in a plain <div draggable> to work around that
 *    breaks ListBox's collection-based rendering — react-aria's
 *    CollectionBuilder walks JSX children expecting ListBoxItem directly, and
 *    an arbitrary wrapper around it causes exactly the same class of bug as
 *    TabIndicator inside TabList did (both come from the same
 *    react-aria collection machinery, which uses useSyncExternalStore
 *    internally): a genuine infinite re-render loop, not just a cosmetic miss.
 */
function useDraggable(
  elementRef: React.RefObject<HTMLElement | null>,
  isDraggable: boolean,
  onDragStart: (ev: globalThis.DragEvent) => void,
  onDragEnd: () => void,
) {
  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;
    el.draggable = isDraggable;
    if (!isDraggable) return;
    el.addEventListener("dragstart", onDragStart);
    el.addEventListener("dragend", onDragEnd);
    return () => {
      el.removeEventListener("dragstart", onDragStart);
      el.removeEventListener("dragend", onDragEnd);
    };
  }, [elementRef, isDraggable, onDragStart, onDragEnd]);
}

function DraggableTransferItem({
  item,
  panel,
  isDisabled,
  isDragging,
  onItemDragStart,
  onItemDragEnd,
}: {
  item: TransferItem;
  panel: TransferPanel;
  isDisabled: boolean;
  isDragging: boolean;
  onItemDragStart: (ev: globalThis.DragEvent, item: TransferItem, from: TransferPanel) => void;
  onItemDragEnd: () => void;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const handleStart = useCallback(
    (ev: globalThis.DragEvent) => onItemDragStart(ev, item, panel),
    [onItemDragStart, item, panel],
  );
  useDraggable(ref, !isDisabled && !item.isDisabled, handleStart, onItemDragEnd);

  return (
    <ListBoxItem
      ref={ref as React.RefObject<HTMLDivElement>}
      value={item.value}
      isDisabled={item.isDisabled}
      className={isDragging ? "transfer__item--dragging" : undefined}
    >
      {item.label ?? item.value}
    </ListBoxItem>
  );
}

export interface TransferOwnProps {
  items: TransferItem[];
  titles?: [string, string];
  isSearchable?: boolean;
  isDisabled?: boolean;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  className?: ClassValue;
  classNames?: Partial<{
    base: ClassValue;
    panel: ClassValue;
    panelHeader: ClassValue;
    panelSearch: ClassValue;
    panelBody: ClassValue;
    controls: ClassValue;
    controlButton: ClassValue;
  }>;
}

type TransferPanel = "source" | "target";

function matchesQuery(item: TransferItem, query: string): boolean {
  if (!query.trim()) return true;
  return (item.label ?? item.value).toLowerCase().includes(query.trim().toLowerCase());
}

/**
 * Transfer — dual-list "move items between two panels" (permission
 * assignment, multi-select-with-two-sides UIs).
 *
 * Composes two `ListBox` (multiple selection) instances, matching
 * Transfer.vue's architecture exactly — the in-panel checkbox each item
 * shows is `ListBoxItem`'s own selected-state indicator, not a bespoke
 * checkbox bolted onto this component.
 *
 * Native HTML5 drag-and-drop is an *additional* way to move a single item —
 * the checkbox+button controls remain the primary, always-present,
 * keyboard-operable path (same reasoning as Vue's Transfer/FileUpload:
 * a drag-only interaction with no equivalent path is an accessibility gap).
 */
export function Transfer({
  items,
  titles,
  isSearchable = false,
  isDisabled = false,
  value: valueProp,
  defaultValue = [],
  onValueChange,
  className,
  classNames,
}: TransferOwnProps) {
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue);
  const value = valueProp !== undefined ? valueProp : internalValue;

  const [sourceChecked, setSourceChecked] = useState<string[]>([]);
  const [targetChecked, setTargetChecked] = useState<string[]>([]);
  const [sourceQuery, setSourceQuery] = useState("");
  const [targetQuery, setTargetQuery] = useState("");

  // Stable callback identities are required here, not just tidiness: ListBox's
  // own internal onSelectionChange useCallback lists its onSelectionChange
  // prop as a dependency, so an inline arrow function recreated on every
  // Transfer render forced a new callback into RAC's controlled ListBox every
  // render too — which combined with setSourceChecked([]) producing a new
  // (but logically identical) empty array reference to trigger a genuine
  // infinite re-render loop ("Maximum update depth exceeded").
  const handleSourceSelectionChange = useCallback((next: ListBoxSelectionValue) => {
    setSourceChecked((next as string[] | undefined) ?? []);
  }, []);
  const handleTargetSelectionChange = useCallback((next: ListBoxSelectionValue) => {
    setTargetChecked((next as string[] | undefined) ?? []);
  }, []);

  const [draggedValue, setDraggedValue] = useState<string | null>(null);
  const [draggedFrom, setDraggedFrom] = useState<TransferPanel | null>(null);
  const [dragOverPanel, setDragOverPanel] = useState<TransferPanel | null>(null);

  const sourceItems = useMemo(() => items.filter((i) => !value.includes(i.value)), [items, value]);
  const targetItems = useMemo(() => items.filter((i) => value.includes(i.value)), [items, value]);

  const filteredSourceItems = useMemo(
    () => sourceItems.filter((i) => matchesQuery(i, sourceQuery)),
    [sourceItems, sourceQuery],
  );
  const filteredTargetItems = useMemo(
    () => targetItems.filter((i) => matchesQuery(i, targetQuery)),
    [targetItems, targetQuery],
  );

  function commit(next: string[]) {
    setInternalValue(next);
    onValueChange?.(next);
  }

  function moveRight() {
    if (!sourceChecked.length) return;
    commit([...value, ...sourceChecked]);
    setSourceChecked([]);
  }

  function moveLeft() {
    if (!targetChecked.length) return;
    const removing = new Set(targetChecked);
    commit(value.filter((v) => !removing.has(v)));
    setTargetChecked([]);
  }

  function moveAllRight() {
    commit([...value, ...sourceItems.filter((i) => !i.isDisabled).map((i) => i.value)]);
    setSourceChecked([]);
  }

  function moveAllLeft() {
    commit(targetItems.filter((i) => i.isDisabled).map((i) => i.value));
    setTargetChecked([]);
  }

  // Native DragEvent (globalThis), not React's synthetic DragEvent — this
  // fires from the imperative addEventListener wiring in useDraggable above,
  // not from a JSX prop. Same dataTransfer/preventDefault API either way.
  const handleDragStart = useCallback(
    (ev: globalThis.DragEvent, item: TransferItem, from: TransferPanel) => {
      if (isDisabled || item.isDisabled) {
        ev.preventDefault();
        return;
      }
      setDraggedValue(item.value);
      setDraggedFrom(from);
      if (ev.dataTransfer) {
        ev.dataTransfer.effectAllowed = "move";
        ev.dataTransfer.setData("text/plain", item.value);
      }
    },
    [isDisabled],
  );

  const handleDragEnd = useCallback(() => {
    setDraggedValue(null);
    setDraggedFrom(null);
    setDragOverPanel(null);
  }, []);

  function handleDragOverPanel(ev: DragEvent, panel: TransferPanel) {
    if (!draggedValue || draggedFrom === panel) return;
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
    setDragOverPanel(panel);
  }

  function handleDropPanel(ev: DragEvent, panel: TransferPanel) {
    ev.preventDefault();
    const dropValue = draggedValue;
    const from = draggedFrom;
    handleDragEnd();
    if (!dropValue || !from || from === panel) return;

    if (from === "source" && panel === "target") {
      commit([...value, dropValue]);
      setSourceChecked((prev) => prev.filter((v) => v !== dropValue));
    } else if (from === "target" && panel === "source") {
      commit(value.filter((v) => v !== dropValue));
      setTargetChecked((prev) => prev.filter((v) => v !== dropValue));
    }
  }

  const slotFns = useMemo(() => transferVariants({ isDisabled }), [isDisabled]);

  function renderPanel(panel: TransferPanel, panelItems: TransferItem[], checked: string[], title: string | undefined) {
    const query = panel === "source" ? sourceQuery : targetQuery;
    const setQuery = panel === "source" ? setSourceQuery : setTargetQuery;
    const handleSelectionChange = panel === "source" ? handleSourceSelectionChange : handleTargetSelectionChange;

    return (
      <div className={composeClassName(slotFns.panel(), classNames?.panel)} data-slot={`transfer-${panel}-panel`}>
        {title && (
          <div
            className={composeClassName(slotFns.panelHeader(), classNames?.panelHeader)}
            data-slot={`transfer-${panel}-header`}
          >
            {title}
          </div>
        )}
        {isSearchable && (
          <div className={composeClassName(slotFns.panelSearch(), classNames?.panelSearch)}>
            <SearchField
              size="sm"
              value={query}
              onChange={(ev) => setQuery(ev.target.value)}
              aria-label={title ? `Search ${title}` : "Search"}
              placeholder="Search…"
            />
          </div>
        )}
        <div
          className={composeClassName(slotFns.panelBody(), classNames?.panelBody, {
            "transfer__panel-body--drag-over": dragOverPanel === panel,
          })}
          data-slot={`transfer-${panel}-body`}
          onDragOver={(ev) => handleDragOverPanel(ev, panel)}
          onDrop={(ev) => handleDropPanel(ev, panel)}
        >
          <ListBox
            value={checked}
            onSelectionChange={handleSelectionChange}
            selectionMode="multiple"
            isDisabled={isDisabled}
            aria-label={title ?? (panel === "source" ? "Available items" : "Selected items")}
          >
            {panelItems.map((item) => (
              <DraggableTransferItem
                key={item.value}
                item={item}
                panel={panel}
                isDisabled={isDisabled}
                isDragging={draggedValue === item.value}
                onItemDragStart={handleDragStart}
                onItemDragEnd={handleDragEnd}
              />
            ))}
          </ListBox>
        </div>
      </div>
    );
  }

  return (
    <div className={composeClassName(slotFns.base(), className, classNames?.base)} data-slot="transfer">
      {renderPanel("source", filteredSourceItems, sourceChecked, titles?.[0])}

      <div className={composeClassName(slotFns.controls(), classNames?.controls)} data-slot="transfer-controls">
        <button
          type="button"
          className={composeClassName(slotFns.controlButton(), classNames?.controlButton)}
          data-slot="transfer-move-right"
          aria-label="Move selected to the right panel"
          disabled={isDisabled || sourceChecked.length === 0}
          onClick={moveRight}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
        <button
          type="button"
          className={composeClassName(slotFns.controlButton(), classNames?.controlButton)}
          data-slot="transfer-move-all-right"
          aria-label="Move all to the right panel"
          disabled={isDisabled || sourceItems.length === 0}
          onClick={moveAllRight}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m6 17 5-5-5-5M13 17l5-5-5-5" />
          </svg>
        </button>
        <button
          type="button"
          className={composeClassName(slotFns.controlButton(), classNames?.controlButton)}
          data-slot="transfer-move-all-left"
          aria-label="Move all to the left panel"
          disabled={isDisabled || targetItems.length === 0}
          onClick={moveAllLeft}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m18 17-5-5 5-5M11 17l-5-5 5-5" />
          </svg>
        </button>
        <button
          type="button"
          className={composeClassName(slotFns.controlButton(), classNames?.controlButton)}
          data-slot="transfer-move-left"
          aria-label="Move selected to the left panel"
          disabled={isDisabled || targetChecked.length === 0}
          onClick={moveLeft}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5m6-6-6 6 6 6" />
          </svg>
        </button>
      </div>

      {renderPanel("target", filteredTargetItems, targetChecked, titles?.[1])}
    </div>
  );
}
