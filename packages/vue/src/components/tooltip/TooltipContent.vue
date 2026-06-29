<script setup lang="ts">
import { TooltipPortal, TooltipContent } from 'reka-ui'
import { tooltipVariants } from '@auronui/styles/components/tooltip'
import { composeClassName } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  sideFlip?: boolean
  align?: 'start' | 'center' | 'end'
  alignOffset?: number
  alignFlip?: boolean
  avoidCollisions?: boolean
  collisionBoundary?: Element | null | Array<Element | null>
  collisionPadding?: number | Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>
  arrowPadding?: number
  hideShiftedArrow?: boolean
  sticky?: 'partial' | 'always'
  hideWhenDetached?: boolean
  positionStrategy?: 'fixed' | 'absolute'
  updatePositionStrategy?: 'always' | 'optimized'
  disableUpdateOnLayoutShift?: boolean
  prioritizePosition?: boolean
  class?: string
}>(), {
  side: 'top',
  sideOffset: 8,
  align: 'center',
  alignOffset: 0,
  avoidCollisions: true,
  collisionPadding: 8,
  prioritizePosition: true,
})

const emit = defineEmits<{
  'escape-key-down': [event: KeyboardEvent]
  'pointer-down-outside': [event: Event]
}>()

const styles = tooltipVariants()
</script>

<template>
  <TooltipPortal>
    <TooltipContent
      :side="props.side"
      :side-offset="props.sideOffset"
      :align="props.align"
      :align-offset="props.alignOffset"
      :side-flip="props.sideFlip"
      :align-flip="props.alignFlip"
      :avoid-collisions="props.avoidCollisions"
      :collision-boundary="props.collisionBoundary"
      :collision-padding="props.collisionPadding"
      :arrow-padding="props.arrowPadding"
      :hide-shifted-arrow="props.hideShiftedArrow"
      :sticky="props.sticky"
      :hide-when-detached="props.hideWhenDetached"
      :position-strategy="props.positionStrategy"
      :update-position-strategy="props.updatePositionStrategy"
      :disable-update-on-layout-shift="props.disableUpdateOnLayoutShift"
      :prioritize-position="props.prioritizePosition"
      :class="composeClassName(styles.base(), props.class)"
      v-bind="$attrs"
      @escape-key-down="emit('escape-key-down', $event)"
      @pointer-down-outside="emit('pointer-down-outside', $event)"
    >
      <slot />
    </TooltipContent>
  </TooltipPortal>
</template>
