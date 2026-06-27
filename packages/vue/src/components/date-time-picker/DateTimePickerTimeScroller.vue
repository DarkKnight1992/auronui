<!-- packages/vue/src/components/date-time-picker/DateTimePickerTimeScroller.vue -->
<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { CalendarDateTime } from '@internationalized/date'

const props = withDefaults(defineProps<{
  modelValue: CalendarDateTime
  granularity?: 'minute' | 'second'
  hourCycle?: 12 | 24
  class?: string
}>(), {
  granularity: 'minute',
  hourCycle: 24,
  class: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: CalendarDateTime]
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

const columns = computed(() => {
  const cols: Array<{ key: string; items: (number | string)[] }> = [
    { key: 'hour', items: hourItems.value },
    { key: 'minute', items: minutes },
  ]
  if (props.granularity === 'second') cols.push({ key: 'second', items: seconds })
  if (props.hourCycle === 12) cols.push({ key: 'ampm', items: ampm })
  return cols
})

// ─── Current index computation ───────────────────────────────────────────

function currentIndexFor(key: string): number {
  const v = props.modelValue
  if (key === 'hour') {
    if (props.hourCycle === 12) {
      const h12 = v.hour % 12 === 0 ? 12 : v.hour % 12
      return hours12.indexOf(h12)
    }
    return v.hour
  }
  if (key === 'minute') return v.minute
  if (key === 'second') return v.second ?? 0
  if (key === 'ampm') return v.hour >= 12 ? 1 : 0
  return 0
}

// ─── Scroll-to-selected ──────────────────────────────────────────────────

const columnRefs = ref<HTMLElement[]>([])
const focusedColumn = ref<string | null>(null)

const ITEM_H = 40 // 2.5rem at 16px base

function scrollColumnToIndex(colEl: HTMLElement, index: number) {
  colEl.scrollTop = index * ITEM_H
}

function syncScrollPositions() {
  columns.value.forEach((col, i) => {
    const el = columnRefs.value[i]
    if (el) scrollColumnToIndex(el, currentIndexFor(col.key))
  })
}

onMounted(() => nextTick(syncScrollPositions))
watch(() => props.modelValue, () => nextTick(syncScrollPositions))

// ─── Scroll → value update ───────────────────────────────────────────────

function onColumnScroll(key: string, colEl: HTMLElement) {
  const idx = Math.round(colEl.scrollTop / ITEM_H)
  const col = columns.value.find(c => c.key === key)!
  const item = col.items[idx]
  if (item === undefined) return

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

// ─── Keyboard navigation ─────────────────────────────────────────────────

function onKeyDown(e: KeyboardEvent, colEl: HTMLElement) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    colEl.scrollTop += ITEM_H
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    colEl.scrollTop -= ITEM_H
  }
}

// ─── Click-to-select ─────────────────────────────────────────────────────

function onItemClick(colEl: HTMLElement, idx: number) {
  colEl.scrollTo({ top: idx * ITEM_H, behavior: 'smooth' })
}

// ─── Label helpers ───────────────────────────────────────────────────────

function columnLabel(key: string): string {
  if (key === 'hour') return 'Hour'
  if (key === 'minute') return 'Minute'
  if (key === 'second') return 'Second'
  return 'AM/PM'
}

function itemLabel(_key: string, item: number | string): string {
  if (typeof item === 'string') return item
  return String(item).padStart(2, '0')
}

// expose for testing
defineExpose({ columnRefs, columns, currentIndexFor })
</script>

<template>
  <div
    :class="['date-time-picker__scroller-wrap', props.class]"
    data-slot="time-scroller"
  >
    <div
      v-for="(col, i) in columns"
      :key="col.key"
      :ref="(el) => { if (el) columnRefs[i] = el as HTMLElement }"
      class="date-time-picker__scroller-column"
      :aria-label="columnLabel(col.key)"
      data-slot="scroller-column"
      role="listbox"
      tabindex="0"
      :data-focused="col.key === focusedColumn ? 'true' : undefined"
      @focus="focusedColumn = col.key"
      @blur="focusedColumn = null"
      @scroll.passive="onColumnScroll(col.key, ($event.currentTarget as HTMLElement))"
      @keydown="onKeyDown($event, ($event.currentTarget as HTMLElement))"
    >
      <div
        v-for="(item, idx) in col.items"
        :key="idx"
        class="date-time-picker__scroller-item"
        :data-selected="idx === currentIndexFor(col.key) ? 'true' : undefined"
        :aria-selected="idx === currentIndexFor(col.key)"
        role="option"
        @click="onItemClick(columnRefs[i]!, idx)"
      >
        {{ itemLabel(col.key, item) }}
      </div>
    </div>
  </div>
</template>
