<script setup lang="ts">
import { computed, toRef, useAttrs } from 'vue'
import { ListboxRoot, ListboxContent, ListboxVirtualizer } from 'reka-ui'
import { listboxVariants, type ListBoxVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useListBoxProvide } from './ListBox.context'
import ListBoxItem from './ListBoxItem.vue'

type ListBoxShorthandItem = { value: string; label?: string; disabled?: boolean; textValue?: string }

// Disable Vue attribute fallthrough — we manually forward ARIA attrs to ListboxContent
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  modelValue?: string | string[]
  defaultValue?: string | string[]
  selectionMode?: 'single' | 'multiple'
  variant?: ListBoxVariants['variant']
  isDisabled?: boolean
  class?: ClassValue
  /**
   * Per-slot class overrides. Each key maps to a named slot in the anatomy;
   * the value is merged with the generated variant classes via `composeClassName`.
   */
  classNames?: Partial<{
    base: ClassValue
  }>
  /** Shorthand API: render list items from an array instead of the compound slot API */
  items?: ListBoxShorthandItem[]
  /** Allow selecting multiple values (alias for selectionMode="multiple"). */
  multiple?: boolean
  /** Orientation of the listbox for keyboard navigation. */
  orientation?: 'horizontal' | 'vertical'
  /** Reading direction for the component. */
  dir?: 'ltr' | 'rtl'
  /** Selection behavior when multiple is true. */
  selectionBehavior?: 'toggle' | 'replace'
  /** Highlight item on hover. */
  highlightOnHover?: boolean
  /** Key used to compare items for equality. */
  by?: string
  /** Render as a different element or component. */
  as?: string
  /** Merge props onto child element instead of rendering a wrapper. */
  asChild?: boolean
  /** Form field name for native form submission. */
  name?: string
  /** Mark the field as required. */
  required?: boolean
  /** Render the ListboxContent as a different element. */
  contentAs?: string
  /** Merge content props onto child element. */
  contentAsChild?: boolean
  /** Hide the selected checkmark on all items (forwarded via context). */
  hideSelectedIcon?: boolean
  /** Enable windowed rendering (opt-in). Renders from `items`. */
  virtualized?: boolean
  /** Estimated row height in px (or per-index fn) for the virtualizer. */
  estimateSize?: number | ((index: number) => number)
  /** Rows rendered outside the visible area. */
  overscan?: number
  /** Scroll-viewport height for the content when scrolling is active. */
  maxHeight?: string | number
}>(), {
  modelValue: undefined,
  defaultValue: undefined,
  selectionMode: 'single',
  variant: 'default',
  isDisabled: false,
  class: undefined,
  multiple: undefined,
  orientation: undefined,
  dir: undefined,
  selectionBehavior: undefined,
  highlightOnHover: undefined,
  by: undefined,
  as: undefined,
  asChild: false,
  name: undefined,
  required: undefined,
  contentAs: undefined,
  contentAsChild: false,
  hideSelectedIcon: false,
  virtualized: false,
  estimateSize: 36,
  overscan: 12,
  maxHeight: '16rem',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | string[] | undefined]
  'highlight': [context: unknown]
  'entry-focus': [event: Event]
  'leave': [event: Event]
}>()

const attrs = useAttrs()

// Provide context for ListBoxItem and ListBoxSection children
useListBoxProvide({
  variant: toRef(props, 'variant'),
  itemVariant: toRef(props, 'variant'),
  isDisabled: toRef(props, 'isDisabled'),
  hideSelectedIcon: toRef(props, 'hideSelectedIcon'),
})

const slotFns = computed(() =>
  listboxVariants({ variant: props.variant })
)

// Bounded scroll viewport only when the content actually needs to scroll, so
// default (non-virtualized) ListBoxes are visually unchanged.
const needsScroll = computed(() => props.virtualized)
const contentStyle = computed(() =>
  needsScroll.value
    ? { maxHeight: typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight, overflowY: 'auto' as const }
    : undefined,
)
</script>

<template>
  <!-- ListboxRoot is an invisible wrapper that manages state; ListboxContent carries role="listbox" -->
  <!-- We forward attrs (aria-label, aria-labelledby, etc.) to ListboxContent, not the root -->
  <ListboxRoot
    :model-value="props.modelValue == null ? undefined : ([] as string[]).concat(props.modelValue)"
    :default-value="props.defaultValue == null ? undefined : ([] as string[]).concat(props.defaultValue)"
    :multiple="props.multiple ?? props.selectionMode === 'multiple'"
    :selection-behavior="props.selectionBehavior ?? (props.selectionMode === 'multiple' ? 'toggle' : 'replace')"
    :disabled="props.isDisabled"
    :orientation="props.orientation"
    :dir="props.dir"
    :highlight-on-hover="props.highlightOnHover"
    :by="props.by"
    :as="props.as"
    :as-child="props.asChild"
    :name="props.name"
    :required="props.required"
    @update:model-value="emit('update:modelValue', props.selectionMode === 'single' ? (Array.isArray($event) ? ($event as string[])[0] : $event as string) : $event as string[])"
    @highlight="emit('highlight', $event)"
    @entry-focus="emit('entry-focus', $event)"
    @leave="emit('leave', $event)"
  >
    <ListboxContent
      v-bind="attrs"
      :as="props.contentAs"
      :as-child="props.contentAsChild"
      :style="contentStyle"
      :class="composeClassName(slotFns, props.class, props.classNames?.base)"
    >
      <ListboxVirtualizer
        v-if="props.virtualized && props.items"
        :options="props.items"
        :estimate-size="props.estimateSize"
        :overscan="props.overscan"
        :text-content="(o) => (o.label ?? o.value)"
      >
        <template #default="{ option, virtualItem }">
          <slot name="item" :item="option" :index="virtualItem.index">
            <ListBoxItem
              :value="option.value"
              :is-disabled="option.disabled"
              :text-value="option.textValue"
            >{{ option.label ?? option.value }}</ListBoxItem>
          </slot>
        </template>
      </ListboxVirtualizer>

      <template v-else-if="props.items">
        <ListBoxItem
          v-for="item in props.items"
          :key="item.value"
          :value="item.value"
          :is-disabled="item.disabled"
          :text-value="item.textValue"
        >{{ item.label ?? item.value }}</ListBoxItem>
      </template>

      <slot v-else />
    </ListboxContent>
  </ListboxRoot>
</template>
