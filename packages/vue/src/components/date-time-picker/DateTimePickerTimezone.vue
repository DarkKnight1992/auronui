<!-- packages/vue/src/components/date-time-picker/DateTimePickerTimezone.vue -->
<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useTemplateRef } from 'vue'

const props = defineProps<{
  currentZone: string
  class?: string
}>()

const emit = defineEmits<{
  select: [zone: string]
}>()

// ─── Timezone list ───────────────────────────────────────────────────────

function computeTzLabel(iana: string): string {
  try {
    const parts = iana.split('/')
    const city = (parts[parts.length - 1] ?? iana).replace(/_/g, ' ')
    const fmt = new Intl.DateTimeFormat('en', {
      timeZone: iana,
      timeZoneName: 'shortOffset',
    })
    const offset = fmt.formatToParts(new Date()).find(p => p.type === 'timeZoneName')?.value ?? ''
    return `${city} (${offset})`
  } catch {
    return iana
  }
}

const allZones: string[] = (() => {
  try {
    return (Intl as any).supportedValuesOf('timeZone') as string[]
  } catch {
    return ['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Asia/Tokyo']
  }
})()

// ─── Search ──────────────────────────────────────────────────────────────

const query = ref('')
const searchRef = useTemplateRef<HTMLInputElement>('searchInput')

onMounted(() => nextTick(() => searchRef.value?.focus()))

const labelMap = computed(() =>
  Object.fromEntries(allZones.map(z => [z, computeTzLabel(z)]))
)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return allZones
  const qNorm = q.replace(/\s+/g, '_')
  return allZones.filter(z => {
    if (z.toLowerCase().includes(qNorm)) return true
    const label = (labelMap.value[z] ?? '').toLowerCase()
    return label.includes(q)
  })
})

// ─── Keyboard navigation ─────────────────────────────────────────────────

function onItemKeydown(e: KeyboardEvent) {
  const item = e.currentTarget as HTMLElement
  const list = item.parentElement
  if (!list) return
  const items = Array.from(list.querySelectorAll<HTMLElement>('[role="option"]'))
  const idx = items.indexOf(item)
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    items[(idx + 1) % items.length]?.focus()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    items[(idx - 1 + items.length) % items.length]?.focus()
  }
}
</script>

<template>
  <div
    :class="['date-time-picker__tz-panel', props.class]"
    data-slot="tz-panel"
  >
    <input
      ref="searchInput"
      v-model="query"
      :class="['date-time-picker__tz-search']"
      type="search"
      placeholder="Search timezones…"
      aria-label="Search timezones"
      data-slot="tz-search"
    />
    <div
      :class="['date-time-picker__tz-list']"
      role="listbox"
      aria-label="Timezones"
      data-slot="tz-list"
    >
      <div
        v-for="zone in filtered"
        :key="zone"
        :class="['date-time-picker__tz-item']"
        :data-selected="zone === currentZone ? 'true' : undefined"
        :aria-selected="zone === currentZone"
        role="option"
        tabindex="0"
        data-slot="tz-item"
        @click="emit('select', zone)"
        @keydown.enter.prevent="emit('select', zone)"
        @keydown.space.prevent="emit('select', zone)"
        @keydown="onItemKeydown"
      >
        {{ labelMap[zone] }}
      </div>
    </div>
  </div>
</template>
