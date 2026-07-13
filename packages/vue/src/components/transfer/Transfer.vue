<!--
  Transfer — dual-list "move items between two panels": permission
  assignment, multi-select-with-two-sides UIs (available vs. selected).

  Composes two instances of the existing ListBox (multiple selection
  mode) with move controls (›, ‹, », «) between them, PLUS native HTML5
  drag-and-drop as an additional way to move a single item — dragging a
  row from one panel and dropping it on the other moves it. The button
  controls are not a fallback bolted on after the fact; they're the
  primary, always-present interaction — drag-and-drop is bonus surface
  for mouse users on top of a fully keyboard-operable component (the
  same reasoning as FileUpload's dropzone: a drag-only interaction with
  no equivalent path is an accessibility bug, not a missing nice-to-have).

  State is derived, not duplicated: a single `items` prop + a
  `modelValue` (keys currently in the TARGET panel) — the source panel's
  contents are computed as `items` minus `modelValue`, so the consumer
  never keeps two lists in sync themselves. The in-panel checkbox
  highlighting (which items are about to move via the buttons) is
  separate, local, transient state — it resets after each move.
-->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { transferVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'
import ListBox from '../list-box/ListBox.vue'
import ListBoxItem from '../list-box/ListBoxItem.vue'
import SearchField from '../search-field/SearchField.vue'

export interface TransferItem {
  value: string
  label?: string
  isDisabled?: boolean
}

const props = withDefaults(
  defineProps<{
    items: TransferItem[]
    titles?: [string, string]
    isSearchable?: boolean
    isDisabled?: boolean
    class?: ClassValue
    classNames?: Partial<{
      base: ClassValue
      panel: ClassValue
      panelHeader: ClassValue
      panelSearch: ClassValue
      panelBody: ClassValue
      controls: ClassValue
      controlButton: ClassValue
    }>
  }>(),
  {
    titles: undefined,
    isSearchable: false,
    isDisabled: false,
    class: undefined,
    classNames: undefined,
  },
)

const modelValue = defineModel<string[]>({ default: () => [] })

const sourceChecked = ref<string[]>([])
const targetChecked = ref<string[]>([])
const sourceQuery = ref('')
const targetQuery = ref('')

const sourceItems = computed(() => props.items.filter(i => !modelValue.value.includes(i.value)))
const targetItems = computed(() => props.items.filter(i => modelValue.value.includes(i.value)))

function matchesQuery(item: TransferItem, query: string): boolean {
  if (!query.trim()) return true
  return (item.label ?? item.value).toLowerCase().includes(query.trim().toLowerCase())
}

const filteredSourceItems = computed(() => sourceItems.value.filter(i => matchesQuery(i, sourceQuery.value)))
const filteredTargetItems = computed(() => targetItems.value.filter(i => matchesQuery(i, targetQuery.value)))

function moveRight() {
  if (!sourceChecked.value.length) return
  modelValue.value = [...modelValue.value, ...sourceChecked.value]
  sourceChecked.value = []
}

function moveLeft() {
  if (!targetChecked.value.length) return
  const removing = new Set(targetChecked.value)
  modelValue.value = modelValue.value.filter(v => !removing.has(v))
  targetChecked.value = []
}

function moveAllRight() {
  modelValue.value = [...modelValue.value, ...sourceItems.value.filter(i => !i.isDisabled).map(i => i.value)]
  sourceChecked.value = []
}

function moveAllLeft() {
  const keepDisabled = targetItems.value.filter(i => i.isDisabled).map(i => i.value)
  modelValue.value = keepDisabled
  targetChecked.value = []
}

// Drag-and-drop: moves exactly the one row being dragged, regardless of
// checkbox state — a deliberate v1 scope call, not an oversight. Dragging
// a whole multi-checked selection is a real enhancement some Transfer
// implementations support, but it needs its own affordance (a "N items"
// drag preview, carrying more than one value through dataTransfer) that's
// out of scope for the first pass.
type TransferPanel = 'source' | 'target'
const draggedValue = ref<string | null>(null)
const draggedFrom = ref<TransferPanel | null>(null)
const dragOverPanel = ref<TransferPanel | null>(null)

function handleDragStart(ev: DragEvent, item: TransferItem, from: TransferPanel) {
  if (props.isDisabled || item.isDisabled) {
    ev.preventDefault()
    return
  }
  draggedValue.value = item.value
  draggedFrom.value = from
  if (ev.dataTransfer) {
    ev.dataTransfer.effectAllowed = 'move'
    // Required by some browsers (notably Firefox) for the drag to start at all.
    ev.dataTransfer.setData('text/plain', item.value)
  }
}

function handleDragEnd() {
  draggedValue.value = null
  draggedFrom.value = null
  dragOverPanel.value = null
}

function handleDragOverPanel(ev: DragEvent, panel: TransferPanel) {
  if (!draggedValue.value || draggedFrom.value === panel) return
  ev.preventDefault()
  if (ev.dataTransfer) ev.dataTransfer.dropEffect = 'move'
  dragOverPanel.value = panel
}

function handleDropPanel(ev: DragEvent, panel: TransferPanel) {
  ev.preventDefault()
  const value = draggedValue.value
  const from = draggedFrom.value
  handleDragEnd()
  if (!value || !from || from === panel) return

  if (from === 'source' && panel === 'target') {
    modelValue.value = [...modelValue.value, value]
    sourceChecked.value = sourceChecked.value.filter(v => v !== value)
  } else if (from === 'target' && panel === 'source') {
    modelValue.value = modelValue.value.filter(v => v !== value)
    targetChecked.value = targetChecked.value.filter(v => v !== value)
  }
}

const slotFns = computed(() => transferVariants({ isDisabled: props.isDisabled }))
</script>

<template>
  <div
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    data-slot="transfer"
  >
    <div
      :class="composeClassName(slotFns.panel(), props.classNames?.panel)"
      data-slot="transfer-source-panel"
    >
      <div
        v-if="titles?.[0]"
        :class="composeClassName(slotFns.panelHeader(), props.classNames?.panelHeader)"
        data-slot="transfer-source-header"
      >
        {{ titles[0] }}
      </div>
      <div
        v-if="isSearchable"
        :class="composeClassName(slotFns.panelSearch(), props.classNames?.panelSearch)"
      >
        <SearchField
          v-model="sourceQuery"
          :aria-label="titles?.[0] ? `Search ${titles[0]}` : 'Search'"
          size="sm"
        />
      </div>
      <div
        :class="[composeClassName(slotFns.panelBody(), props.classNames?.panelBody), { 'transfer__panel-body--drag-over': dragOverPanel === 'source' }]"
        data-slot="transfer-source-body"
        @dragover="handleDragOverPanel($event, 'source')"
        @drop="handleDropPanel($event, 'source')"
      >
        <ListBox
          v-model="sourceChecked"
          selection-mode="multiple"
          :is-disabled="isDisabled"
          :aria-label="titles?.[0] ?? 'Available items'"
        >
          <ListBoxItem
            v-for="item in filteredSourceItems"
            :key="item.value"
            :value="item.value"
            :is-disabled="item.isDisabled"
            :draggable="!isDisabled && !item.isDisabled"
            :class="{ 'transfer__item--dragging': draggedValue === item.value }"
            @dragstart="handleDragStart($event, item, 'source')"
            @dragend="handleDragEnd"
          >
            {{ item.label ?? item.value }}
          </ListBoxItem>
        </ListBox>
      </div>
    </div>

    <div
      :class="composeClassName(slotFns.controls(), props.classNames?.controls)"
      data-slot="transfer-controls"
    >
      <button
        type="button"
        :class="composeClassName(slotFns.controlButton(), props.classNames?.controlButton)"
        data-slot="transfer-move-right"
        aria-label="Move selected to the right panel"
        :disabled="isDisabled || sourceChecked.length === 0"
        @click="moveRight"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        ><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </button>
      <button
        type="button"
        :class="composeClassName(slotFns.controlButton(), props.classNames?.controlButton)"
        data-slot="transfer-move-all-right"
        aria-label="Move all to the right panel"
        :disabled="isDisabled || sourceItems.length === 0"
        @click="moveAllRight"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        ><path d="m6 17 5-5-5-5M13 17l5-5-5-5" /></svg>
      </button>
      <button
        type="button"
        :class="composeClassName(slotFns.controlButton(), props.classNames?.controlButton)"
        data-slot="transfer-move-all-left"
        aria-label="Move all to the left panel"
        :disabled="isDisabled || targetItems.length === 0"
        @click="moveAllLeft"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        ><path d="m18 17-5-5 5-5M11 17l-5-5 5-5" /></svg>
      </button>
      <button
        type="button"
        :class="composeClassName(slotFns.controlButton(), props.classNames?.controlButton)"
        data-slot="transfer-move-left"
        aria-label="Move selected to the left panel"
        :disabled="isDisabled || targetChecked.length === 0"
        @click="moveLeft"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        ><path d="M19 12H5m6-6-6 6 6 6" /></svg>
      </button>
    </div>

    <div
      :class="composeClassName(slotFns.panel(), props.classNames?.panel)"
      data-slot="transfer-target-panel"
    >
      <div
        v-if="titles?.[1]"
        :class="composeClassName(slotFns.panelHeader(), props.classNames?.panelHeader)"
        data-slot="transfer-target-header"
      >
        {{ titles[1] }}
      </div>
      <div
        v-if="isSearchable"
        :class="composeClassName(slotFns.panelSearch(), props.classNames?.panelSearch)"
      >
        <SearchField
          v-model="targetQuery"
          :aria-label="titles?.[1] ? `Search ${titles[1]}` : 'Search'"
          size="sm"
        />
      </div>
      <div
        :class="[composeClassName(slotFns.panelBody(), props.classNames?.panelBody), { 'transfer__panel-body--drag-over': dragOverPanel === 'target' }]"
        data-slot="transfer-target-body"
        @dragover="handleDragOverPanel($event, 'target')"
        @drop="handleDropPanel($event, 'target')"
      >
        <ListBox
          v-model="targetChecked"
          selection-mode="multiple"
          :is-disabled="isDisabled"
          :aria-label="titles?.[1] ?? 'Selected items'"
        >
          <ListBoxItem
            v-for="item in filteredTargetItems"
            :key="item.value"
            :value="item.value"
            :is-disabled="item.isDisabled"
            :draggable="!isDisabled && !item.isDisabled"
            :class="{ 'transfer__item--dragging': draggedValue === item.value }"
            @dragstart="handleDragStart($event, item, 'target')"
            @dragend="handleDragEnd"
          >
            {{ item.label ?? item.value }}
          </ListBoxItem>
        </ListBox>
      </div>
    </div>
  </div>
</template>
