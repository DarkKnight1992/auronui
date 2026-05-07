<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { RadioGroupItem, RadioGroupIndicator } from 'reka-ui'
import { radioVariants, type RadioGroupVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { useRadioGroupInject } from './radio-group.context'

// Disable Vue attribute fallthrough — we manually forward $attrs to RadioGroupItem
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  value: string
  variant?: RadioGroupVariants['variant']
  disabled?: boolean
  class?: string
}>(), {
  variant: undefined,
  disabled: false,
  class: undefined,
})

const attrs = useAttrs()

// Inject RadioGroup context with fallback defaults (standalone mode)
const groupCtx = useRadioGroupInject({
  variant: ref(undefined),
  disabled: ref(false),
})

// Prop precedence: group disabled wins (D-02)
const isDisabled = computed(() => groupCtx.disabled.value || props.disabled)

// Child variant wins over group variant (used for data-variant attribute propagation)
const finalVariant = computed(() => props.variant ?? groupCtx.variant.value)

const slotFns = computed(() => radioVariants())
</script>

<template>
  <RadioGroupItem
    v-bind="attrs"
    :value="props.value"
    :disabled="isDisabled"
    :data-variant="finalVariant"
    :class="composeClassName(slotFns.base(), props.class)"
  >
    <span :class="slotFns.control()">
      <RadioGroupIndicator :class="slotFns.indicator()" />
    </span>
    <span :class="slotFns.content()">
      <slot />
    </span>
  </RadioGroupItem>
</template>
