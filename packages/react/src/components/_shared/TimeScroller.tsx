// packages/react/src/components/_shared/TimeScroller.tsx
//
// Ports @auronui/vue's TimeScroller.vue 1:1 — an infinite-circular scroll
// wheel picker for hour/minute/second/AM-PM, used by DateTimePicker and
// TimePicker. See the Vue source's comments for the REPEAT/recenter algorithm;
// reproduced verbatim here since it's framework-agnostic DOM math.

import { useEffect, useMemo, useRef } from "react";
import type { CalendarDateTime, Time } from "@internationalized/date";
import { dateTimePickerVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";

export interface TimeScrollerProps {
  value: Time | CalendarDateTime;
  onChange: (value: Time | CalendarDateTime) => void;
  granularity?: "minute" | "second";
  hourCycle?: 12 | 24;
  className?: ClassValue;
  classNames?: Partial<{
    scrollerWrap: ClassValue;
    scrollerColumn: ClassValue;
    scrollerItem: ClassValue;
  }>;
}

type Column = { key: string; items: (number | string)[]; loop: boolean };

const HOURS_24 = Array.from({ length: 24 }, (_, i) => i);
const HOURS_12 = [12, ...Array.from({ length: 11 }, (_, i) => i + 1)];
const MINUTES = Array.from({ length: 60 }, (_, i) => i);
const SECONDS = Array.from({ length: 60 }, (_, i) => i);
const AMPM = ["AM", "PM"];

// Three copies is the minimum for a seamless loop: a buffer copy at each end
// plus the middle copy the user actually sits in.
const REPEAT = 3;
const ITEM_H = 40; // 2.5rem at 16px base

function cycleHeight(col: Column): number {
  return col.items.length * ITEM_H;
}

function renderItems(col: Column): (number | string)[] {
  if (!col.loop) return col.items;
  const out: (number | string)[] = [];
  for (let r = 0; r < REPEAT; r++) out.push(...col.items);
  return out;
}

function columnLabel(key: string): string {
  if (key === "hour") return "Hour";
  if (key === "minute") return "Minute";
  if (key === "second") return "Second";
  return "AM/PM";
}

function itemLabel(item: number | string): string {
  if (typeof item === "string") return item;
  return String(item).padStart(2, "0");
}

export function TimeScroller({ value, onChange, granularity = "minute", hourCycle = 24, className, classNames }: TimeScrollerProps) {
  const hourItems = hourCycle === 12 ? HOURS_12 : HOURS_24;

  const columns = useMemo<Column[]>(() => {
    const cols: Column[] = [
      { key: "hour", items: hourItems, loop: true },
      { key: "minute", items: MINUTES, loop: true },
    ];
    if (granularity === "second") cols.push({ key: "second", items: SECONDS, loop: true });
    if (hourCycle === 12) cols.push({ key: "ampm", items: AMPM, loop: false });
    return cols;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hourItems is derived from hourCycle
  }, [granularity, hourCycle]);

  const columnRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    columns.forEach((col, i) => {
      const el = columnRefs.current[i];
      if (el && col.loop) el.scrollTop = cycleHeight(col) * Math.floor(REPEAT / 2);
    });
    // Only seed scroll position once per column-set identity, mirroring onMounted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns.length, granularity, hourCycle]);

  function onColumnScroll(i: number, colEl: HTMLDivElement) {
    const col = columns[i];
    if (!col || !col.loop) return;
    const cycle = cycleHeight(col);
    const total = cycle * REPEAT;
    const recenter = (REPEAT - 2) * cycle;
    if (colEl.scrollTop < cycle) {
      colEl.scrollTop += recenter;
    } else if (colEl.scrollTop >= total - cycle) {
      colEl.scrollTop -= recenter;
    }
  }

  function isSelected(key: string, item: number | string): boolean {
    if (key === "hour") {
      if (hourCycle === 12) {
        const h12 = value.hour % 12 === 0 ? 12 : value.hour % 12;
        return item === h12;
      }
      return item === value.hour;
    }
    if (key === "minute") return item === value.minute;
    if (key === "second") return item === (value.second ?? 0);
    if (key === "ampm") return item === (value.hour >= 12 ? "PM" : "AM");
    return false;
  }

  function onItemClick(key: string, item: number | string) {
    if (key === "hour") {
      let newHour: number;
      if (hourCycle === 12) {
        const isPm = value.hour >= 12;
        const h12 = item as number;
        newHour = h12 === 12 ? (isPm ? 12 : 0) : isPm ? h12 + 12 : h12;
      } else {
        newHour = item as number;
      }
      onChange(value.set({ hour: newHour }));
    } else if (key === "minute") {
      onChange(value.set({ minute: item as number }));
    } else if (key === "second") {
      onChange(value.set({ second: item as number }));
    } else if (key === "ampm") {
      const isPm = item === "PM";
      const currentPm = value.hour >= 12;
      if (isPm !== currentPm) {
        onChange(value.set({ hour: isPm ? value.hour + 12 : value.hour - 12 }));
      }
    }
  }

  const slotFns = dateTimePickerVariants();

  return (
    <div className={composeClassName(slotFns.scrollerWrap(), className, classNames?.scrollerWrap)} data-slot="time-scroller">
      {columns.map((col, i) => (
        <div
          key={col.key}
          ref={(el) => {
            columnRefs.current[i] = el;
          }}
          className={composeClassName(slotFns.scrollerColumn(), classNames?.scrollerColumn)}
          aria-label={columnLabel(col.key)}
          data-slot="scroller-column"
          role="listbox"
          tabIndex={0}
          onScroll={(e) => onColumnScroll(i, e.currentTarget)}
        >
          {renderItems(col).map((item, idx) => (
            <div
              key={idx}
              className={composeClassName(slotFns.scrollerItem(), classNames?.scrollerItem)}
              data-selected={isSelected(col.key, item) ? "true" : undefined}
              aria-selected={isSelected(col.key, item)}
              role="option"
              onClick={() => onItemClick(col.key, item)}
            >
              {itemLabel(item)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
