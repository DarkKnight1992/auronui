<script setup lang="ts">
import { computed, ref } from 'vue'
import { ListboxItem, ListboxItemIndicator } from 'reka-ui'
import { listboxItemVariants, type ListBoxItemVariants } from '@auronui/styles'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useListBoxInject } from './ListBox.context'

const props = withDefaults(defineProps<{
  value: string
  textValue?: string
  isDisabled?: boolean
  variant?: ListBoxItemVariants['variant']
  class?: ClassValue
  /** Override classes for individual slots */
  classNames?: Partial<{
    item: ClassValue
    indicator: ClassValue
  }>
  /** Whether the item is disabled. Alias for isDisabled. */
  disabled?: boolean
  /** Render as a different element or component. */
  as?: string
  /** Merge props onto child element instead of rendering a wrapper. */
  asChild?: boolean
  /** Render the ListboxItemIndicator as a different element. */
  indicatorAs?: string
  /** Merge indicator props onto child element. */
  indicatorAsChild?: boolean
}>(), {
  textValue: undefined,
  isDisabled: false,
  variant: undefined,
  class: undefined,
  classNames: undefined,
  disabled: undefined,
  as: undefined,
  asChild: false,
  indicatorAs: undefined,
  indicatorAsChild: false,
})

const emit = defineEmits<{
  'select': [event: Event]
}>()

// Inject context with fallback (standalone usage)
const ctx = useListBoxInject({
  variant: ref('default'),
  itemVariant: ref('default'),
  isDisabled: ref(false),
})

const finalVariant = computed(() => props.variant ?? ctx.itemVariant.value)
const finalDisabled = computed(() => ctx.isDisabled.value || props.isDisabled)

const slotFns = computed(() =>
  listboxItemVariants({ variant: finalVariant.value as ListBoxItemVariants['variant'] })
)
</script>

<template>
  <ListboxItem
    :value="props.value"
    :disabled="props.disabled ?? finalDisabled"
    :text-value="props.textValue ?? props.value"
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(slotFns.item(), props.class, props.classNames?.item)"
    @select="emit('select', $event)"
  >
    <slot name="startContent" />
    <slot />
    <slot name="endContent" />
    <ListboxItemIndicator
      :as="props.indicatorAs"
      :as-child="props.indicatorAsChild"
      :class="composeClassName(slotFns.indicator(), props.classNames?.indicator)"
    >
      <slot name="selectedIcon">
        <!-- Default check icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          data-slot="list-box-item-indicator--checkmark"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </slot>
    </ListboxItemIndicator>
  </ListboxItem>
</template>
