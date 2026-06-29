<script setup lang="ts">
import { PopoverPortal, PopoverContent } from 'reka-ui'
import { popoverVariants } from '@auronui/styles/components/popover'
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
  side: 'bottom',
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
  'focus-outside': [event: Event]
  'interact-outside': [event: Event]
  'open-auto-focus': [event: Event]
  'close-auto-focus': [event: Event]
}>()

const styles = popoverVariants()
</script>

<template>
  <PopoverPortal>
    <PopoverContent
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
      @focus-outside="emit('focus-outside', $event)"
      @interact-outside="emit('interact-outside', $event)"
      @open-auto-focus="emit('open-auto-focus', $event)"
      @close-auto-focus="emit('close-auto-focus', $event)"
    >
      <slot />
    </PopoverContent>
  </PopoverPortal>
</template>
