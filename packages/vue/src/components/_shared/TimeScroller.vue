<!-- packages/vue/src/components/_shared/TimeScroller.vue -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Time, CalendarDateTime } from '@internationalized/date'
import { dateTimePickerVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  modelValue: Time | CalendarDateTime
  granularity?: 'minute' | 'second'
  hourCycle?: 12 | 24
  class?: string
  /** Per-slot class overrides */
  classNames?: Partial<{
    scrollerWrap: ClassValue
    scrollerColumn: ClassValue
    scrollerItem: ClassValue
  }>
}>(), {
  granularity: 'minute',
  hourCycle: 24,
  class: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: Time | CalendarDateTime]
}>()

// ─── Column data ─────────────────────────────────────────────────────────

const hours24 = Array.from({ length: 24 }, (_, i) => i)
const hours12 = [12, ...Array.from({ length: 11 }, (_, i) => i + 1)] // 12,1..11
const minutes = Array.from({ length: 60 }, (_, i) => i)
const seconds = Array.from({ length: 60 }, (_, i) => i)
const ampm = ['AM', 'PM']

const hourItems = computed(() =>
  props.hourCycle === 12 ? hours12 : hours24,
)

type Column = { key: string; items: (number | string)[]; loop: boolean }

const columns = computed<Column[]>(() => {
  const cols: Column[] = [
    { key: 'hour', items: hourItems.value, loop: true },
    { key: 'minute', items: minutes, loop: true },
  ]
  if (props.granularity === 'second') cols.push({ key: 'second', items: seconds, loop: true })
  // AM/PM is a short, finite column — it does not loop.
  if (props.hourCycle === 12) cols.push({ key: 'ampm', items: ampm, loop: false })
  return cols
})

// ─── Infinite circular scroll ─────────────────────────────────────────────
// Numeric columns repeat their list REPEAT times and start in the middle copy.
// On scroll, whenever the position drifts out of the middle band we jump it
// back by whole cycles — invisible because the content is identical — so the
// wheel can be dragged endlessly in either direction.

// Three copies is the minimum for a seamless loop: a buffer copy at each end
// plus the middle copy the user actually sits in. More copies = needless DOM.
const REPEAT = 3
const ITEM_H = 40 // 2.5rem at 16px base
const columnRefs = ref<HTMLElement[]>([])

function renderItems(col: Column): (number | string)[] {
  if (!col.loop) return col.items
  const out: (number | string)[] = []
  for (let r = 0; r < REPEAT; r++) out.push(...col.items)
  return out
}

function cycleHeight(col: Column): number {
  return col.items.length * ITEM_H
}

// Keep the scroll position inside the inner copies [cycle, total-cycle); when it
// drifts into the first or last buffer copy, jump it by (REPEAT-2) cycles. The
// content is identical, so the jump is invisible and the wheel feels endless.
function onColumnScroll(i: number, colEl: HTMLElement) {
  const col = columns.value[i]
  if (!col.loop) return
  const cycle = cycleHeight(col)
  const total = cycle * REPEAT
  const recenter = (REPEAT - 2) * cycle
  if (colEl.scrollTop < cycle) {
    colEl.scrollTop += recenter
  } else if (colEl.scrollTop >= total - cycle) {
    colEl.scrollTop -= recenter
  }
}

onMounted(() => {
  columns.value.forEach((col, i) => {
    const el = columnRefs.value[i]
    if (el && col.loop) el.scrollTop = cycleHeight(col) * Math.floor(REPEAT / 2)
  })
})

// ─── Selection (tap to select) ─────────────────────────────────────────────
// Selection is by VALUE, so every repeated copy of the chosen number highlights.

function isSelected(key: string, item: number | string): boolean {
  const v = props.modelValue
  if (key === 'hour') {
    if (props.hourCycle === 12) {
      const h12 = v.hour % 12 === 0 ? 12 : v.hour % 12
      return item === h12
    }
    return item === v.hour
  }
  if (key === 'minute') return item === v.minute
  if (key === 'second') return item === (v.second ?? 0)
  if (key === 'ampm') return item === (v.hour >= 12 ? 'PM' : 'AM')
  return false
}

function onItemClick(key: string, item: number | string) {
  const v = props.modelValue
  if (key === 'hour') {
    let newHour: number
    if (props.hourCycle === 12) {
      const isPm = v.hour >= 12
      const h12 = item as number
      newHour = h12 === 12 ? (isPm ? 12 : 0) : isPm ? h12 + 12 : h12
    } else {
      newHour = item as number
    }
    emit('update:modelValue', v.set({ hour: newHour }))
  } else if (key === 'minute') {
    emit('update:modelValue', v.set({ minute: item as number }))
  } else if (key === 'second') {
    emit('update:modelValue', v.set({ second: item as number }))
  } else if (key === 'ampm') {
    const isPm = item === 'PM'
    const currentPm = v.hour >= 12
    if (isPm !== currentPm) {
      emit('update:modelValue', v.set({ hour: isPm ? v.hour + 12 : v.hour - 12 }))
    }
  }
}

// ─── Label helpers ───────────────────────────────────────────────────────

function columnLabel(key: string): string {
  if (key === 'hour') return 'Hour'
  if (key === 'minute') return 'Minute'
  if (key === 'second') return 'Second'
  return 'AM/PM'
}

function itemLabel(item: number | string): string {
  if (typeof item === 'string') return item
  return String(item).padStart(2, '0')
}

const slotFns = dateTimePickerVariants()

// expose for testing
defineExpose({ columnRefs, columns })
</script>

<template>
  <div
    :class="composeClassName(slotFns.scrollerWrap(), props.class, props.classNames?.scrollerWrap)"
    data-slot="time-scroller"
  >
    <div
      v-for="(col, i) in columns"
      :key="col.key"
      :ref="(el) => { if (el) columnRefs[i] = el as HTMLElement }"
      :class="composeClassName(slotFns.scrollerColumn(), props.classNames?.scrollerColumn)"
      :aria-label="columnLabel(col.key)"
      data-slot="scroller-column"
      role="listbox"
      tabindex="0"
      @scroll.passive="onColumnScroll(i, ($event.currentTarget as HTMLElement))"
    >
      <div
        v-for="(item, idx) in renderItems(col)"
        :key="idx"
        :class="composeClassName(slotFns.scrollerItem(), props.classNames?.scrollerItem)"
        :data-selected="isSelected(col.key, item) ? 'true' : undefined"
        :aria-selected="isSelected(col.key, item)"
        role="option"
        @click="onItemClick(col.key, item)"
      >
        {{ itemLabel(item) }}
      </div>
    </div>
  </div>
</template>
