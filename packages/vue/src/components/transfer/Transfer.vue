<!--
  Transfer — dual-list "move items between two panels": permission
  assignment, multi-select-with-two-sides UIs (available vs. selected).

  Composes two instances of the existing ListBox (multiple selection
  mode) with move controls (›, ‹, », «) between them. State is derived,
  not duplicated: a single `items` prop + a `modelValue` (keys currently
  in the TARGET panel) — the source panel's contents are computed as
  `items` minus `modelValue`, so the consumer never keeps two lists in
  sync themselves. The in-panel checkbox highlighting (which items are
  about to move) is separate, local, transient state — it resets after
  each move.
-->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { transferVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'
import ListBox from '../list-box/ListBox.vue'
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

const sourceShorthand = computed(() =>
  filteredSourceItems.value.map(i => ({ value: i.value, label: i.label, disabled: i.isDisabled })),
)
const targetShorthand = computed(() =>
  filteredTargetItems.value.map(i => ({ value: i.value, label: i.label, disabled: i.isDisabled })),
)

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
        :class="composeClassName(slotFns.panelBody(), props.classNames?.panelBody)"
        data-slot="transfer-source-body"
      >
        <ListBox
          v-model="sourceChecked"
          selection-mode="multiple"
          :items="sourceShorthand"
          :is-disabled="isDisabled"
          :aria-label="titles?.[0] ?? 'Available items'"
        />
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
        :class="composeClassName(slotFns.panelBody(), props.classNames?.panelBody)"
        data-slot="transfer-target-body"
      >
        <ListBox
          v-model="targetChecked"
          selection-mode="multiple"
          :items="targetShorthand"
          :is-disabled="isDisabled"
          :aria-label="titles?.[1] ?? 'Selected items'"
        />
      </div>
    </div>
  </div>
</template>
