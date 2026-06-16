<script setup lang="ts">
import { ref, computed, nextTick, useTemplateRef, onMounted, watch } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import Chip from '../chip/Chip.vue'

const props = defineProps<{
  values: string[]
  getLabel: (value: string) => string
  removeValue: (value: string) => void
}>()

const containerEl = useTemplateRef<HTMLElement>('container')
const visibleCount = ref(props.values.length)
const overflowCount = computed(() => Math.max(0, props.values.length - visibleCount.value))

// Prevents re-entrant reflows while we are in the async measurement phase.
let measuring = false

async function reflow() {
  if (measuring) return
  measuring = true

  try {
    const el = containerEl.value
    if (!el) return

    // Phase 1: show all chips to measure their natural widths
    visibleCount.value = props.values.length
    await nextTick()

    const chips = [...el.querySelectorAll<HTMLElement>('[data-chip-item]')]
    if (!chips.length) return

    const containerW = el.offsetWidth
    if (!containerW) return

    // BADGE_W = estimated chip width (68px) + CSS gap before it (4px).
    const BADGE_W = 76

    let usedW = 0
    let n = 0

    for (let i = 0; i < chips.length; i++) {
      const gap = i > 0 ? 4 : 0
      const chipW = chips[i].offsetWidth
      const isLast = i === chips.length - 1
      const budget = isLast ? containerW : containerW - BADGE_W

      if (usedW + gap + chipW > budget) break
      usedW += gap + chipW
      n++
    }

    visibleCount.value = Math.max(1, n)
  } finally {
    measuring = false
  }
}

onMounted(reflow)
useResizeObserver(containerEl, reflow)
watch(
  () => props.values.join('\x00'),
  () => reflow(),
  { flush: 'post' },
)
</script>

<template>
  <div
    ref="container"
    style="display: flex; flex-wrap: nowrap; align-items: center; gap: 4px; overflow: hidden; flex: 1; min-width: 0;"
  >
    <Chip
      v-for="(val, i) in values"
      :key="val"
      data-chip-item
      size="sm"
      is-closable
      :style="i >= visibleCount ? 'display: none' : undefined"
      @close.stop="removeValue(val)"
    >
      {{ getLabel(val) }}
    </Chip>
    <Chip
      v-if="overflowCount > 0"
      size="sm"
      variant="flat"
      color="default"
    >
      +{{ overflowCount }} more
    </Chip>
  </div>
</template>
