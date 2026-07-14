import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { modalVariants, commandPaletteVariants } from "@auronui/styles";
import { composeClassName, dataAttr, type ClassValue } from "../../utils";
import { SearchField } from "../search-field";

export interface CommandPaletteItemData {
  value: string;
  label: string;
  icon?: string;
  shortcut?: string;
  group?: string;
  isDisabled?: boolean;
  onSelect?: () => void;
}

export interface CommandPaletteOwnProps {
  items?: CommandPaletteItemData[];
  placeholder?: string;
  /** Global keyboard shortcut that toggles the palette, e.g. `'mod+k'`. `mod` resolves to Cmd on Mac, Ctrl elsewhere. */
  shortcut?: string;
  emptyMessage?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (item: CommandPaletteItemData) => void;
  className?: ClassValue;
  classNames?: Partial<{
    content: ClassValue;
    search: ClassValue;
    list: ClassValue;
    item: ClassValue;
    itemIcon: ClassValue;
    itemLabel: ClassValue;
    itemShortcut: ClassValue;
    empty: ClassValue;
  }>;
}

interface CommandPaletteGroup {
  group: string | undefined;
  items: CommandPaletteItemData[];
}

function matches(item: CommandPaletteItemData, q: string): boolean {
  if (!q.trim()) return true;
  return item.label.toLowerCase().includes(q.trim().toLowerCase());
}

function parseShortcut(shortcut: string): { needsMod: boolean; key: string } {
  const parts = shortcut.toLowerCase().split("+").map((p) => p.trim());
  const key = parts[parts.length - 1] ?? "k";
  const needsMod = parts.includes("mod");
  return { needsMod, key };
}

/**
 * CommandPalette — global Cmd/Ctrl+K search-and-action overlay (Linear/
 * Vercel/Notion/VS Code pattern).
 *
 * Ported from Vue's CommandPalette, which composes the shared `Modal` +
 * `ListBox`. Neither exists in React yet, so this is a self-contained
 * overlay (portal + backdrop + focus trap) with its own local, uncontrolled
 * filtered list — deliberately avoiding the trap the Vue version had to work
 * around (reka-ui's `ListboxRoot` stealing DOM focus from the search input
 * whenever a *controlled* selection value changed on every keystroke).
 * Here, Up/Down/Enter only ever update a local `activeIndex` — the search
 * input keeps focus for the palette's entire lifetime by construction, no
 * bridging trick required.
 */
export function CommandPalette({
  items = [],
  placeholder = "Type a command or search…",
  shortcut = "mod+k",
  emptyMessage = "No results found.",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onSelect,
  className,
  classNames,
}: CommandPaletteOwnProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = openProp !== undefined ? openProp : internalOpen;

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const searchRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  function setOpen(next: boolean) {
    setInternalOpen(next);
    onOpenChange?.(next);
  }

  const filteredItems = useMemo(() => items.filter((i) => matches(i, query)), [items, query]);

  const groupedItems = useMemo<CommandPaletteGroup[]>(() => {
    const groups = new Map<string | undefined, CommandPaletteItemData[]>();
    for (const item of filteredItems) {
      const key = item.group;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(item);
    }
    return Array.from(groups.entries()).map(([group, groupItems]) => ({ group, items: groupItems }));
  }, [filteredItems]);

  // Reset the active row whenever the filtered set changes (new search
  // results), clamping so it never points past the end of the list.
  useEffect(() => {
    setActiveIndex((prev) => (filteredItems.length === 0 ? 0 : Math.min(prev, filteredItems.length - 1)));
  }, [filteredItems]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setActiveIndex(0);
      return;
    }
    const raf = requestAnimationFrame(() => searchRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [isOpen]);

  function handleSelect(item: CommandPaletteItemData) {
    if (item.isDisabled) return;
    item.onSelect?.();
    onSelect?.(item);
    setOpen(false);
  }

  function moveActive(delta: number) {
    if (!filteredItems.length) return;
    setActiveIndex((prev) => Math.max(0, Math.min(filteredItems.length - 1, prev + delta)));
  }

  function handleSearchKeydown(ev: ReactKeyboardEvent<HTMLInputElement>) {
    if (ev.key === "ArrowDown") {
      ev.preventDefault();
      moveActive(1);
    } else if (ev.key === "ArrowUp") {
      ev.preventDefault();
      moveActive(-1);
    } else if (ev.key === "Enter") {
      ev.preventDefault();
      const item = filteredItems[activeIndex];
      if (item) handleSelect(item);
    } else if (ev.key === "Escape") {
      ev.preventDefault();
      setOpen(false);
    }
  }

  useEffect(() => {
    function handleGlobalKeydown(ev: KeyboardEvent) {
      const { needsMod, key } = parseShortcut(shortcut);
      const modPressed = ev.metaKey || ev.ctrlKey;
      if (needsMod && !modPressed) return;
      if (ev.key.toLowerCase() !== key) return;
      ev.preventDefault();
      setOpen(!isOpen);
    }
    window.addEventListener("keydown", handleGlobalKeydown);
    return () => window.removeEventListener("keydown", handleGlobalKeydown);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- isOpen read via closure intentionally to toggle
  }, [shortcut, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handlePointerDown(ev: PointerEvent) {
      if (contentRef.current && !contentRef.current.contains(ev.target as Node)) setOpen(false);
    }
    // Escape closes regardless of which element currently holds focus — the
    // search input's own onKeyDown handler covers the common case, but focus
    // may not have landed there yet (it's moved via requestAnimationFrame on
    // open), so this is a robust document-level fallback.
    function handleEscape(ev: KeyboardEvent) {
      if (ev.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen || typeof document === "undefined") return null;

  const modalSlots = modalVariants({ size: "lg", variant: "blur" });
  const slotFns = commandPaletteVariants();

  let flatIndex = -1;

  return createPortal(
    <div className={modalSlots.portal()} data-slot="command-palette-portal">
      <div className={modalSlots.backdrop()} data-slot="command-palette-backdrop" aria-hidden="true" />
      <div className={modalSlots.container()} data-slot="command-palette-container">
        <div
          ref={contentRef}
          role="dialog"
          aria-modal="true"
          aria-label="Command Palette"
          className={composeClassName(modalSlots.dialog(), slotFns.content(), className, classNames?.content)}
          data-slot="command-palette-content"
        >
          <div className={composeClassName(slotFns.search(), classNames?.search)} data-slot="command-palette-search">
            <SearchField
              ref={searchRef}
              variant="flat"
              value={query}
              onChange={(ev) => setQuery(ev.target.value)}
              onKeyDown={handleSearchKeydown}
              placeholder={placeholder}
              aria-label="Search commands"
              aria-activedescendant={
                filteredItems[activeIndex] ? `command-palette-item-${filteredItems[activeIndex].value}` : undefined
              }
              role="combobox"
              aria-expanded="true"
              aria-controls="command-palette-listbox"
              autoComplete="off"
            />
          </div>

          {!filteredItems.length ? (
            <div
              className={composeClassName(slotFns.empty(), classNames?.empty)}
              data-slot="command-palette-empty"
              aria-live="polite"
            >
              {emptyMessage}
            </div>
          ) : (
            <div
              id="command-palette-listbox"
              role="listbox"
              aria-label="Commands"
              className={composeClassName(slotFns.list(), classNames?.list)}
              data-slot="command-palette-list"
            >
              {groupedItems.map((group) => (
                <div key={group.group ?? "__ungrouped"} role="group" aria-label={group.group}>
                  {group.group && (
                    <div role="presentation" data-slot="command-palette-group-title">
                      {group.group}
                    </div>
                  )}
                  {group.items.map((item) => {
                    flatIndex += 1;
                    const isActive = flatIndex === activeIndex;
                    return (
                      <div
                        key={item.value}
                        id={`command-palette-item-${item.value}`}
                        role="option"
                        aria-selected={isActive}
                        aria-disabled={item.isDisabled || undefined}
                        data-slot="command-palette-item"
                        data-active={dataAttr(isActive)}
                        className={composeClassName(slotFns.item(), classNames?.item, {
                          "command-palette__item--active": isActive,
                        })}
                        onMouseEnter={() => setActiveIndex(flatIndex)}
                        onClick={() => handleSelect(item)}
                      >
                        {item.icon && (
                          <span
                            className={composeClassName(slotFns.itemIcon(), classNames?.itemIcon)}
                            aria-hidden="true"
                          >
                            {item.icon}
                          </span>
                        )}
                        <span className={composeClassName(slotFns.itemLabel(), classNames?.itemLabel)}>
                          {item.label}
                        </span>
                        {item.shortcut && (
                          <span className={composeClassName(slotFns.itemShortcut(), classNames?.itemShortcut)}>
                            {item.shortcut}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
