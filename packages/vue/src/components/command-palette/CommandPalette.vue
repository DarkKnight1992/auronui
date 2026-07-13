<!--
  CommandPalette — global Cmd/Ctrl+K search-and-action overlay (the
  Linear/Vercel/Notion/VS Code pattern): a fuzzy-searchable, keyboard-
  navigable list of commands, opened from anywhere via a keyboard
  shortcut, not just a visible trigger element.

  Composes the existing Modal (backdrop, focus trap, Escape-to-close —
  all already correct) with the existing ListBox/ListBoxSection/
  ListBoxItem family for the filtered, keyboard-navigable list — not
  ComboBox, which wraps Reka's Combobox primitive built for an anchor-
  positioned dropdown (via Popper), the wrong positioning model for a
  centered full-overlay palette. ListBox has no anchor/trigger baggage,
  so it composes cleanly inside a Modal.

  Global shortcut registration follows useLocationPath's dependency-free,
  SSR-safe pattern: a single `window.addEventListener('keydown', ...)`
  registered in onMounted, guarded and cleaned up like every other
  window-level listener in this library.
-->
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import { VisuallyHidden } from 'reka-ui'
import { commandPaletteVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'
import Modal from '../modal/Modal.vue'
import ModalContent from '../modal/ModalContent.vue'
import ModalTitle from '../modal/ModalTitle.vue'
import ModalDescription from '../modal/ModalDescription.vue'
import SearchField from '../search-field/SearchField.vue'
import ListBox from '../list-box/ListBox.vue'
import ListBoxSection from '../list-box/ListBoxSection.vue'
import ListBoxItem from '../list-box/ListBoxItem.vue'
import EmptyState from '../empty-state/EmptyState.vue'

export interface CommandPaletteItemData {
  value: string
  label: string
  icon?: string
  shortcut?: string
  group?: string
  isDisabled?: boolean
  onSelect?: () => void
}

const props = withDefaults(
  defineProps<{
    items?: CommandPaletteItemData[]
    placeholder?: string
    /** Global keyboard shortcut that toggles the palette, e.g. 'mod+k'. `mod` resolves to Cmd on Mac, Ctrl elsewhere. */
    shortcut?: string
    emptyMessage?: string
    class?: ClassValue
    classNames?: Partial<{
      content: ClassValue
      search: ClassValue
      list: ClassValue
      item: ClassValue
      itemIcon: ClassValue
      itemLabel: ClassValue
      itemShortcut: ClassValue
      empty: ClassValue
    }>
  }>(),
  {
    items: undefined,
    placeholder: 'Type a command or search…',
    shortcut: 'mod+k',
    emptyMessage: 'No results found.',
    class: undefined,
    classNames: undefined,
  },
)

const emit = defineEmits<{
  select: [item: CommandPaletteItemData]
}>()

const isOpen = defineModel<boolean>('open', { default: false })
const query = ref('')

function matches(item: CommandPaletteItemData, q: string): boolean {
  if (!q.trim()) return true
  return item.label.toLowerCase().includes(q.trim().toLowerCase())
}

const filteredItems = computed(() => (props.items ?? []).filter(i => matches(i, query.value)))

const groupedItems = computed(() => {
  const groups = new Map<string | undefined, CommandPaletteItemData[]>()
  for (const item of filteredItems.value) {
    const key = item.group
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(item)
  }
  return Array.from(groups.entries()).map(([group, groupItems]) => ({ group, items: groupItems }))
})

function handleSelect(value: string) {
  const item = filteredItems.value.find(i => i.value === value)
  if (!item) return
  item.onSelect?.()
  emit('select', item)
  isOpen.value = false
}

// ListBox's own keyboard nav (arrow keys, Enter) only works once a listbox
// item itself holds DOM focus — but the search input keeps focus the whole
// time in a command palette (the user shouldn't have to Tab away to
// navigate). So Up/Down/Enter pressed in the search input are bridged here
// to a virtual "active" item.
//
// Deliberately NOT fed through ListBox's real :model-value prop: reka-ui's
// ListboxRoot watches modelValue and focuses the matching item as a side
// effect (so a real selection scrolls it into view) — which would steal
// DOM focus away from the search input on every activeValue change,
// including ones caused by typing (each keystroke re-filters the list,
// changing activeValue) — silently eating every keystroke after the
// first, since focus would already have left the input by the time the
// next character arrives. Instead, the "active" row is styled directly
// via a plain class comparison in the template — ListBox stays fully
// uncontrolled, only ever consulted for its @update:model-value click/
// Enter-on-a-focused-item notification.
const flatItems = computed(() => groupedItems.value.flatMap(g => g.items))
const activeValue = ref<string | undefined>(undefined)

watch(flatItems, (items) => {
  if (!items.some(i => i.value === activeValue.value)) {
    activeValue.value = items[0]?.value
  }
}, { immediate: true })

function moveActive(delta: number) {
  const items = flatItems.value
  if (!items.length) return
  const currentIndex = items.findIndex(i => i.value === activeValue.value)
  const nextIndex = currentIndex === -1
    ? 0
    : Math.max(0, Math.min(items.length - 1, currentIndex + delta))
  activeValue.value = items[nextIndex]?.value
}

function handleSearchKeydown(ev: KeyboardEvent) {
  if (ev.key === 'ArrowDown') {
    ev.preventDefault()
    moveActive(1)
  } else if (ev.key === 'ArrowUp') {
    ev.preventDefault()
    moveActive(-1)
  } else if (ev.key === 'Enter') {
    ev.preventDefault()
    if (activeValue.value) handleSelect(activeValue.value)
  }
}

watch(isOpen, (open) => {
  if (!open) query.value = ''
})

function parseShortcut(shortcut: string): { needsMod: boolean, key: string } {
  const parts = shortcut.toLowerCase().split('+').map(p => p.trim())
  const key = parts[parts.length - 1] ?? 'k'
  const needsMod = parts.includes('mod')
  return { needsMod, key }
}

function handleGlobalKeydown(ev: KeyboardEvent) {
  const { needsMod, key } = parseShortcut(props.shortcut)
  const modPressed = ev.metaKey || ev.ctrlKey
  if (needsMod && !modPressed) return
  if (ev.key.toLowerCase() !== key) return
  ev.preventDefault()
  isOpen.value = !isOpen.value
}

onMounted(() => {
  if (typeof window === 'undefined') return
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  if (typeof window === 'undefined') return
  window.removeEventListener('keydown', handleGlobalKeydown)
})

// reka-ui's Dialog focus trap auto-focuses the first focusable element
// inside the content — which is the first ListboxItem, not the search
// input — so a user opening the palette can't just start typing. Redirect
// the initial focus to the search input instead, matching every reference
// command-palette implementation.
const contentEl = useTemplateRef<HTMLElement>('contentEl')
function focusSearchInput() {
  contentEl.value?.querySelector<HTMLInputElement>('input[type="search"]')?.focus()
}
function handleOpenAutoFocus(ev: Event) {
  ev.preventDefault()
  focusSearchInput()
  // reka-ui's FocusScope dispatches this as a native CustomEvent and checks
  // `defaultPrevented` right after — preventDefault() above should suppress
  // its own focusFirst() call. Also re-assert on the next frame as a robust
  // fallback in case that check doesn't win the race, so the search input
  // reliably ends up focused either way.
  requestAnimationFrame(focusSearchInput)
}

const slotFns = computed(() => commandPaletteVariants())
</script>

<template>
  <Modal
    :open="isOpen"
    size="lg"
    variant="blur"
    placement="top"
    @update:open="isOpen = $event"
  >
    <ModalContent
      :class="composeClassName(slotFns.content(), props.class, props.classNames?.content)"
      @open-auto-focus="handleOpenAutoFocus"
    >
      <!--
        ModalContent's own root is a non-rendering DialogPortal/Teleport, so
        an arbitrary attribute like data-slot (not one of its declared props)
        would silently be dropped rather than land on real DOM — unlike
        `class`, which ModalContent explicitly declares and applies itself.
        This inner div is real DOM and carries the data-slot hook instead.
      -->
      <div
        ref="contentEl"
        data-slot="command-palette-content"
      >
        <VisuallyHidden>
          <ModalTitle>Command Palette</ModalTitle>
          <ModalDescription>Search for a command or action, then select it</ModalDescription>
        </VisuallyHidden>
        <div
          :class="composeClassName(slotFns.search(), props.classNames?.search)"
          data-slot="command-palette-search"
        >
          <SearchField
            v-model="query"
            :placeholder="placeholder"
            variant="flat"
            aria-label="Search commands"
            @keydown="handleSearchKeydown"
          />
        </div>

        <EmptyState
          v-if="!filteredItems.length"
          :class="composeClassName(slotFns.empty(), props.classNames?.empty)"
          data-slot="command-palette-empty"
        >
          {{ emptyMessage }}
        </EmptyState>

        <ListBox
          v-else
          :class="composeClassName(slotFns.list(), props.classNames?.list)"
          data-slot="command-palette-list"
          aria-label="Commands"
          @update:model-value="handleSelect($event as string)"
        >
          <template
            v-for="group in groupedItems"
            :key="group.group ?? '__ungrouped'"
          >
            <ListBoxSection
              v-if="group.group"
              :title="group.group"
            >
              <!--
                Key includes the active flag: reka-ui's Collection-tracked
                ListboxItem didn't reliably re-render its class binding on
                an in-place prop update alone (observed: the previously-
                active row's highlight class could linger after
                activeValue moved on). Folding the flag into the key
                forces Vue to fully re-create the element whenever its
                active state flips, sidestepping that patching gap.
              -->
              <ListBoxItem
                v-for="item in group.items"
                :key="`${item.value}-${item.value === activeValue}`"
                :value="item.value"
                :is-disabled="item.isDisabled"
                :class="[composeClassName(slotFns.item(), props.classNames?.item), { 'command-palette__item--active': item.value === activeValue }]"
                data-slot="command-palette-item"
              >
                <span
                  v-if="item.icon"
                  :class="composeClassName(slotFns.itemIcon(), props.classNames?.itemIcon)"
                  aria-hidden="true"
                >{{ item.icon }}</span>
                <span :class="composeClassName(slotFns.itemLabel(), props.classNames?.itemLabel)">{{ item.label }}</span>
                <span
                  v-if="item.shortcut"
                  :class="composeClassName(slotFns.itemShortcut(), props.classNames?.itemShortcut)"
                >{{ item.shortcut }}</span>
              </ListBoxItem>
            </ListBoxSection>
            <template v-else>
              <!--
                Key includes the active flag: reka-ui's Collection-tracked
                ListboxItem didn't reliably re-render its class binding on
                an in-place prop update alone (observed: the previously-
                active row's highlight class could linger after
                activeValue moved on). Folding the flag into the key
                forces Vue to fully re-create the element whenever its
                active state flips, sidestepping that patching gap.
              -->
              <ListBoxItem
                v-for="item in group.items"
                :key="`${item.value}-${item.value === activeValue}`"
                :value="item.value"
                :is-disabled="item.isDisabled"
                :class="[composeClassName(slotFns.item(), props.classNames?.item), { 'command-palette__item--active': item.value === activeValue }]"
                data-slot="command-palette-item"
              >
                <span
                  v-if="item.icon"
                  :class="composeClassName(slotFns.itemIcon(), props.classNames?.itemIcon)"
                  aria-hidden="true"
                >{{ item.icon }}</span>
                <span :class="composeClassName(slotFns.itemLabel(), props.classNames?.itemLabel)">{{ item.label }}</span>
                <span
                  v-if="item.shortcut"
                  :class="composeClassName(slotFns.itemShortcut(), props.classNames?.itemShortcut)"
                >{{ item.shortcut }}</span>
              </ListBoxItem>
            </template>
          </template>
        </ListBox>
      </div>
    </ModalContent>
  </Modal>
</template>
