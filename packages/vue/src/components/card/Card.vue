<script setup lang="ts">
import { computed, toRef } from 'vue'
import { cardVariants, type CardVariants } from '@auronui/styles'
import { composeClassName } from '../../utils/composeClassName'
import { useCardProvide } from './card.context'

const props = withDefaults(defineProps<{
  variant?: CardVariants['variant']
  shadow?: CardVariants['shadow']
  radius?: CardVariants['radius']
  isHoverable?: boolean
  isPressable?: boolean
  isDisabled?: boolean
  fullWidth?: boolean
  class?: string
}>(), {
  variant: 'default',
  shadow: 'sm',
  radius: 'lg',
  isHoverable: false,
  isPressable: false,
  isDisabled: false,
  fullWidth: false,
})

const emit = defineEmits<{
  press: [event: MouseEvent | KeyboardEvent]
}>()

useCardProvide({
  variant: toRef(props, 'variant'),
  shadow: toRef(props, 'shadow'),
  radius: toRef(props, 'radius'),
  isHoverable: toRef(props, 'isHoverable'),
  isPressable: toRef(props, 'isPressable'),
  isDisabled: toRef(props, 'isDisabled'),
  fullWidth: toRef(props, 'fullWidth'),
})

const slotFns = computed(() =>
  cardVariants({
    variant: props.variant,
    shadow: props.shadow,
    radius: props.radius,
    isHoverable: props.isHoverable,
    isPressable: props.isPressable,
    isDisabled: props.isDisabled,
    fullWidth: props.fullWidth,
  }),
)

const role = computed(() => (props.isPressable ? 'button' : undefined))
const tabindex = computed(() => (props.isPressable && !props.isDisabled ? 0 : undefined))

function onClick(event: MouseEvent) {
  if (props.isDisabled) return
  if (props.isPressable) emit('press', event)
}

function onKeydown(event: KeyboardEvent) {
  if (!props.isPressable || props.isDisabled) return
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('press', event)
  }
}
</script>

<template>
  <div
    :class="composeClassName(slotFns.base(), props.class)"
    :role="role"
    :tabindex="tabindex"
    :aria-disabled="isDisabled || undefined"
    :data-disabled="isDisabled || undefined"
    @click="onClick"
    @keydown="onKeydown"
  >
    <slot />
  </div>
</template>
