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
  /** Override classNames for individual slots */
  classNames?: Partial<{
    base: string
    control: string
    indicator: string
    content: string
  }>
}>(), {
  variant: undefined,
  disabled: false,
  class: undefined,
  classNames: undefined,
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
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
  >
    <span :class="composeClassName(slotFns.control(), props.classNames?.control)">
      <RadioGroupIndicator :class="composeClassName(slotFns.indicator(), props.classNames?.indicator)" />
    </span>
    <span :class="composeClassName(slotFns.content(), props.classNames?.content)">
      <slot />
    </span>
  </RadioGroupItem>
</template>
