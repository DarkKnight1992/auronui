<script setup lang="ts">
import { computed, ref } from 'vue'
import { Primitive } from 'reka-ui'
import { buttonVariants, type ButtonVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { useButtonGroupInject } from './button-group.context'
import Spinner from '../spinner/Spinner.vue'

const props = withDefaults(defineProps<{
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  radius?: ButtonVariants['radius']
  isIconOnly?: boolean
  fullWidth?: boolean
  disabled?: boolean
  isLoading?: boolean
  as?: string | object
  class?: string
  value?: string | number
}>(), {
  variant: undefined,
  size: undefined,
  radius: undefined,
  isIconOnly: false,
  fullWidth: false,
  disabled: false,
  isLoading: false,
  as: 'button',
  value: undefined,
})

// Inject ButtonGroup context unconditionally with fallback defaults (D-12)
// When no ButtonGroup is present, inject returns these fallback values (no-op)
const groupCtx = useButtonGroupInject({
  variant: ref('primary'),
  size: ref('md'),
  disabled: ref(false),
  fullWidth: ref(false),
  orientation: ref('horizontal'),
  selectionMode: ref('single'),
  selectedValue: ref(null),
  isValueSelected: () => false,
  selectValue: () => {},
})

const isSelected = computed(() => groupCtx.isValueSelected(props.value))

function handleClick() {
  if (props.value !== undefined) groupCtx.selectValue(props.value)
}

// Prop precedence rules (D-13):
// - group disabled ALWAYS wins over child prop
// - all other props: child prop wins over group value (child ?? group)
const isDisabled = computed(() => groupCtx.disabled.value || props.disabled)
const finalVariant = computed(() => props.variant ?? groupCtx.variant.value)
const finalSize = computed(() => props.size ?? groupCtx.size.value)
const finalFullWidth = computed(() => props.fullWidth || groupCtx.fullWidth.value)

const slotFns = computed(() =>
  buttonVariants({
    variant: finalVariant.value,
    size: finalSize.value,
    radius: props.radius,
    isIconOnly: props.isIconOnly,
    fullWidth: finalFullWidth.value,
    isLoading: props.isLoading,
  })
)

// Spinner size scales with button size
const spinnerSize = computed(() => {
  if (finalSize.value === 'xs' || finalSize.value === 'sm') return 'sm' as const
  if (finalSize.value === 'lg' || finalSize.value === 'xl') return 'lg' as const
  return 'md' as const
})
</script>

<template>
  <Primitive
    :as="props.as"
    :class="composeClassName(slotFns.base(), props.class)"
    :disabled="isDisabled || props.isLoading || undefined"
    :data-disabled="isDisabled || undefined"
    :data-loading="props.isLoading || undefined"
    :data-orientation="groupCtx.orientation.value"
    :data-selected="isSelected || undefined"
    v-bind="$attrs"
    @click="handleClick"
  >
    <!-- startContent named slot -->
    <span
      v-if="$slots.startContent"
      :class="slotFns.startContent()"
    >
      <slot name="startContent" />
    </span>

    <!-- default (label) slot -->
    <span :class="slotFns.label()">
      <slot />
    </span>

    <!-- endContent named slot -->
    <span
      v-if="$slots.endContent"
      :class="slotFns.endContent()"
    >
      <slot name="endContent" />
    </span>

    <!-- Loading spinner: absolute-centered, only rendered when isLoading=true (D-08, D-09) -->
    <!-- color="current" inherits --button-fg so spinner contrasts with the button background -->
    <span
      v-if="props.isLoading"
      :class="slotFns.spinner()"
      aria-hidden="true"
      data-slot="spinner"
    >
      <Spinner
        :size="spinnerSize"
        color="current"
      />
    </span>
  </Primitive>
</template>
