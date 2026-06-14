<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import { useTemplateRef } from 'vue'
import { TabsList } from 'reka-ui'
import { useResizeObserver, onClickOutside } from '@vueuse/core'
import { composeClassName } from '../../utils/composeClassName'
import { useTabsInject } from './tabs.context'
import Button from '../button/Button.vue'

const props = defineProps<{
  loop?: boolean
  overflow?: 'arrows' | 'dropdown'
  class?: string
}>()

const ctx = useTabsInject()

// ── Arrows mode ─────────────────────────────────────────────────────────────
const scrollWrapperEl = useTemplateRef<HTMLElement>('scrollWrapperEl')
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

function updateScrollButtons() {
  const el = scrollWrapperEl.value
  if (!el) { canScrollLeft.value = false; canScrollRight.value = false; return }
  canScrollLeft.value = el.scrollLeft > 1
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
}

function scrollTabs(dir: 'left' | 'right') {
  const el = scrollWrapperEl.value
  if (!el) return
  el.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' })
  // Poll briefly after smooth scroll starts so button states update
  setTimeout(updateScrollButtons, 150)
  setTimeout(updateScrollButtons, 350)
}

watch(scrollWrapperEl, (el, oldEl) => {
  if (oldEl) oldEl.removeEventListener('scroll', updateScrollButtons)
  if (el) {
    el.addEventListener('scroll', updateScrollButtons, { passive: true })
    nextTick(updateScrollButtons)
  }
}, { immediate: true })

useResizeObserver(scrollWrapperEl, () => nextTick(updateScrollButtons))

// ── Dropdown mode ────────────────────────────────────────────────────────────
interface OverflowTab {
  value: string
  label: string
  disabled: boolean
}

const containerEl = useTemplateRef<HTMLElement>('containerEl')
// Button component ref — use .$el to reach the underlying DOM element for offsetWidth
const moreBtnEl = useTemplateRef<InstanceType<typeof Button>>('moreBtnEl')
const dropdownEl = useTemplateRef<HTMLElement>('dropdownEl')

const hiddenTabs = ref<OverflowTab[]>([])
const dropdownOpen = ref(false)
const hasOverflow = computed(() => hiddenTabs.value.length > 0)
// Pre-measured natural width of the more button (measured once on mount before it's visible)
let moreBtnNaturalWidth = 48

onClickOutside(dropdownEl, () => { dropdownOpen.value = false })

function computeOverflow() {
  if (!containerEl.value) return

  const allTabs = Array.from(
    containerEl.value.querySelectorAll('[data-tab-value]'),
  ) as HTMLElement[]

  // Reveal all tabs first
  allTabs.forEach(t => t.removeAttribute('data-overflow-hidden'))

  // Tabs use w-full and shrink to share the container width, so offsetWidth after
  // a normal render would be containerWidth/n — useless for overflow detection.
  // Force each tab to its natural content width for measurement only (no paint flash:
  // all DOM reads/writes happen synchronously within this JS task before the next frame).
  const listEl = containerEl.value.querySelector('[role="tablist"]') as HTMLElement | null
  if (listEl) {
    listEl.style.overflow = 'visible'
    allTabs.forEach(t => { t.style.flexShrink = '0'; t.style.width = 'auto' })
    void listEl.offsetWidth // force reflow so offsetWidth reads below are accurate
  }

  const containerWidth = containerEl.value.clientWidth
  const tabWidths = allTabs.map(t => t.offsetWidth)
  const totalWidth = tabWidths.reduce((sum, w) => sum + w, 0)

  // Restore layout before any early-return so tabs always look correct
  if (listEl) {
    listEl.style.overflow = ''
    allTabs.forEach(t => { t.style.flexShrink = ''; t.style.width = '' })
  }

  if (totalWidth <= containerWidth) {
    hiddenTabs.value = []
    return
  }

  // More button is in-flow (display:none when no overflow, display:flex when visible).
  // Use the pre-measured natural width so the calculation is accurate on the first run
  // before the button becomes visible.
  const available = containerWidth - moreBtnNaturalWidth

  let accumulated = 0
  const newHidden: OverflowTab[] = []
  const visibleEls: HTMLElement[] = []

  for (let i = 0; i < allTabs.length; i++) {
    const tab = allTabs[i]
    const w = tabWidths[i]
    if (accumulated + w <= available) {
      accumulated += w
      visibleEls.push(tab)
    } else {
      newHidden.push({
        value: tab.getAttribute('data-tab-value') ?? '',
        label: tab.textContent?.trim() ?? '',
        disabled: tab.hasAttribute('data-disabled') || tab.getAttribute('aria-disabled') === 'true',
      })
      tab.setAttribute('data-overflow-hidden', '')
    }
  }

  // If the active tab ended up hidden, swap it with the last visible tab
  const activeValue = ctx.currentValue.value
  if (activeValue) {
    const hiddenActiveIdx = newHidden.findIndex(t => t.value === activeValue)
    if (hiddenActiveIdx !== -1 && visibleEls.length > 0) {
      const displacedEl = visibleEls[visibleEls.length - 1]
      const activeEl = allTabs.find(t => t.getAttribute('data-tab-value') === activeValue)

      if (displacedEl && activeEl) {
        // Swap: make displaced tab hidden, active tab visible
        displacedEl.setAttribute('data-overflow-hidden', '')
        activeEl.removeAttribute('data-overflow-hidden')

        const displaced: OverflowTab = {
          value: displacedEl.getAttribute('data-tab-value') ?? '',
          label: displacedEl.textContent?.trim() ?? '',
          disabled: displacedEl.hasAttribute('data-disabled') || displacedEl.getAttribute('aria-disabled') === 'true',
        }
        newHidden.splice(hiddenActiveIdx, 1)
        newHidden.unshift(displaced)
      }
    }
  }

  hiddenTabs.value = newHidden
}

useResizeObserver(containerEl, () => nextTick(computeOverflow))
onMounted(() => {
  // Pre-measure the more button's natural width before it becomes visible (display:none).
  // Temporarily show it, read offsetWidth, then hide again — happens before first paint.
  const btnEl = (moreBtnEl.value as InstanceType<typeof Button> | null)?.$el as HTMLElement | null
  if (btnEl) {
    btnEl.style.display = 'flex'
    void btnEl.offsetWidth
    moreBtnNaturalWidth = btnEl.offsetWidth
    btnEl.style.display = ''
  }
  nextTick(computeOverflow)
})

// Recompute when the active tab changes so the active tab is always visible
watch(() => ctx.currentValue.value, () => {
  if (props.overflow === 'dropdown') nextTick(computeOverflow)
})

// When overflow state first transitions false→true the more button enters the flex flow,
// narrowing the container. Re-run once so the tab count reflects the reduced available space.
watch(hasOverflow, () => {
  if (props.overflow === 'dropdown') nextTick(computeOverflow)
})

function selectOverflowTab(value: string) {
  ctx.changeTab(value)
  dropdownOpen.value = false
}
</script>

<template>
  <!-- ── Default (no overflow behaviour) ───────────────────────────────────── -->
  <TabsList
    v-if="!props.overflow"
    :loop="props.loop ?? true"
    :class="composeClassName(ctx.slotFns.value.tabList(), props.class)"
  >
    <slot />
  </TabsList>

  <!-- ── Arrows mode ────────────────────────────────────────────────────────── -->
  <div
    v-else-if="props.overflow === 'arrows'"
    class="tabs__list-container tabs__list-container--arrows"
    :class="{ 'has-left': canScrollLeft, 'has-right': canScrollRight }"
  >
    <Button
      variant="secondary"
      size="sm"
      radius="full"
      :is-icon-only="true"
      :class="composeClassName('tabs__arrow tabs__arrow--left', canScrollLeft && 'is-visible')"
      aria-label="Scroll tabs left"
      tabindex="-1"
      @click="scrollTabs('left')"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M9 11L5 7L9 3" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </Button>

    <div ref="scrollWrapperEl" class="tabs__scroll-wrapper">
      <TabsList
        :loop="props.loop ?? true"
        :class="composeClassName(ctx.slotFns.value.tabList(), 'tabs__list--scroll', props.class)"
      >
        <slot />
      </TabsList>
    </div>

    <Button
      variant="secondary"
      size="sm"
      radius="full"
      :is-icon-only="true"
      :class="composeClassName('tabs__arrow tabs__arrow--right', canScrollRight && 'is-visible')"
      aria-label="Scroll tabs right"
      tabindex="-1"
      @click="scrollTabs('right')"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M5 3L9 7L5 11" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </Button>
  </div>

  <!-- ── Dropdown mode ──────────────────────────────────────────────────────── -->
  <div
    v-else-if="props.overflow === 'dropdown'"
    ref="containerEl"
    class="tabs__list-container tabs__list-container--dropdown"
  >
    <TabsList
      :loop="props.loop ?? true"
      :class="composeClassName(ctx.slotFns.value.tabList(), 'tabs__list--clipped', props.class)"
    >
      <slot />
    </TabsList>

    <!-- Always rendered so offsetWidth is measurable; visibility toggled via CSS -->
    <div
      ref="dropdownEl"
      class="tabs__more"
      :class="{ 'tabs__more--visible': hasOverflow }"
    >
      <Button
        ref="moreBtnEl"
        variant="secondary"
        size="sm"
        radius="full"
        class="tabs__more-btn"
        :aria-expanded="dropdownOpen"
        aria-haspopup="menu"
        @click="dropdownOpen = !dropdownOpen"
      >
        +{{ hiddenTabs.length }}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M2 4L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </Button>

      <div v-if="dropdownOpen" class="tabs__overflow-menu" role="menu">
        <Button
          v-for="tab in hiddenTabs"
          :key="tab.value"
          variant="ghost"
          radius="lg"
          class="tabs__overflow-item"
          role="menuitem"
          :disabled="tab.disabled"
          @click="selectOverflowTab(tab.value)"
        >
          {{ tab.label }}
        </Button>
      </div>
    </div>
  </div>
</template>
