<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { AccordionItem as RekaAccordionItem } from 'reka-ui'
import { composeClassName , type ClassValue} from '../../utils/composeClassName'
import { useDeprecatedBooleanProp } from '../../composables/useDeprecatedBooleanProp'
import { useAccordionInject } from './accordion.context'
import { useAccordionItemProvide } from './accordion-item.context'

const props = withDefaults(defineProps<{
  value: string
  isDisabled?: boolean
  /** @deprecated Use isDisabled instead. */
  disabled?: boolean
  unmountOnHide?: boolean
  as?: string
  asChild?: boolean
  class?: ClassValue
  /** Override classes on named slots */
  classNames?: Partial<{
    item: ClassValue
  }>
}>(), {
  isDisabled: undefined,
  disabled: undefined,
})

const isDisabled = useDeprecatedBooleanProp(
  'AccordionItem', 'isDisabled', () => props.isDisabled, 'disabled', () => props.disabled,
)

const ctx = useAccordionInject()

// Capture Reka's exposed per-item `open` ComputedRef via template ref and
// re-provide it downward so AccordionContent can drive its animation from
// synchronous Vue reactivity — no MutationObserver, no CSS-var race.
const rekaRef = useTemplateRef<{ open: { value: boolean } } | null>('reka')
const open = computed(() => rekaRef.value?.open?.value ?? false)
useAccordionItemProvide({ open })
</script>

<template>
  <RekaAccordionItem
    ref="reka"
    :value="props.value"
    :disabled="isDisabled"
    :unmount-on-hide="props.unmountOnHide"
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(ctx.slotFns.value.item(), props.class, props.classNames?.item)"
  >
    <slot />
  </RekaAccordionItem>
</template>
