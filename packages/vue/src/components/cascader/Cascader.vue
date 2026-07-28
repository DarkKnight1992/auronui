<!--
  Cascader — chained/hierarchical linked select (region -> city ->
  district). Choosing a value at level N reveals/filters the options at
  level N+1.

  Data shape directly reuses Tree's precedent — a recursive T[] plus a
  getChildren callback — since a cascader's input data IS a tree; the
  difference is purely presentational (cascading columns, one path
  selected, vs. Tree's expand/collapse-many).

  Built on the existing Popover (anchors the cascading-columns panel to
  the trigger button, like Select's trigger+content) with plain buttons
  per column (not ListBox — a cascader column is single-select per level
  and needs Left/Right cross-column keyboard nav, which doesn't map
  cleanly onto ListBox's own roving-focus model).

  ─── Accessibility ──────────────────────────────────────────────────────
  Right arrow moves into a child column, Left arrow moves back to the
  parent column, Up/Down move within a column, Enter/Space selects —
  structurally the same navigation problem as Tree's expand/collapse,
  just rendered as side-by-side columns instead of nested indentation
  (same Left/Right semantics as today's Tree keyboard-parity fix).
-->
<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, nextTick, ref, useId } from 'vue'
import { cascaderVariants, type CascaderVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'
import { useFormField } from '../../composables/useFormField'
import FieldLabel from '../_shared/FieldLabel.vue'
import FormFieldHelper from '../_shared/FormFieldHelper.vue'
import Popover from '../popover/Popover.vue'
import PopoverTrigger from '../popover/PopoverTrigger.vue'
import PopoverContent from '../popover/PopoverContent.vue'

const props = withDefaults(
  defineProps<{
    items: T[]
    getKey: (item: T) => string
    getChildren?: (item: T) => T[] | undefined
    getLabel?: (item: T) => string
    placeholder?: string
    separator?: string
    variant?: CascaderVariants['variant']
    color?: CascaderVariants['color']
    label?: string
    description?: string
    errorMessage?: string
    isInvalid?: boolean
    isDisabled?: boolean
    isRequired?: boolean
    class?: ClassValue
    classNames?: Partial<{
      base: ClassValue
      label: ClassValue
      trigger: ClassValue
      panel: ClassValue
      column: ClassValue
      item: ClassValue
      helperWrapper: ClassValue
      description: ClassValue
      errorMessage: ClassValue
    }>
  }>(),
  {
    getChildren: (item: T) => (item as { children?: T[] }).children,
    getLabel: undefined,
    placeholder: 'Select…',
    separator: ' / ',
    variant: 'flat',
    color: 'default',
    label: undefined,
    description: undefined,
    errorMessage: undefined,
    isInvalid: false,
    isDisabled: false,
    isRequired: false,
    class: undefined,
    classNames: undefined,
  },
)

const modelValue = defineModel<string[]>({ default: () => [] })

const generatedId = useId()
const isOpen = ref(false)
const columnRefs = ref<Record<number, HTMLElement | null>>({})

const {
  descriptionId,
  errorMessageId,
  showError,
  showDescription,
  hasHelper,
  ariaDescribedBy,
  hasLabel,
  rootDataAttrs,
} = useFormField({
  fieldId: () => generatedId,
  label: () => props.label,
  description: () => props.description,
  errorMessage: () => props.errorMessage,
  isInvalid: () => props.isInvalid,
  isDisabled: () => props.isDisabled,
  isReadOnly: () => false,
  isRequired: () => props.isRequired,
  labelPlacement: () => 'outside',
})

function labelOf(item: T): string {
  return props.getLabel ? props.getLabel(item) : (item.label ?? String(props.getKey(item)))
}

function childrenOf(item: T): T[] | undefined {
  return props.getChildren(item)
}

// Path of selected items, one per level, derived from modelValue by
// walking down `items` using the stored keys. Rebuilt whenever
// modelValue or items change so external (controlled) updates work.
const path = computed<T[]>(() => {
  const result: T[] = []
  let level: T[] | undefined = props.items
  for (const key of modelValue.value) {
    const match = level?.find(i => props.getKey(i) === key)
    if (!match) break
    result.push(match)
    level = childrenOf(match)
  }
  return result
})

// One column per level: the root items, then each selected item's
// children, stopping once a level has no children (a leaf was reached).
const columns = computed<T[][]>(() => {
  const cols: T[][] = [props.items]
  let level: T[] | undefined = props.items
  for (const item of path.value) {
    const children = childrenOf(item)
    if (!children || !children.length) break
    cols.push(children)
    level = children
  }
  void level
  return cols
})

const displayLabel = computed(() => {
  if (!path.value.length) return ''
  return path.value.map(labelOf).join(props.separator)
})

function isActive(item: T, colIndex: number): boolean {
  const selected = path.value[colIndex]
  return selected !== undefined && props.getKey(item) === props.getKey(selected)
}

function selectAt(colIndex: number, item: T) {
  if (props.isDisabled) return
  const newPath = [...path.value.slice(0, colIndex), item]
  const newKeys = newPath.map(props.getKey)
  modelValue.value = newKeys

  const children = childrenOf(item)
  if (!children || !children.length) {
    isOpen.value = false
  } else {
    nextTick(() => focusFirstIn(colIndex + 1))
  }
}

function focusFirstIn(colIndex: number) {
  const col = columnRefs.value[colIndex]
  const first = col?.querySelector<HTMLElement>('[data-slot="cascader-item"]')
  first?.focus()
}

function handleColumnKeydown(ev: KeyboardEvent, colIndex: number, item: T) {
  if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
    ev.preventDefault()
    const col = columnRefs.value[colIndex]
    if (!col) return
    const buttons = Array.from(col.querySelectorAll<HTMLElement>('[data-slot="cascader-item"]'))
    const currentIndex = buttons.indexOf(ev.target as HTMLElement)
    const nextIndex = ev.key === 'ArrowDown'
      ? Math.min(currentIndex + 1, buttons.length - 1)
      : Math.max(currentIndex - 1, 0)
    buttons[nextIndex]?.focus()
    return
  }
  if (ev.key === 'ArrowRight') {
    const children = childrenOf(item)
    if (children && children.length) {
      ev.preventDefault()
      // Re-confirming the already-selected option at this level must not
      // re-commit it — selectAt() truncates anything selected deeper than
      // colIndex, so calling it here would silently clear a fully-selected
      // deeper chain even though the user didn't change this level's
      // selection. Just move focus into the (already-rendered) child
      // column instead.
      if (isActive(item, colIndex)) {
        nextTick(() => focusFirstIn(colIndex + 1))
      } else {
        selectAt(colIndex, item)
      }
    }
    return
  }
  if (ev.key === 'ArrowLeft') {
    if (colIndex > 0) {
      ev.preventDefault()
      focusFirstIn(colIndex - 1)
      const prevCol = columnRefs.value[colIndex - 1]
      const activeButton = prevCol?.querySelector<HTMLElement>('[data-active="true"]')
      activeButton?.focus()
    }
    return
  }
  if (ev.key === 'Enter' || ev.key === ' ') {
    ev.preventDefault()
    selectAt(colIndex, item)
  }
}

function setColumnRef(el: Element | null, colIndex: number) {
  columnRefs.value[colIndex] = el as HTMLElement | null
}

const slotFns = computed(() =>
  cascaderVariants({
    variant: props.variant,
    color: props.color,
    isInvalid: props.isInvalid,
    isDisabled: props.isDisabled,
  }),
)
</script>

<template>
  <div
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    data-slot="cascader-root"
    v-bind="rootDataAttrs"
  >
    <FieldLabel
      v-if="hasLabel"
      :for="generatedId"
      :label="label"
      :is-required="isRequired"
      :class="composeClassName(slotFns.label(), props.classNames?.label)"
    />

    <Popover
      :open="isOpen"
      @update:open="isOpen = $event"
    >
      <PopoverTrigger as-child>
        <button
          :id="generatedId"
          type="button"
          :class="composeClassName(slotFns.trigger(), props.classNames?.trigger)"
          data-slot="cascader-trigger"
          :disabled="isDisabled"
          :aria-invalid="isInvalid || undefined"
          :aria-describedby="ariaDescribedBy"
          :data-disabled="isDisabled || undefined"
        >
          <span
            :class="composeClassName(slotFns.triggerValue(), props.classNames?.trigger)"
            data-slot="cascader-trigger-value"
            :data-placeholder="!path.length || undefined"
          >{{ displayLabel || placeholder }}</span>
          <span
            :class="slotFns.triggerIcon()"
            aria-hidden="true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ><path d="m6 9 6 6 6-6" /></svg>
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        :class="composeClassName(slotFns.panel(), props.classNames?.panel)"
        :aria-label="label ?? 'Cascader options'"
        align="start"
        :side-offset="4"
      >
        <div
          v-for="(column, colIndex) in columns"
          :ref="(el) => setColumnRef(el as Element | null, colIndex)"
          :key="colIndex"
          :class="composeClassName(slotFns.column(), props.classNames?.column)"
          data-slot="cascader-column"
          role="listbox"
          :aria-label="`${label ?? 'Cascader'} level ${colIndex + 1}`"
        >
          <button
            v-for="item in column"
            :key="getKey(item)"
            type="button"
            :class="composeClassName(slotFns.item(), props.classNames?.item)"
            data-slot="cascader-item"
            role="option"
            :aria-selected="isActive(item, colIndex)"
            :data-active="isActive(item, colIndex) || undefined"
            @click="selectAt(colIndex, item)"
            @keydown="handleColumnKeydown($event, colIndex, item)"
          >
            <span>{{ labelOf(item) }}</span>
            <span
              v-if="childrenOf(item)?.length"
              :class="slotFns.itemIcon()"
              aria-hidden="true"
              data-slot="cascader-item-icon"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ><path d="m9 18 6-6-6-6" /></svg>
            </span>
          </button>
        </div>
      </PopoverContent>
    </Popover>

    <FormFieldHelper
      :has-helper="hasHelper"
      :show-error="showError"
      :show-description="showDescription"
      :error-message="errorMessage"
      :description="description"
      :error-message-id="errorMessageId"
      :description-id="descriptionId"
      :wrapper-class="composeClassName(slotFns.helperWrapper(), props.classNames?.helperWrapper)"
      :error-class="composeClassName(slotFns.errorMessage(), props.classNames?.errorMessage)"
      :description-class="composeClassName(slotFns.description(), props.classNames?.description)"
    />
  </div>
</template>
