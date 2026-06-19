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
}>(), {
  textValue: undefined,
  isDisabled: false,
  variant: undefined,
  class: undefined,
  classNames: undefined,
})

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
    :disabled="finalDisabled"
    :text-value="props.textValue ?? props.value"
    :class="composeClassName(slotFns.item(), props.class, props.classNames?.item)"
  >
    <slot name="startContent" />
    <slot />
    <slot name="endContent" />
    <ListboxItemIndicator :class="composeClassName(slotFns.indicator(), props.classNames?.indicator)">
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
