<script setup lang="ts">
import { TabsTrigger } from 'reka-ui'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useTabsInject } from './tabs.context'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'

const props = withDefaults(defineProps<{
  value: string
  isDisabled?: boolean
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean
  class?: ClassValue
  /** Override classes for individual slots. */
  classNames?: Partial<{
    tab: ClassValue
  }>
  /** Render as a different element type. */
  as?: string
  /** Merge props onto child element instead of rendering a wrapper. */
  asChild?: boolean
}>(), {
  isDisabled: undefined,
  disabled: undefined,
})

const ctx = useTabsInject()

const isDisabled = useDeprecatedBooleanProp(
  'Tab', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)
</script>

<template>
  <TabsTrigger
    :value="props.value"
    :disabled="isDisabled"
    :as="props.as"
    :as-child="props.asChild"
    :data-tab-value="props.value"
    :class="composeClassName(ctx.slotFns.value.tab(), props.class, props.classNames?.tab)"
  >
    <slot />
  </TabsTrigger>
</template>
