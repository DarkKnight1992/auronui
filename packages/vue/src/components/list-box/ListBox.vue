<script setup lang="ts">
import { computed, ref, toRef, useAttrs, useTemplateRef } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'
import { ListboxRoot, ListboxContent, ListboxVirtualizer } from 'reka-ui'
import { listboxVariants, type ListBoxVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useListBoxProvide } from './ListBox.context'
import ListBoxItem from './ListBoxItem.vue'
import Button from '../button/Button.vue'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

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
    item: ClassValue
    indicator: ClassValue
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
  isRequired?: boolean
  /**
   * Mark the field as required.
   * @deprecated Use isRequired instead.
   */
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
  /** Whether more pages remain to load (gates load-more). */
  hasMore?: boolean
  /** A page is currently loading (gates load-more; drives #loading slot). */
  isLoading?: boolean
  /** Distance in px from the bottom that triggers load-more. */
  loadMoreDistance?: number
  /** How the next page is requested: auto on scroll, or a manual button. */
  loadMode?: 'scroll' | 'button'
  /** Label for the manual load-more button (loadMode="button"). */
  loadMoreLabel?: string
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
  isRequired: undefined,
  required: undefined,
  contentAs: undefined,
  contentAsChild: false,
  hideSelectedIcon: false,
  virtualized: false,
  estimateSize: 36,
  overscan: 12,
  maxHeight: '16rem',
  hasMore: false,
  isLoading: false,
  loadMoreDistance: 120,
  loadMode: 'scroll',
  loadMoreLabel: 'Load more',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | string[] | undefined]
  'highlight': [context: unknown]
  'entry-focus': [event: Event]
  'leave': [event: Event]
  'load-more': []
}>()

const attrs = useAttrs()

const isRequired = useDeprecatedBooleanProp(
  'ListBox', 'isRequired', () => props.isRequired, 'required', () => props.required,
)

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
// useTemplateRef on a Reka component resolves to its instance; useInfiniteScroll's
// internal unrefElement reads `.$el` to get the scroll DOM node.
const contentRef = useTemplateRef<HTMLElement>('content')

// Re-arm latch. useInfiniteScroll keeps re-invoking onLoadMore while the scroll
// element stays at the bottom and canLoadMore is true. Emitting `load-more` does
// not itself flip hasMore/isLoading, so without this guard it fires in a tight
// loop (unbounded emits → hang). We record the item count at the moment we ask
// for a page and refuse to ask again until the dataset actually grows — i.e.
// until the consumer has appended the next page.
const lastRequestedCount = ref(-1)
useInfiniteScroll(
  contentRef,
  () => {
    lastRequestedCount.value = props.items?.length ?? 0
    emit('load-more')
  },
  {
    // Read once at setup: useScroll consumes `offset.bottom` as a raw number
    // (no toValue), so a getter/ref here would break arrival math. Hot-swapping
    // loadMoreDistance after mount is not supported (not a real use case).
    distance: props.loadMoreDistance,
    canLoadMore: () =>
      props.loadMode === 'scroll'
      && props.hasMore
      && !props.isLoading
      && (props.items?.length ?? 0) !== lastRequestedCount.value,
  },
)

// Manual load-more (loadMode="button"). User-driven, so no re-arm latch needed —
// the hasMore/isLoading gate is enough (and the button is disabled while loading).
function requestLoadMore() {
  if (props.hasMore && !props.isLoading) emit('load-more')
}

const needsScroll = computed(() => props.virtualized)
const contentStyle = computed(() =>
  needsScroll.value
    ? { maxHeight: typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight, overflowY: 'auto' as const }
    : undefined,
)

// Stable array references for Reka. Building a fresh array inline on every render
// would retrigger Reka's `watch(modelValue)`, which re-highlights and
// scrollIntoView's the selected/first item — making the list jump to the top on
// any unrelated re-render (e.g. when isLoading toggles during load-more). A
// computed is cached, so the reference only changes when the value really does.
const rekaModelValue = computed(() =>
  props.modelValue == null ? undefined : ([] as string[]).concat(props.modelValue),
)
const rekaDefaultValue = computed(() =>
  props.defaultValue == null ? undefined : ([] as string[]).concat(props.defaultValue),
)
</script>

<template>
  <!-- ListboxRoot is an invisible wrapper that manages state; ListboxContent carries role="listbox" -->
  <!-- We forward attrs (aria-label, aria-labelledby, etc.) to ListboxContent, not the root -->
  <ListboxRoot
    :model-value="rekaModelValue"
    :default-value="rekaDefaultValue"
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
    :required="isRequired"
    @update:model-value="emit('update:modelValue', props.selectionMode === 'single' ? (Array.isArray($event) ? ($event as string[])[0] : $event as string) : $event as string[])"
    @highlight="emit('highlight', $event)"
    @entry-focus="emit('entry-focus', $event)"
    @leave="emit('leave', $event)"
  >
    <ListboxContent
      ref="content"
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
          <slot
            name="item"
            :item="option"
            :index="virtualItem.index"
          >
            <ListBoxItem
              :value="option.value"
              :is-disabled="option.disabled"
              :text-value="option.textValue"
              :class-names="{ item: props.classNames?.item, indicator: props.classNames?.indicator }"
            >
              {{ option.label ?? option.value }}
            </ListBoxItem>
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
          :class-names="{ item: props.classNames?.item, indicator: props.classNames?.indicator }"
        >
          {{ item.label ?? item.value }}
        </ListBoxItem>
      </template>

      <slot v-else />
    </ListboxContent>

    <!-- Bottom area, rendered outside role="listbox" so it does not violate
         aria-required-children. Scroll mode shows a loading row; button mode
         shows a manual "Load more" button (which conveys its own loading state). -->
    <div
      v-if="props.loadMode === 'scroll' && props.isLoading"
      data-slot="list-box-loading"
      role="status"
      aria-live="polite"
    >
      <slot name="loading">
        Loading…
      </slot>
    </div>

    <div
      v-if="props.loadMode === 'button' && props.hasMore"
      class="flex justify-center p-2"
      data-slot="list-box-load-more"
    >
      <slot
        name="loadMore"
        :load-more="requestLoadMore"
        :is-loading="props.isLoading"
        :has-more="props.hasMore"
      >
        <Button
          size="sm"
          :is-loading="props.isLoading"
          :disabled="props.isLoading"
          data-slot="load-more-button"
          @click="requestLoadMore"
        >
          {{ props.loadMoreLabel }}
        </Button>
      </slot>
    </div>
  </ListboxRoot>
</template>
