<script setup lang="ts">
import { navigationMenuVariants } from '@auronui/styles'
import { NavigationMenuContent } from 'reka-ui'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'

const props = withDefaults(defineProps<{
  /** Used to force mounting when more control is needed (e.g. custom animation). */
  forceMount?: boolean
  /** When true, disables pointer interaction with elements outside this content. */
  disableOutsidePointerEvents?: boolean
  /** Render as a different element or component. */
  as?: string
  /** Merge props onto child element instead of rendering a wrapper. */
  asChild?: boolean
  class?: ClassValue
}>(), {
  forceMount: undefined,
  disableOutsidePointerEvents: undefined,
  as: undefined,
  asChild: undefined,
  class: undefined,
})

const emit = defineEmits<{
  'escape-key-down': [event: KeyboardEvent]
  'pointer-down-outside': [event: Event]
  'focus-outside': [event: Event]
  'interact-outside': [event: Event]
}>()

const slotFns = navigationMenuVariants()
</script>

<template>
  <NavigationMenuContent
    :force-mount="props.forceMount"
    :disable-outside-pointer-events="props.disableOutsidePointerEvents"
    :as="props.as"
    :as-child="props.asChild"
    :class="composeClassName(slotFns.content(), props.class)"
    @escape-key-down="emit('escape-key-down', $event)"
    @pointer-down-outside="emit('pointer-down-outside', $event)"
    @focus-outside="emit('focus-outside', $event)"
    @interact-outside="emit('interact-outside', $event)"
  >
    <slot />
  </NavigationMenuContent>
</template>
